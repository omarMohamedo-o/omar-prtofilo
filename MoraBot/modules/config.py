"""
Configuration Module for INTEGR8 AI Assistant
==============================================

Centralized configuration management with type safety, validation,
and production-ready settings for all assistant modules.

Usage:
    from modules.config import get_settings, get_genai_client, get_logger
    
    settings = get_settings()
    client = get_genai_client()
    logger = get_logger(__name__)
"""

from __future__ import annotations

import os
import logging
from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from chromadb.config import Settings as ChromaSettings


# Load environment variables
load_dotenv()


# =============================================================================
# Custom Exceptions
# =============================================================================

class ConfigurationError(Exception):
    """Raised when configuration is invalid or missing."""
    pass


class APIKeyMissingError(ConfigurationError):
    """Raised when required API key is not found."""
    pass


# =============================================================================
# Settings Dataclass
# =============================================================================

@dataclass(frozen=True)
class GenerationConfig:
    """Model generation configuration."""
    temperature: float = 1.0
    top_p: float = 1.0
    top_k: int = 64
    max_output_tokens: int = 8192
    response_mime_type: str = "text/plain"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API calls."""
        return {
            "temperature": self.temperature,
            "top_p": self.top_p,
            "top_k": self.top_k,
            "max_output_tokens": self.max_output_tokens,
            "response_mime_type": self.response_mime_type,
        }


@dataclass(frozen=True)
class SafetySetting:
    """Individual safety setting."""
    category: str
    threshold: str = "BLOCK_MEDIUM_AND_ABOVE"
    
    def to_dict(self) -> Dict[str, str]:
        """Convert to dictionary for API calls."""
        return {
            "category": self.category,
            "threshold": self.threshold,
        }


@dataclass
class Settings:
    """
    Application settings with validation and defaults.
    
    Attributes:
        google_api_key: Google Gemini API key
        openai_api_key: OpenAI API key (for TTS)
        hf_token: Hugging Face Hub token
        persist_directory: ChromaDB persistence directory
        source_directory: Source documents directory
        default_model: Default Gemini model name
        embedding_model: Sentence transformer model name
        whisper_model_size: Whisper model size for speech recognition
        log_level: Logging level
    """
    
    # API Keys
    google_api_key: str = field(default_factory=lambda: os.getenv("GOOGLE_API_KEY", ""))
    openai_api_key: str = field(default_factory=lambda: os.getenv("OPENAI_API_KEY", ""))
    hf_token: str = field(default_factory=lambda: os.getenv("HF_TOKEN", ""))
    
    # Directories
    persist_directory: Path = field(default_factory=lambda: Path("DB/"))
    source_directory: Path = field(default_factory=lambda: Path("SOURCE_DOCUMENTS/"))
    
    # Model settings
    default_model: str = "models/gemini-2.5-flash"
    vision_model: str = "models/gemini-2.5-flash"
    embedding_model: str = "models/gemini-embedding-001"  # Google Gemini Embeddings
    whisper_model_size: str = "small"
    
    # Generation config
    generation_config: GenerationConfig = field(default_factory=GenerationConfig)
    
    # Safety settings
    safety_settings: List[SafetySetting] = field(default_factory=lambda: [
        SafetySetting(category="HARM_CATEGORY_HARASSMENT"),
        SafetySetting(category="HARM_CATEGORY_HATE_SPEECH"),
        SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT"),
        SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT"),
    ])
    
    # Logging - default to WARNING for cleaner output
    log_level: str = field(default_factory=lambda: os.getenv("LOG_LEVEL", "WARNING"))
    
    # ChromaDB settings
    chroma_settings: ChromaSettings = field(default_factory=lambda: ChromaSettings(
        anonymized_telemetry=False,
        is_persistent=True,
    ))
    
    def __post_init__(self) -> None:
        """Validate settings after initialization."""
        self._validate()
    
    def _validate(self) -> None:
        """Validate required settings."""
        if not self.google_api_key:
            raise APIKeyMissingError(
                "GOOGLE_API_KEY environment variable is required. "
                "Please set it in your .env file or environment."
            )
    
    def get_safety_settings_list(self) -> List[Dict[str, str]]:
        """Get safety settings as list of dictionaries."""
        return [s.to_dict() for s in self.safety_settings]
    
    def get_full_config(self) -> Dict[str, Any]:
        """Get complete generation config with safety settings."""
        config = self.generation_config.to_dict()
        config["safety_settings"] = self.get_safety_settings_list()
        return config


# =============================================================================
# Prompts - MORA AI Assistant (Omar's Portfolio)
# =============================================================================

INTEGR8_SYSTEM_PROMPT = """
You are MORA, the AI assistant for Omar Mohamed Abdelsalam's professional portfolio.
Be helpful, friendly, and CONCISE.

IMPORTANT: Give SHORT, direct answers. Only elaborate when specifically asked.

