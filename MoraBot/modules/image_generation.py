"""
Image Generation Module for INTEGR8 AI Assistant
================================================

Provides AI-powered image generation capabilities using Google Gemini
and other image generation APIs.

Features:
- Generate historical scene images from text descriptions
- Create visualizations of historical events
- Generate period-accurate artistic renditions
- Save generated images to various formats

Note:
    This module is designed for future expansion when Google's Imagen
    or other image generation capabilities become available through
    the Gemini API.

Usage:
    from modules.image_generation import ImageGenerator
    
    generator = ImageGenerator()
    
    # Generate historical image
    image = generator.generate(
        "Ancient Egyptian pharaoh's throne room with hieroglyphics"
    )
    image.save("throne_room.png")
"""

from __future__ import annotations

import io
import base64
from pathlib import Path
from typing import Optional, Union, List
from dataclasses import dataclass, field
from enum import Enum

from PIL import Image
from google.genai import types

from modules.config import (
    get_settings,
    get_genai_client,
    get_logger,
)


# =============================================================================
# Custom Exceptions
# =============================================================================

class ImageGenerationError(Exception):
    """Base exception for image generation errors."""
    pass


class GenerationNotAvailableError(ImageGenerationError):
    """Raised when image generation is not available."""
    pass


class InvalidPromptError(ImageGenerationError):
    """Raised when prompt is invalid."""
    pass


class SaveError(ImageGenerationError):
    """Raised when image cannot be saved."""
    pass


# =============================================================================
# Enums
# =============================================================================

class ImageStyle(Enum):
    """Available image generation styles."""
    REALISTIC = "realistic"
    ARTISTIC = "artistic"
    SKETCH = "sketch"
    OIL_PAINTING = "oil painting"
    WATERCOLOR = "watercolor"
    DIGITAL_ART = "digital art"
    HISTORICAL = "historical photograph"
    ANCIENT = "ancient artifact style"


class ImageSize(Enum):
    """Standard image sizes."""
    SMALL = (512, 512)
    MEDIUM = (768, 768)
    LARGE = (1024, 1024)
    WIDE = (1024, 576)
    TALL = (576, 1024)


# =============================================================================
# Configuration
# =============================================================================

@dataclass
class GenerationConfig:
    """Image generation configuration."""
    default_style: ImageStyle = ImageStyle.REALISTIC
    default_size: ImageSize = ImageSize.MEDIUM
    default_quality: str = "high"
    historical_context: bool = True
    max_prompt_length: int = 1000
    
    # Historical enhancement settings
    enhance_historical_accuracy: bool = True
    default_time_period: Optional[str] = None


# =============================================================================
# Generated Image Container
# =============================================================================

@dataclass
class GeneratedImage:
    """
    Container for generated image with metadata.
    
    Attributes:
        image: PIL Image object
        prompt: The prompt used for generation
        style: Style applied
        metadata: Additional generation metadata
    """
    image: Image.Image
    prompt: str
    style: ImageStyle
    metadata: dict = field(default_factory=dict)
    
    def save(
        self,
        path: Union[str, Path],
        format: str = "PNG",
        **kwargs,
    ) -> Path:
        """
        Save the generated image to a file.
        
        Args:
            path: Output file path
            format: Image format (PNG, JPEG, etc.)
            **kwargs: Additional save options
            
        Returns:
            Path to saved file
        """
        path = Path(path)
        
        # Ensure directory exists
        path.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            self.image.save(path, format=format, **kwargs)
            return path
        except Exception as e:
            raise SaveError(f"Failed to save image: {e}") from e
    
    def to_bytes(self, format: str = "PNG") -> bytes:
        """Convert image to bytes."""
        buffer = io.BytesIO()
        self.image.save(buffer, format=format)
        return buffer.getvalue()
    
    def to_base64(self, format: str = "PNG") -> str:
        """Convert image to base64 string."""
        return base64.b64encode(self.to_bytes(format)).decode("utf-8")
    
    @property
    def size(self) -> tuple[int, int]:
        """Get image dimensions."""
        return self.image.size


# =============================================================================
# Image Generator Class
# =============================================================================

