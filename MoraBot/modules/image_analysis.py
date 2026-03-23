"""
Image Analysis Module for INTEGR8 AI Assistant
==============================================

Provides image loading, analysis, and historical context extraction
using Google Gemini vision models.

Features:
- Load images from local files or URLs (with SSRF protection)
- Analyze images for historical context
- Extract detailed information about depicted objects, people, and places
- Maintain conversation history for contextual follow-up questions

Usage:
    from modules.image_analysis import ImageAnalyzer
    
    analyzer = ImageAnalyzer()
    
    # Load and analyze image
    img = analyzer.load_image("path/to/image.jpg")
    response = analyzer.analyze(img, "What historical period is this from?")
"""

from __future__ import annotations

import io
import ipaddress
from pathlib import Path
from typing import Optional, Union, List, Tuple
from urllib.parse import urlparse
from dataclasses import dataclass, field

import requests
from PIL import Image

from google import genai
from google.genai import types

from modules.config import (
    get_settings,
    get_genai_client,
    get_logger,
    INTEGR8_IMAGE_PROMPT,
)


# =============================================================================
# Custom Exceptions
# =============================================================================

class ImageAnalysisError(Exception):
    """Base exception for image analysis errors."""
    pass


class ImageLoadError(ImageAnalysisError):
    """Raised when image cannot be loaded."""
    pass


class UnsafeURLError(ImageAnalysisError):
    """Raised when URL is potentially unsafe (SSRF protection)."""
    pass


class AnalysisError(ImageAnalysisError):
    """Raised when image analysis fails."""
    pass


# =============================================================================
# URL Safety Utilities
# =============================================================================

def is_safe_url(url: str) -> bool:
    """
    Validate URL safety to prevent SSRF attacks.
    
    Args:
        url: URL to validate
        
    Returns:
        True if URL is safe, False otherwise
        
    Note:
        - Only allows http and https schemes
        - Blocks localhost and loopback addresses
        - Blocks private IP ranges
    """
    try:
        parsed = urlparse(url)
        
        # Only allow http/https
        if parsed.scheme not in ("http", "https"):
            return False
        
        host = parsed.hostname or ""
        
        # Block obvious local hosts
        if host.lower() in {"localhost", "127.0.0.1", "::1"}:
            return False
        
        # If hostname is an IP, block private/loopback ranges
        try:
            ip = ipaddress.ip_address(host)
            if ip.is_private or ip.is_loopback or ip.is_reserved:
                return False
        except ValueError:
            # Non-IP hostname - generally safe
            pass
        
        return True
        
    except Exception:
        return False


def identify_url_content_type(url: str, timeout: int = 10) -> str:
    """
    Identify content type of a URL.
    
    Args:
        url: URL to check
        timeout: Request timeout in seconds
        
    Returns:
        Content type string: "image", "pdf", or "unknown"
        
    Raises:
        UnsafeURLError: If URL fails safety check
    """
    if not is_safe_url(url):
        raise UnsafeURLError(f"URL failed safety validation: {url}")
    
    try:
        response = requests.head(url, allow_redirects=True, timeout=timeout)
        content_type = response.headers.get("content-type", "").lower()
        
        if "image" in content_type:
            return "image"
        elif "pdf" in content_type:
            return "pdf"
        else:
            # Fallback: check file extension
            parsed_url = urlparse(url)
            extension = Path(parsed_url.path).suffix.lower()
            
            if extension in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}:
                return "image"
            elif extension == ".pdf":
                return "pdf"
            
            return "unknown"
            
    except requests.RequestException as e:
        raise ImageLoadError(f"Failed to identify URL content: {e}") from e


# =============================================================================
# Conversation Memory
# =============================================================================

@dataclass
class ConversationMessage:
    """Single message in conversation history."""
    role: str  # "user" or "assistant"
    content: str


@dataclass
class ConversationMemory:
    """
    Manages conversation history for contextual analysis.
    
    Attributes:
        messages: List of conversation messages
        max_messages: Maximum messages to retain
    """
    messages: List[ConversationMessage] = field(default_factory=list)
    max_messages: int = 50
    
    def add_user_message(self, content: str) -> None:
        """Add a user message to history."""
        self.messages.append(ConversationMessage(role="user", content=content))
        self._trim()
    
    def add_assistant_message(self, content: str) -> None:
        """Add an assistant message to history."""
        self.messages.append(ConversationMessage(role="assistant", content=content))
        self._trim()
    
    def _trim(self) -> None:
        """Trim messages to max limit."""
        if len(self.messages) > self.max_messages:
            self.messages = self.messages[-self.max_messages:]
    
    def get_context_string(self) -> str:
        """Get conversation history as formatted string."""
        return "\n".join(
            f"{msg.role.title()}: {msg.content}" 
            for msg in self.messages
        )
    
    def clear(self) -> None:
        """Clear conversation history."""
        self.messages.clear()


# =============================================================================
# Image Analyzer Class
# =============================================================================

