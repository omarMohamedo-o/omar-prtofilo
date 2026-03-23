"""
Video Analysis Module for INTEGR8 AI Assistant
==============================================

Provides video analysis capabilities using Google Gemini multimodal models.

Features:
- Load videos from local files or URLs
- Extract frames for analysis
- Analyze video content for historical context
- Answer questions about video content

Note:
    This module uses Google Gemini's native video understanding capabilities.
    For longer videos, frame extraction and analysis is performed.

Usage:
    from modules.video_analysis import VideoAnalyzer
    
    analyzer = VideoAnalyzer()
    
    # Analyze video
    response = analyzer.analyze("historical_video.mp4", "What period is this from?")
"""

from __future__ import annotations

import io
import tempfile
from pathlib import Path
from typing import Optional, Union, List, Any
from dataclasses import dataclass

import requests

from google import genai
from google.genai import types

from modules.config import (
    get_settings,
    get_genai_client,
    get_logger,
    VIDEO_ANALYSIS_PROMPT,
)
from modules.image_analysis import is_safe_url, UnsafeURLError


# =============================================================================
# Custom Exceptions
# =============================================================================

class VideoAnalysisError(Exception):
    """Base exception for video analysis errors."""
    pass


class VideoLoadError(VideoAnalysisError):
    """Raised when video cannot be loaded."""
    pass


class VideoTooLargeError(VideoAnalysisError):
    """Raised when video exceeds size limits."""
    pass


class AnalysisError(VideoAnalysisError):
    """Raised when video analysis fails."""
    pass


# =============================================================================
# Configuration
# =============================================================================

@dataclass
class VideoConfig:
    """Video analysis configuration."""
    max_file_size_mb: int = 100
    supported_formats: tuple = (".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v")
    upload_timeout: int = 60
    analysis_timeout: int = 120
    
    @property
    def max_file_size_bytes(self) -> int:
        """Get max file size in bytes."""
        return self.max_file_size_mb * 1024 * 1024


# =============================================================================
# Video Analyzer Class
# =============================================================================