class ImageGenerator:
    """
    AI-powered image generator using Google Imagen 3.
    
    This class provides:
    - Text-to-image generation with historical context
    - Multiple artistic styles
    - Historical accuracy enhancement
    
    Example:
        generator = ImageGenerator()
        
        # Generate with style
        image = generator.generate(
            "Cleopatra's palace in Alexandria",
            style=ImageStyle.ARTISTIC
        )
        
        # Save result
        image.save("cleopatra_palace.png")
    """
    
    # Imagen model name
    IMAGEN_MODEL = "imagen-3.0-generate-002"
    
    def __init__(
        self,
        config: Optional[GenerationConfig] = None,
    ) -> None:
        """
        Initialize the image generator.
        
        Args:
            config: Optional custom configuration
        """
        self.config = config or GenerationConfig()
        self.logger = get_logger(__name__)
        self._settings = get_settings()
        self._client = get_genai_client()
    
    # =========================================================================
    # Prompt Enhancement
    # =========================================================================
    
    def _enhance_prompt(
        self,
        prompt: str,
        style: ImageStyle,
        time_period: Optional[str] = None,
    ) -> str:
        """
        Enhance prompt for better historical accuracy.
        
        Args:
            prompt: Original prompt
            style: Desired style
            time_period: Historical time period context
            
        Returns:
            Enhanced prompt
        """
        enhanced_parts = []
        
        # Add style modifier
        if style != ImageStyle.REALISTIC:
            enhanced_parts.append(f"{style.value} style")
        
        # Add historical context
        if self.config.enhance_historical_accuracy:
            enhanced_parts.append("historically accurate")
            enhanced_parts.append("period-appropriate details")
        
        # Add time period if specified
        if time_period or self.config.default_time_period:
            period = time_period or self.config.default_time_period
            enhanced_parts.append(f"from the {period}")
        
        # Combine with original prompt
        if enhanced_parts:
            modifier = ", ".join(enhanced_parts)
            return f"{prompt}, {modifier}"
        
        return prompt
    
    def _validate_prompt(self, prompt: str) -> str:
        """
        Validate and clean prompt.
        
        Args:
            prompt: Input prompt
            
        Returns:
            Validated prompt
            
        Raises:
            InvalidPromptError: If prompt is invalid
        """
        prompt = prompt.strip()
        
        if not prompt:
            raise InvalidPromptError("Prompt cannot be empty")
        
        if len(prompt) > self.config.max_prompt_length:
            raise InvalidPromptError(
                f"Prompt too long: {len(prompt)} chars. "
                f"Maximum: {self.config.max_prompt_length}"
            )
        
        return prompt
    
    # =========================================================================
    # Image Generation
    # =========================================================================
    
    def generate(
        self,
        prompt: str,
        style: Optional[ImageStyle] = None,
        size: Optional[ImageSize] = None,
        time_period: Optional[str] = None,
        enhance: bool = True,
        num_images: int = 1,
    ) -> GeneratedImage:
        """
        Generate an image from a text prompt using Imagen 3.
        
        Args:
            prompt: Text description of the image to generate
            style: Artistic style to apply
            size: Image dimensions
            time_period: Historical time period for context
            enhance: Whether to enhance the prompt
            num_images: Number of images to generate (returns first)
            
        Returns:
            GeneratedImage container with the generated image
            
        Raises:
            InvalidPromptError: If prompt is invalid
            ImageGenerationError: If generation fails
        """
        # Use defaults if not specified
        style = style or self.config.default_style
        size = size or self.config.default_size
        
        # Validate prompt
        prompt = self._validate_prompt(prompt)
        
        # Enhance prompt if requested
        if enhance:
            enhanced_prompt = self._enhance_prompt(prompt, style, time_period)
        else:
            enhanced_prompt = prompt
        
        self.logger.info("Generating image with Imagen: %s", enhanced_prompt[:50])
        
        try:
            # Use Imagen 3 API
            response = self._client.models.generate_images(
                model=self.IMAGEN_MODEL,
                prompt=enhanced_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=num_images,
                    aspect_ratio="1:1",  # Square images
                    safety_filter_level="BLOCK_MEDIUM_AND_ABOVE",
                    person_generation="ALLOW_ADULT",
                ),
            )
            
            # Extract image from response
            if response.generated_images and len(response.generated_images) > 0:
                generated = response.generated_images[0]
                
                # Convert to PIL Image
                image_bytes = generated.image.image_bytes
                img = Image.open(io.BytesIO(image_bytes))
                
                self.logger.info("Image generated successfully")
                
                return GeneratedImage(
                    image=img,
                    prompt=enhanced_prompt,
                    style=style,
                    metadata={
                        "model": self.IMAGEN_MODEL,
                        "original_prompt": prompt,
                        "enhanced": enhance,
                    },
                )
            else:
                raise ImageGenerationError("No images generated in response")
                
        except Exception as e:
            error_msg = str(e).lower()
            if 'not available' in error_msg or 'not supported' in error_msg or 'permission' in error_msg:
                self.logger.warning("Imagen API not available, trying Gemini image generation")
                return self._generate_with_gemini(enhanced_prompt, style, size.value)
            
            self.logger.error("Image generation failed: %s", e)
            raise ImageGenerationError(f"Failed to generate image: {e}") from e
    
    def _generate_with_gemini(
        self,
        prompt: str,
        style: ImageStyle,
        size: tuple[int, int],
    ) -> GeneratedImage:
        """
        Generate image using Gemini 2.5 Flash Image model.
        
        Fallback when Imagen is not available.
        """
        import time
        import re
        
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                # Use Gemini 2.5 Flash Image model
                response = self._client.models.generate_content(
                    model="gemini-2.5-flash-image",
                    contents=[prompt],
                )
                
                # Extract image from response parts
                for part in response.parts:
                    if part.inline_data is not None:
                        # Use the as_image() method from the SDK
                        img = part.as_image()
                        
                        self.logger.info("Image generated with Gemini 2.5 Flash Image")
                        
                        return GeneratedImage(
                            image=img,
                            prompt=prompt,
                            style=style,
                            metadata={
                                "model": "gemini-2.5-flash-image",
                                "fallback": True,
                            },
                        )
                
                raise ImageGenerationError("No image in Gemini response")
                
            except Exception as e:
                error_str = str(e)
                if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
                    # Extract retry delay from error message
                    match = re.search(r'retry in (\d+\.?\d*)', error_str.lower())
                    wait_time = float(match.group(1)) if match else 15.0
                    
                    if attempt < max_retries - 1:
                        self.logger.info(f"Rate limited, waiting {wait_time:.1f}s (attempt {attempt + 1}/{max_retries})")
                        time.sleep(wait_time)
                        continue
                
                self.logger.warning("Gemini image generation failed: %s, using placeholder", e)
                return self._generate_placeholder(prompt, style, size)
        
        return self._generate_placeholder(prompt, style, size)
    
    def _generate_placeholder(
        self,
        prompt: str,
        style: ImageStyle,
        size: tuple[int, int],
    ) -> GeneratedImage:
        """
        Generate a placeholder image.
        
        This is used when actual generation API is not available.
        Creates a labeled image indicating what would be generated.
        """
        from PIL import ImageDraw, ImageFont
        
        # Create placeholder image
        img = Image.new("RGB", size, color=(50, 50, 60))
        draw = ImageDraw.Draw(img)
        
        # Add text
        text_lines = [
            "INTEGR8",
            "Image Generation",
            "",
            f"Prompt: {prompt[:40]}...",
            f"Style: {style.value}",
            f"Size: {size[0]}x{size[1]}",
            "",
            "Coming Soon",
        ]
        
        y_offset = 50
        for line in text_lines:
            draw.text((20, y_offset), line, fill=(200, 200, 200))
            y_offset += 30
        
        self.logger.info("Generated placeholder image")
        
        return GeneratedImage(
            image=img,
            prompt=prompt,
            style=style,
            metadata={
                "type": "placeholder",
                "size": size,
                "note": "Actual generation requires Imagen API access",
            },
        )
    
    def generate_historical_scene(
        self,
        description: str,
        era: str,
        location: Optional[str] = None,
        style: ImageStyle = ImageStyle.ARTISTIC,
    ) -> GeneratedImage:
        """
        Generate a historical scene with specific era context.
        
        Args:
            description: Scene description
            era: Historical era (e.g., "Ancient Egypt", "Medieval Europe")
            location: Specific location
            style: Artistic style
            
        Returns:
            GeneratedImage of the historical scene
        """
        location_str = f" in {location}" if location else ""
        
        prompt = f"{description}{location_str} during the {era}"
        
        return self.generate(
            prompt=prompt,
            style=style,
            time_period=era,
            enhance=True,
        )
    
    def generate_portrait(
        self,
        figure: str,
        context: Optional[str] = None,
        style: ImageStyle = ImageStyle.OIL_PAINTING,
    ) -> GeneratedImage:
        """
        Generate a portrait of a historical figure.
        
        Args:
            figure: Historical figure name or description
            context: Additional context (location, event, etc.)
            style: Artistic style
            
        Returns:
            GeneratedImage portrait
        """
        context_str = f", {context}" if context else ""
        prompt = f"Portrait of {figure}{context_str}"
        
        return self.generate(
            prompt=prompt,
            style=style,
            enhance=True,
        )


# =============================================================================
# Convenience Functions
# =============================================================================

# Global generator instance
_generator: Optional[ImageGenerator] = None


def get_image_generator() -> ImageGenerator:
    """Get or create global image generator instance."""
    global _generator
    if _generator is None:
        _generator = ImageGenerator()
    return _generator


def generate_image(
    prompt: str,
    style: Optional[ImageStyle] = None,
) -> GeneratedImage:
    """
    Generate an image from a text prompt.
    
    Args:
        prompt: Text description
        style: Artistic style
        
    Returns:
        GeneratedImage container
    """
    return get_image_generator().generate(prompt, style=style)


def generate_historical_scene(
    description: str,
    era: str,
    location: Optional[str] = None,
) -> GeneratedImage:
    """
    Generate a historical scene.
    
    Args:
        description: Scene description
        era: Historical era
        location: Optional location
        
    Returns:
        GeneratedImage of the scene
    """
    return get_image_generator().generate_historical_scene(
        description, era, location
    )
