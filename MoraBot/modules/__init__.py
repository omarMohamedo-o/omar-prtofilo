"""
INTEGR8 AI Assistant Modules
============================

A professional AI assistant with support for:
- 🧠 Image Analysis
- 🖼️ Image Generation  
- 📄 PDF Analysis
- 🎥 Video Analysis
- 🎙️ Audio/Speech Recognition
- 💬 Text Chat with RAG

Usage:
    from modules import get_settings, get_logger
    from modules.chat import ChatEngine
    from modules.image_analysis import ImageAnalyzer
    from modules.pdf_analysis import PDFAnalyzer
    from modules.audio import AudioProcessor
    from modules.video_analysis import VideoAnalyzer
    from modules.image_generation import ImageGenerator
"""

__version__ = "2.0.0"
__author__ = "INTEGR8 Team"

# Configuration
from modules.config import (
    get_settings,
    get_genai_client,
    get_logger,
    suppress_library_warnings,
    Settings,
    GenerationConfig,
    SafetySetting,
    ConfigurationError,
    APIKeyMissingError,
    INTEGR8_SYSTEM_PROMPT,
    INTEGR8_IMAGE_PROMPT,
    HISTORICAL_SYSTEM_PROMPT,  # Backward compatibility
    QA_PROMPT_TEMPLATE,
    PDF_QA_PROMPT_TEMPLATE,
    VIDEO_ANALYSIS_PROMPT,
)

# Chat
from modules.chat import (
    ChatEngine,
    retrieval_qa_pipeline,
    chat,
    chat_general,
    get_chat_engine,
    ChatError,
    DatabaseNotFoundError,
    QueryError,
)

# Audio
from modules.audio import (
    AudioProcessor,
    AudioConfig,
    recognize_speech,
    process_user_voice,
    process_audio_path,
    wav_to_text,
    text_to_speech,
    voice,
    hear_response,
    speek,
    get_processor,
    AudioError,
    SpeechRecognitionError,
    AudioPlaybackError,
    TranscriptionError,
)

# Image Analysis
from modules.image_analysis import (
    ImageAnalyzer,
    ConversationMemory,
    load_and_analyze,
    analyze_image,
    identify_url_content_type,
    is_safe_url,
    get_analyzer,
    ImageAnalysisError,
    ImageLoadError,
    UnsafeURLError,
    AnalysisError,
)

# PDF Analysis
from modules.pdf_analysis import (
    PDFAnalyzer,
    load_pdf,
    ask_pdf,
    get_pdf_analyzer,
    PDFAnalysisError,
    PDFLoadError,
    EmbeddingError,
)

# Video Analysis
from modules.video_analysis import (
    VideoAnalyzer,
    VideoConfig,
    analyze_video,
    describe_video,
    get_video_analyzer,
    VideoAnalysisError,
    VideoLoadError,
    VideoTooLargeError,
)

# Image Generation
from modules.image_generation import (
    ImageGenerator,
    GeneratedImage,
    ImageStyle,
    ImageSize,
    generate_image,
    generate_historical_scene,
    get_image_generator,
    ImageGenerationError,
    GenerationNotAvailableError,
    InvalidPromptError,
    SaveError,
)


__all__ = [
    # Version
    "__version__",
    "__author__",
    
    # Configuration
    "get_settings",
    "get_genai_client",
    "get_logger",
    "suppress_library_warnings",
    "Settings",
    "GenerationConfig",
    "SafetySetting",
    "ConfigurationError",
    "APIKeyMissingError",
    "INTEGR8_SYSTEM_PROMPT",
    "INTEGR8_IMAGE_PROMPT",
    "HISTORICAL_SYSTEM_PROMPT",
    "QA_PROMPT_TEMPLATE",
    "PDF_QA_PROMPT_TEMPLATE",
    "VIDEO_ANALYSIS_PROMPT",
    
    # Chat
    "ChatEngine",
    "retrieval_qa_pipeline",
    "chat",
    "chat_general",
    "get_chat_engine",
    "ChatError",
    "DatabaseNotFoundError",
    "QueryError",
    
    # Audio
    "AudioProcessor",
    "AudioConfig",
    "recognize_speech",
    "process_user_voice",
    "process_audio_path",
    "wav_to_text",
    "text_to_speech",
    "voice",
    "hear_response",
    "speek",
    "get_processor",
    "AudioError",
    "SpeechRecognitionError",
    "AudioPlaybackError",
    "TranscriptionError",
    
    # Image Analysis
    "ImageAnalyzer",
    "ConversationMemory",
    "load_and_analyze",
    "analyze_image",
    "identify_url_content_type",
    "is_safe_url",
    "get_analyzer",
    "ImageAnalysisError",
    "ImageLoadError",
    "UnsafeURLError",
    "AnalysisError",
    
    # PDF Analysis
    "PDFAnalyzer",
    "load_pdf",
    "ask_pdf",
    "get_pdf_analyzer",
    "PDFAnalysisError",
    "PDFLoadError",
    "EmbeddingError",
    
    # Video Analysis
    "VideoAnalyzer",
    "VideoConfig",
    "analyze_video",
    "describe_video",
    "get_video_analyzer",
    "VideoAnalysisError",
    "VideoLoadError",
    "VideoTooLargeError",
    
    # Image Generation
    "ImageGenerator",
    "GeneratedImage",
    "ImageStyle",
    "ImageSize",
    "generate_image",
    "generate_historical_scene",
    "get_image_generator",
    "ImageGenerationError",
    "GenerationNotAvailableError",
    "InvalidPromptError",
    "SaveError",
]