class VideoAnalyzer:
    """
    Production-ready video analyzer using Gemini multimodal models.
    
    This class provides:
    - Video loading from files and URLs
    - Historical video analysis with Gemini
    - Conversation context for follow-up questions
    
    Attributes:
        config: Video processing configuration
        logger: Logger instance
        
    Example:
        analyzer = VideoAnalyzer()
        
        # Analyze video
        response = analyzer.analyze(
            "historical_footage.mp4",
            "Describe the historical events shown"
        )
        print(response)
    """
    
    def __init__(
        self,
        config: Optional[VideoConfig] = None,
        system_prompt: Optional[str] = None,
        model_name: Optional[str] = None,
    ) -> None:
        """
        Initialize the video analyzer.
        
        Args:
            config: Optional custom configuration
            system_prompt: Custom system prompt
            model_name: Gemini model name for analysis
        """
        self.config = config or VideoConfig()
        self.logger = get_logger(__name__)
        self._settings = get_settings()
        self._client = get_genai_client()
        
        self.system_prompt = system_prompt or self._build_video_prompt()
        self.model_name = model_name or self._settings.vision_model
        
        # Build generation config
        self._gen_config = {
            **self._settings.generation_config.to_dict(),
            "safety_settings": self._settings.get_safety_settings_list(),
        }
        
        # Track uploaded files
        self._uploaded_files: dict = {}
    
    def _build_video_prompt(self) -> str:
        """Build system prompt for video analysis."""
        return VIDEO_ANALYSIS_PROMPT
    
    # =========================================================================
    # Video Loading
    # =========================================================================
    
    def _validate_video_path(self, path: Path) -> None:
        """Validate video file exists and is appropriate."""
        if not path.exists():
            raise VideoLoadError(f"Video file not found: {path}")
        
        if not path.is_file():
            raise VideoLoadError(f"Path is not a file: {path}")
        
        # Check file extension
        if path.suffix.lower() not in self.config.supported_formats:
            raise VideoLoadError(
                f"Unsupported video format: {path.suffix}. "
                f"Supported: {', '.join(self.config.supported_formats)}"
            )
        
        # Check file size
        file_size = path.stat().st_size
        if file_size > self.config.max_file_size_bytes:
            raise VideoTooLargeError(
                f"Video file too large: {file_size / 1024 / 1024:.1f} MB. "
                f"Maximum: {self.config.max_file_size_mb} MB"
            )
    
    def _load_video_bytes(
        self,
        source: Union[str, Path],
        timeout: int = 30,
    ) -> tuple[bytes, str]:
        """
        Load video bytes from file or URL.
        
        Returns:
            Tuple of (video_bytes, mime_type)
        """
        source_str = str(source)
        
        if source_str.startswith(("http://", "https://")):
            return self._download_video(source_str, timeout)
        else:
            return self._read_video_file(Path(source_str))
    
    def _read_video_file(self, path: Path) -> tuple[bytes, str]:
        """Read video from local file."""
        self._validate_video_path(path)
        
        self.logger.debug("Loading video from file: %s", path)
        
        # Determine MIME type from extension
        mime_types = {
            ".mp4": "video/mp4",
            ".avi": "video/x-msvideo",
            ".mov": "video/quicktime",
            ".mkv": "video/x-matroska",
            ".webm": "video/webm",
            ".m4v": "video/x-m4v",
        }
        mime_type = mime_types.get(path.suffix.lower(), "video/mp4")
        
        with open(path, "rb") as f:
            return f.read(), mime_type
    
    def _download_video(self, url: str, timeout: int) -> tuple[bytes, str]:
        """Download video from URL with SSRF protection."""
        if not is_safe_url(url):
            raise UnsafeURLError(f"URL failed safety validation: {url}")
        
        self.logger.debug("Downloading video from URL: %s", url)
        
        try:
            response = requests.get(url, timeout=timeout, stream=True)
            response.raise_for_status()
            
            content_type = response.headers.get("content-type", "video/mp4")
            
            # Check size from headers if available
            content_length = response.headers.get("content-length")
            if content_length:
                size = int(content_length)
                if size > self.config.max_file_size_bytes:
                    raise VideoTooLargeError(
                        f"Video too large: {size / 1024 / 1024:.1f} MB"
                    )
            
            return response.content, content_type
            
        except requests.RequestException as e:
            raise VideoLoadError(f"Failed to download video: {e}") from e
    
    # =========================================================================
    # Video Analysis
    # =========================================================================
    
    def analyze(
        self,
        source: Union[str, Path],
        question: str,
    ) -> str:
        """
        Analyze a video and answer a question about it.
        
        Args:
            source: Video file path or URL
            question: Question about the video
            
        Returns:
            Analysis response text
            
        Raises:
            VideoLoadError: If video cannot be loaded
            AnalysisError: If analysis fails
        """
        self.logger.info("Analyzing video: %s", str(source)[:50])
        
        try:
            # Load video bytes
            video_bytes, mime_type = self._load_video_bytes(source)
            
            # Build prompt
            full_prompt = f"{self.system_prompt}\n\nQuestion: {question}"
            
            # Build content with video
            contents = [
                full_prompt,
                types.Part.from_bytes(data=video_bytes, mime_type=mime_type),
            ]
            
            # Call Gemini API
            self.logger.debug("Sending video to Gemini for analysis")
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=self._gen_config,
            )
            
            result = response.text
            self.logger.info("Video analysis complete, response length: %d", len(result))
            
            return result
            
        except (VideoLoadError, UnsafeURLError):
            raise
        except Exception as e:
            self.logger.error("Video analysis failed: %s", e)
            raise AnalysisError(f"Failed to analyze video: {e}") from e
    
    def describe_video(self, source: Union[str, Path]) -> str:
        """
        Get a detailed description of video content.
        
        Args:
            source: Video file path or URL
            
        Returns:
            Detailed video description
        """
        return self.analyze(
            source,
            "Please provide a detailed description of this video, including: "
            "1) A summary of what happens "
            "2) Any historical context or significance "
            "3) Key objects, people, or places shown "
            "4) The apparent time period and location "
            "5) Any notable details"
        )
    
    def identify_historical_elements(self, source: Union[str, Path]) -> str:
        """
        Identify historical elements in a video.
        
        Args:
            source: Video file path or URL
            
        Returns:
            Analysis of historical elements
        """
        return self.analyze(
            source,
            "Analyze this video for historical content. Identify: "
            "1) Historical figures shown or mentioned "
            "2) Historical events depicted "
            "3) Time period and geographical location "
            "4) Historical accuracy assessment "
            "5) Relevant historical context and background"
        )


# =============================================================================
# Convenience Functions
# =============================================================================

# Global analyzer instance
_analyzer: Optional[VideoAnalyzer] = None


def get_video_analyzer() -> VideoAnalyzer:
    """Get or create global video analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = VideoAnalyzer()
    return _analyzer


def analyze_video(
    source: Union[str, Path],
    question: str,
) -> str:
    """
    Analyze a video and answer a question about it.
    
    Args:
        source: Video file path or URL
        question: Question about the video
        
    Returns:
        Analysis response
    """
    return get_video_analyzer().analyze(source, question)


def describe_video(source: Union[str, Path]) -> str:
    """
    Get a detailed description of video content.
    
    Args:
        source: Video file path or URL
        
    Returns:
        Video description
    """
    return get_video_analyzer().describe_video(source)