Omar is an RHCSA-certified DevOps Engineer and ML/NLP Engineer from Alexandria, Egypt, specializing in:
- Cloud Infrastructure (AWS, Azure, GCP, Huawei Cloud)
- Infrastructure as Code (Terraform, Ansible)
- CI/CD and Automation (Jenkins, GitHub Actions)
- Containers and Orchestration (Docker, Kubernetes, Helm)
- Security and Monitoring (Vault, Trivy, Prometheus, Grafana)
- Machine Learning (TensorFlow, PyTorch, Scikit-learn, Keras)
- NLP & LLMs (Transformers, LangChain, Hugging Face, RAG, OpenAI/Gemini APIs)
- Data Science (Pandas, NumPy, Feature Engineering, EDA)
- Programming (Python, Bash, C++, PowerShell)

He is currently pursuing a diploma at ITI (Information Technology Institute) and holds
a Bachelor's in Computer Engineering from BHI with a 3.2 GPA.

When asked about Omar, use the knowledge from the documents to provide accurate information
about his skills, experience, projects, education, and certifications.

Previous conversation:
{conversation_history}
""".strip()

# Backward compatibility alias
HISTORICAL_SYSTEM_PROMPT = INTEGR8_SYSTEM_PROMPT


INTEGR8_IMAGE_PROMPT = """
You are MORA, the AI assistant for Omar Mohamed Abdelsalam's portfolio, analyzing an image.

Describe what you see in detail and provide relevant insights. If the image relates 
to DevOps, cloud computing, software development, or Omar's work, highlight relevant 
connections. For all other images, provide helpful and detailed analysis.

Be professional, thorough, and informative. You can analyze any type of image.

User's question: {query}
""".strip()


QA_PROMPT_TEMPLATE = """
You are MORA, Omar Mohamed Abdelsalam's portfolio AI assistant. Answer CONCISELY using the context.

IMPORTANT: Give SHORT, direct answers. Only elaborate if asked.
If context lacks info, say "I don't have that specific information about Omar, but feel free to ask me something else!"

Context:
{context}

Question:
{question}

Answer (be brief):
"""


PDF_QA_PROMPT_TEMPLATE = """
You are MORA, Omar Mohamed Abdelsalam's portfolio AI assistant. Answer using the document context.

IMPORTANT: Give SHORT, direct answers. Only elaborate if asked.

Context:
{context}

Question:
{question}

Answer (be brief):
"""


VIDEO_ANALYSIS_PROMPT = """
You are MORA, Omar's portfolio AI assistant, analyzing video content.

Provide a detailed analysis of the video including:
- Key scenes and content description
- Any relevant context or insights
- If relevant to DevOps, cloud, or software development, highlight connections to Omar's expertise

You can analyze any type of video content.
Be professional, thorough, and informative.

User's question: {query}
""".strip()


# =============================================================================
# Factory Functions
# =============================================================================

@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Get application settings (singleton).
    
    Returns:
        Settings: Validated application settings
        
    Raises:
        APIKeyMissingError: If required API keys are not configured
    """
    return Settings()


@lru_cache(maxsize=1)
def get_genai_client() -> genai.Client:
    """
    Get Google GenAI client (singleton).
    
    Returns:
        genai.Client: Configured GenAI client
        
    Raises:
        APIKeyMissingError: If GOOGLE_API_KEY is not set
    """
    settings = get_settings()
    return genai.Client(api_key=settings.google_api_key)


def get_logger(name: str) -> logging.Logger:
    """
    Get a configured logger instance.
    
    Args:
        name: Logger name (typically __name__)
        
    Returns:
        logging.Logger: Configured logger instance
    """
    settings = get_settings()
    
    # Configure root logger if not already configured
    if not logging.getLogger().handlers:
        logging.basicConfig(
            format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
            level=getattr(logging, settings.log_level.upper(), logging.INFO),
        )
    
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, settings.log_level.upper(), logging.INFO))
    
    return logger


# =============================================================================
# Utility Functions
# =============================================================================

def suppress_library_warnings() -> None:
    """Suppress verbose warnings and logs from third-party libraries."""
    import warnings
    import os
    
    # Suppress all deprecation warnings
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    warnings.filterwarnings("ignore", category=UserWarning)
    
    # Suppress torch deprecation warnings
    warnings.filterwarnings(
        "ignore", 
        message=r"torch.utils._pytree._register_pytree_node is deprecated"
    )
    
    # Suppress verbose library logs
    logging.getLogger("transformers").setLevel(logging.ERROR)
    logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("chromadb").setLevel(logging.WARNING)
    logging.getLogger("google_genai").setLevel(logging.WARNING)
    logging.getLogger("google_genai.models").setLevel(logging.WARNING)
    logging.getLogger("langchain").setLevel(logging.WARNING)
    logging.getLogger("langchain_google_genai").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("PIL").setLevel(logging.WARNING)
    
    # Suppress TensorFlow/CUDA warnings
    os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
    os.environ.setdefault("GRPC_VERBOSITY", "ERROR")