class ImageAnalyzer:
    """
    Production-ready image analyzer using Gemini vision models.
    
    This class provides:
    - Safe image loading from files and URLs
    - Historical image analysis with Gemini
    - Conversation context for follow-up questions
    
    Attributes:
        memory: Conversation memory for contextual analysis
        logger: Logger instance
        
    Example:
        analyzer = ImageAnalyzer()
        
        # Load image
        img = analyzer.load_image("historical_photo.jpg")
        
        # Analyze with question
        response = analyzer.analyze(img, "What era is this from?")
        print(response)
        
        # Follow-up question (uses conversation context)
        response = analyzer.analyze(img, "Who are the people shown?")
    """
    
    def __init__(
        self,
        system_prompt: Optional[str] = None,
        model_name: Optional[str] = None,
    ) -> None:
        """
        Initialize the image analyzer.
        
        Args:
            system_prompt: Custom system prompt (uses default if not provided)
            model_name: Gemini model name (uses settings default if not provided)
        """
        self.logger = get_logger(__name__)
        self._settings = get_settings()
        self._client = get_genai_client()
        
        self.system_prompt = system_prompt or INTEGR8_IMAGE_PROMPT
        self.model_name = model_name or self._settings.vision_model
        self.memory = ConversationMemory()
        
        # Build generation config
        self._config = {
            **self._settings.generation_config.to_dict(),
            "safety_settings": self._settings.get_safety_settings_list(),
        }
    
    # =========================================================================
    # Image Loading
    # =========================================================================
    
    def load_image(
        self,
        source: Union[str, Path],
        timeout: int = 15,
    ) -> Image.Image:
        """
        Load image from file path or URL.
        
        Args:
            source: Local file path or HTTP(S) URL
            timeout: Request timeout for URLs (seconds)
            
        Returns:
            PIL Image object
            
        Raises:
            ImageLoadError: If image cannot be loaded
            UnsafeURLError: If URL fails safety check
        """
        source_str = str(source)
        
        if source_str.startswith(("http://", "https://")):
            return self._load_from_url(source_str, timeout)
        else:
            return self._load_from_file(Path(source_str))
    
    def _load_from_file(self, path: Path) -> Image.Image:
        """Load image from local file."""
        if not path.exists():
            raise ImageLoadError(f"Image file not found: {path}")
        
        if not path.is_file():
            raise ImageLoadError(f"Path is not a file: {path}")
        
        try:
            self.logger.debug("Loading image from file: %s", path)
            img = Image.open(path)
            img.load()  # Force load to catch format errors early
            return img
            
        except Exception as e:
            raise ImageLoadError(f"Failed to load image: {e}") from e
    
    def _load_from_url(self, url: str, timeout: int) -> Image.Image:
        """Load image from URL with SSRF protection."""
        if not is_safe_url(url):
            raise UnsafeURLError(f"URL failed safety validation: {url}")
        
        try:
            self.logger.debug("Downloading image from URL: %s", url)
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()
            
            img = Image.open(io.BytesIO(response.content))
            img.load()  # Force load
            return img
            
        except requests.RequestException as e:
            raise ImageLoadError(f"Failed to download image: {e}") from e
        except Exception as e:
            raise ImageLoadError(f"Failed to process image data: {e}") from e
    
    # =========================================================================
    # Image Analysis
    # =========================================================================
    
    def analyze(
        self,
        image: Image.Image,
        question: str,
        include_history: bool = True,
    ) -> str:
        """
        Analyze image and answer question about it.
        
        Args:
            image: PIL Image to analyze
            question: Question about the image
            include_history: Whether to include conversation history
            
        Returns:
            Analysis response text
            
        Raises:
            AnalysisError: If analysis fails
        """
        self.logger.info("Analyzing image with question: %s", question[:50])
        
        # Update memory
        self.memory.add_user_message(question)
        
        # Build full prompt with context
        if include_history:
            context = self.memory.get_context_string()
            full_prompt = f"{self.system_prompt}\n\n{context}"
        else:
            full_prompt = f"{self.system_prompt}\n\nUser: {question}"
        
        try:
            # Convert image to bytes
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            image_bytes = buffer.getvalue()
            
            # Build content for API
            contents = [
                full_prompt,
                types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
            ]
            
            # Call Gemini API
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=self._config,
            )
            
            result = response.text
            self.memory.add_assistant_message(result)
            
            self.logger.info("Analysis complete, response length: %d", len(result))
            return result
            
        except Exception as e:
            self.logger.error("Image analysis failed: %s", e)
            raise AnalysisError(f"Failed to analyze image: {e}") from e
    
    def analyze_from_source(
        self,
        source: Union[str, Path],
        question: str,
        include_history: bool = True,
    ) -> Tuple[Image.Image, str]:
        """
        Load image from source and analyze it.
        
        Convenience method that combines load_image and analyze.
        
        Args:
            source: Image source (file path or URL)
            question: Question about the image
            include_history: Whether to include conversation history
            
        Returns:
            Tuple of (loaded image, analysis response)
        """
        image = self.load_image(source)
        response = self.analyze(image, question, include_history)
        return image, response
    
    def clear_history(self) -> None:
        """Clear conversation history."""
        self.memory.clear()
        self.logger.info("Conversation history cleared")


# =============================================================================
# Convenience Functions (Backward Compatibility)
# =============================================================================

# Global analyzer instance
_analyzer: Optional[ImageAnalyzer] = None


def get_analyzer() -> ImageAnalyzer:
    """Get or create global image analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = ImageAnalyzer()
    return _analyzer


def analyze_image(
    image: Image.Image,
    question: str,
) -> str:
    """
    Analyze an image and answer a question about it.
    
    Args:
        image: PIL Image object
        question: Question about the image
        
    Returns:
        Analysis response
    """
    return get_analyzer().analyze(image, question)


def load_and_analyze(
    source: Union[str, Path],
    question: str,
) -> str:
    """
    Load an image from source and analyze it.
    
    Args:
        source: Image file path or URL
        question: Question about the image
        
    Returns:
        Analysis response
    """
    _, response = get_analyzer().analyze_from_source(source, question)
    return response
