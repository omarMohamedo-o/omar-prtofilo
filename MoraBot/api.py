"""
MORA AI Assistant - FastAPI Backend
====================================

REST API endpoints for Omar's portfolio chatbot, designed for website integration.

Endpoints:
    POST /chat              - Text-based chat with RAG support
    POST /upload            - Upload files (images, audio, PDF, video)
    POST /transcribe        - Transcribe audio/voice messages
    POST /speak             - Text-to-speech (returns audio)
    POST /image_conversation - Analyze image with conversation
    POST /analyze/image     - Analyze an image with a question
    POST /analyze/pdf       - Analyze a PDF document
    POST /analyze/video     - Analyze a video
    GET  /health            - Health check endpoint

Usage:
    uvicorn api:app --host 0.0.0.0 --port 8001 --reload

Author: Omar Mohamed Abdelsalam
Version: 2.0.0
"""

from __future__ import annotations

import os
import tempfile
import uuid
import base64
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

from modules.config import (
    get_logger,
    suppress_library_warnings,
    ConfigurationError,
)


# Suppress verbose library warnings
suppress_library_warnings()

logger = get_logger(__name__)


# =============================================================================
# Pydantic Models
# =============================================================================

class ChatRequest(BaseModel):
    """Request model for chat endpoint - matches frontend expectations."""
    user_input: str = Field(..., min_length=1, max_length=10000, description="User message")
    stream: bool = Field(False, description="Whether to stream response")
    session_id: Optional[str] = Field(None, description="Optional session ID")


class ChatResponse(BaseModel):
    """Response model for chat endpoint - matches frontend expectations."""
    Answer: str = Field(..., description="AI response")
    session_id: str = Field(..., description="Session ID")
    source: str = Field(..., description="Source of response: 'rag' or 'general'")


class ImageConversationRequest(BaseModel):
    """Request model for image conversation endpoint."""
    image_url: str = Field(..., description="URL or path of the image")
    user_input: str = Field(..., min_length=1, max_length=2000, description="Question about the image")
    response_type: str = Field("text", description="Response type: 'text' or 'audio'")
    audio_voice: Optional[str] = Field(None, description="Voice for audio response")
    stream: bool = Field(False, description="Whether to stream response")


class TranscribeResponse(BaseModel):
    """Response model for transcription endpoint."""
    text: str = Field(..., description="Transcribed text")
    language: Optional[str] = Field(None, description="Detected language")


class SpeakRequest(BaseModel):
    """Request model for TTS endpoint."""
    text: str = Field(..., min_length=1, max_length=5000, description="Text to speak")
    voice: str = Field("gtts", description="TTS engine: 'gtts', 'openai'")


class UploadResponse(BaseModel):
    """Response model for file upload."""
    file_url: str = Field(..., description="URL/path of uploaded file")
    filename: str = Field(..., description="Original filename")
    content_type: str = Field(..., description="File MIME type")


class ImageAnalysisRequest(BaseModel):
    """Request model for image URL analysis."""
    image_url: str = Field(..., description="URL of the image to analyze")
    question: str = Field(..., min_length=1, max_length=2000, description="Question about the image")


class AnalysisResponse(BaseModel):
    """Response model for analysis endpoints."""
    response: str = Field(..., description="Analysis result")
    media_type: str = Field(..., description="Type of media analyzed")


class ImageGenerationRequest(BaseModel):
    """Request model for image generation."""
    prompt: str = Field(..., min_length=1, max_length=1000, description="Text description of the image to generate")
    style: Optional[str] = Field("realistic", description="Image style: realistic, artistic, digital_art, oil_painting, watercolor, sketch")


class ImageGenerationResponse(BaseModel):
    """Response model for image generation."""
    image_base64: str = Field(..., description="Base64 encoded PNG image")
    prompt: str = Field(..., description="The prompt used")
    style: str = Field(..., description="Style applied")


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    version: str
    rag_available: bool


class ErrorResponse(BaseModel):
    """Response model for errors."""
    detail: str


# =============================================================================
# Session Management
# =============================================================================

class SessionManager:
    """
    Manages chat sessions with conversation memory.
    
    Each session maintains its own ChatEngine for contextual conversations.
    """
    
    def __init__(self, max_sessions: int = 1000):
        """
        Initialize session manager.
        
        Args:
            max_sessions: Maximum number of concurrent sessions
        """
        self._sessions: dict = {}
        self._max_sessions = max_sessions
    
    def get_or_create_session(self, session_id: Optional[str] = None):
        """
        Get existing session or create a new one.
        
        Args:
            session_id: Optional existing session ID
            
        Returns:
            Tuple of (ChatEngine, session_id)
        """
        from modules.chat import ChatEngine
        
        if session_id and session_id in self._sessions:
            return self._sessions[session_id], session_id
        
        # Create new session
        new_id = session_id or str(uuid.uuid4())
        
        # Evict old sessions if at capacity
        if len(self._sessions) >= self._max_sessions:
            oldest = next(iter(self._sessions))
            del self._sessions[oldest]
        
        self._sessions[new_id] = ChatEngine()
        return self._sessions[new_id], new_id
    
    def clear_session(self, session_id: str) -> bool:
        """
        Clear a session.
        
        Args:
            session_id: Session to clear
            
        Returns:
            True if session was cleared, False if not found
        """
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False


# Initialize session manager
session_manager = SessionManager()


# =============================================================================
# Shared Components (Lazy Initialization)
# =============================================================================

_image_analyzer = None
_pdf_analyzer = None
_video_analyzer = None
_audio_processor = None

# Upload directory for files
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def get_image_analyzer():
    """Get or create image analyzer instance."""
    global _image_analyzer
    if _image_analyzer is None:
        from modules.image_analysis import ImageAnalyzer
        _image_analyzer = ImageAnalyzer()
    return _image_analyzer


def get_pdf_analyzer():
    """Get or create PDF analyzer instance."""
    global _pdf_analyzer
    if _pdf_analyzer is None:
        from modules.pdf_analysis import PDFAnalyzer
        _pdf_analyzer = PDFAnalyzer()
    return _pdf_analyzer


def get_video_analyzer():
    """Get or create video analyzer instance."""
    global _video_analyzer
    if _video_analyzer is None:
        from modules.video_analysis import VideoAnalyzer
        _video_analyzer = VideoAnalyzer()
    return _video_analyzer


def get_audio_processor():
    """Get or create audio processor instance."""
    global _audio_processor
    if _audio_processor is None:
        from modules.audio import AudioProcessor
        _audio_processor = AudioProcessor()
    return _audio_processor


# =============================================================================
# Application Lifespan
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown."""
    logger.info("Starting INTEGR8 API v1.0.0")
    yield
    logger.info("Shutting down INTEGR8 API")


# =============================================================================
# FastAPI Application
# =============================================================================

app = FastAPI(
    title="MORA AI Assistant API",
    description="REST API for Omar's portfolio chatbot with RAG, voice, and media analysis",
    version="2.0.0",
    lifespan=lifespan,
    responses={
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
    },
)

# Configure CORS for website integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    Health check endpoint.
    
    Returns the API status and whether RAG is available.
    """
    try:
        from modules.chat import ChatEngine
        engine = ChatEngine()
        rag_available = engine.has_rag
    except Exception:
        rag_available = False
    
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        rag_available=rag_available,
    )


@app.post(
    "/chat",
    response_model=ChatResponse,
    tags=["Chat"],
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
    },
)
async def chat(request: ChatRequest):
    """
    Process a chat message and return AI response.
    
    Uses RAG (Retrieval-Augmented Generation) when context is available,
    falls back to general conversation otherwise.
    
    Args:
        request: ChatRequest containing user_input and optional session_id
        
    Returns:
        ChatResponse with the AI response (Answer field) and session information
    """
    try:
        engine, session_id = session_manager.get_or_create_session(request.session_id)
        
        # Use chat_with_source to know if RAG was used
        response, is_rag = engine.chat_with_source(request.user_input)
        
        return ChatResponse(
            Answer=response,
            session_id=session_id,
            source="rag" if is_rag else "general",
        )
        
    except ConfigurationError as e:
        logger.error("Configuration error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Service configuration error",
        )
    except Exception as e:
        error_msg = str(e).lower()
        # Check for rate limit errors
        if '429' in error_msg or 'rate limit' in error_msg or 'quota' in error_msg:
            logger.warning("Rate limit hit: %s", e)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="API rate limit exceeded. Please wait a moment and try again.",
                headers={"Retry-After": "30"},
            )
        logger.error("Chat error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process message: {str(e)}",
        )


@app.post("/session/{session_id}/clear", tags=["Session"])
async def clear_session(session_id: str):
    """
    Clear a chat session.
    
    Args:
        session_id: The session ID to clear
        
    Returns:
        Success message
    """
    cleared = session_manager.clear_session(session_id)
    if cleared:
        return {"message": "Session cleared successfully"}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Session not found",
    )


# =============================================================================
# File Upload Endpoint
# =============================================================================

@app.post(
    "/upload",
    response_model=UploadResponse,
    tags=["Files"],
)
async def upload_file(
    file: UploadFile = File(..., description="File to upload"),
):
    """
    Upload a file (image, audio, PDF, video) for later processing.
    
    Returns:
        UploadResponse with file_url for use in other endpoints
    """
    try:
        # Generate unique filename
        ext = os.path.splitext(file.filename or "file")[1]
        unique_name = f"{uuid.uuid4()}{ext}"
        file_path = UPLOAD_DIR / unique_name
        
        # Save file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        return UploadResponse(
            file_url=str(file_path),
            filename=file.filename or "unknown",
            content_type=file.content_type or "application/octet-stream",
        )
        
    except Exception as e:
        logger.error("File upload error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}",
        )


# =============================================================================
# Voice/Audio Endpoints
# =============================================================================

@app.post(
    "/transcribe",
    response_model=TranscribeResponse,
    tags=["Voice"],
)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
):
    """
    Transcribe an audio/voice message using Whisper.
    
    Supports: WAV, MP3, WEBM, OGG, M4A, FLAC
    
    Returns:
        TranscribeResponse with transcribed text
    """
    allowed_types = {
        "audio/wav", "audio/wave", "audio/x-wav",
        "audio/mp3", "audio/mpeg",
        "audio/webm",
        "audio/ogg",
        "audio/m4a", "audio/x-m4a",
        "audio/flac",
    }
    
    # Be lenient with content type checking
    content_type = file.content_type or ""
    
    try:
        # Save to temporary file
        suffix = os.path.splitext(file.filename or "audio.webm")[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        wav_path = None
        try:
            # Convert webm/ogg to wav for better Whisper compatibility
            if suffix.lower() in ['.webm', '.ogg', '.m4a']:
                import subprocess
                wav_path = tmp_path.replace(suffix, '.wav')
                try:
                    result = subprocess.run(
                        ['ffmpeg', '-y', '-i', tmp_path, '-ar', '16000', '-ac', '1', '-f', 'wav', wav_path],
                        capture_output=True,
                        timeout=30
                    )
                    if result.returncode == 0 and os.path.exists(wav_path):
                        logger.info("Converted %s to WAV for transcription", suffix)
                        audio_path = wav_path
                    else:
                        logger.warning("FFmpeg conversion failed, using original: %s", result.stderr)
                        audio_path = tmp_path
                except FileNotFoundError:
                    logger.warning("FFmpeg not found, using original audio")
                    audio_path = tmp_path
                except subprocess.TimeoutExpired:
                    logger.warning("FFmpeg conversion timed out, using original")
                    audio_path = tmp_path
            else:
                audio_path = tmp_path
            
            processor = get_audio_processor()
            text = processor.transcribe_audio(audio_path)
            
            return TranscribeResponse(
                text=text.strip(),
                language=None,  # Could detect language if needed
            )
        finally:
            os.unlink(tmp_path)
            if wav_path and os.path.exists(wav_path):
                os.unlink(wav_path)
            
    except Exception as e:
        logger.error("Transcription error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to transcribe audio: {str(e)}",
        )


@app.post(
    "/speak",
    tags=["Voice"],
    response_class=Response,
)
async def speak_text(request: SpeakRequest):
    """
    Convert text to speech and return audio file.
    
    Returns:
        Audio file (MP3) as binary response
    """
    try:
        from gtts import gTTS
        import langid
        
        # Clean text
        cleaned_text = request.text.replace("*", "").replace("\n", " ").replace("#", "")
        
        if not cleaned_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty text provided",
            )
        
        # Detect language
        lang_code, _ = langid.classify(cleaned_text)
        
        # Generate audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tts = gTTS(text=cleaned_text, lang=lang_code, slow=False)
            tts.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            with open(tmp_path, "rb") as f:
                audio_data = f.read()
            
            return Response(
                content=audio_data,
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": "attachment; filename=speech.mp3",
                },
            )
        finally:
            os.unlink(tmp_path)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("TTS error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate speech: {str(e)}",
        )


# =============================================================================
# Image Conversation Endpoint (Frontend Compatible)
# =============================================================================

@app.post(
    "/image_conversation",
    tags=["Analysis"],
)
async def image_conversation(request: ImageConversationRequest):
    """
    Analyze an image and answer a question about it.
    
    This endpoint is designed for frontend compatibility.
    
    Args:
        request: ImageConversationRequest with image_url and user_input
        
    Returns:
        Response with Answer field matching frontend expectations
    """
    try:
        analyzer = get_image_analyzer()
        
        # Load image from URL or path
        image = analyzer.load_image(request.image_url)
        response = analyzer.analyze(image, request.user_input)
        
        # Return in format frontend expects
        return {
            "Answer": response,
            "media_type": "image",
        }
        
    except Exception as e:
        logger.error("Image conversation error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze image: {str(e)}",
        )


@app.post(
    "/analyze/image/url",
    response_model=AnalysisResponse,
    tags=["Analysis"],
)
async def analyze_image_url(request: ImageAnalysisRequest):
    """
    Analyze an image from URL and answer a question about it.
    
    Args:
        request: ImageAnalysisRequest with image URL and question
        
    Returns:
        Analysis response
    """
    try:
        analyzer = get_image_analyzer()
        image = analyzer.load_image(request.image_url)
        response = analyzer.analyze(image, request.question)
        
        return AnalysisResponse(
            response=response,
            media_type="image",
        )
        
    except Exception as e:
        logger.error("Image analysis error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze image: {str(e)}",
        )


@app.post(
    "/analyze/image/upload",
    response_model=AnalysisResponse,
    tags=["Analysis"],
)
async def analyze_image_upload(
    file: UploadFile = File(..., description="Image file to analyze"),
    question: str = Form(..., description="Question about the image"),
):
    """
    Analyze an uploaded image and answer a question about it.
    
    Args:
        file: Uploaded image file
        question: Question about the image
        
    Returns:
        Analysis response
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )
    
    try:
        # Save to temporary file
        suffix = os.path.splitext(file.filename or "image.jpg")[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            analyzer = get_image_analyzer()
            image = analyzer.load_image(tmp_path)
            response = analyzer.analyze(image, question)
            
            return AnalysisResponse(
                response=response,
                media_type="image",
            )
        finally:
            # Clean up
            os.unlink(tmp_path)
            
    except Exception as e:
        logger.error("Image analysis error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze image: {str(e)}",
        )


@app.post(
    "/analyze/pdf",
    response_model=AnalysisResponse,
    tags=["Analysis"],
)
async def analyze_pdf(
    file: UploadFile = File(..., description="PDF file to analyze"),
    question: str = Form(..., description="Question about the PDF"),
):
    """
    Analyze an uploaded PDF document and answer a question about it.
    
    Args:
        file: Uploaded PDF file
        question: Question about the document
        
    Returns:
        Analysis response
    """
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF files are allowed.",
        )
    
    try:
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            analyzer = get_pdf_analyzer()
            analyzer.load_pdf(tmp_path)
            response = analyzer.ask(question)
            
            return AnalysisResponse(
                response=response,
                media_type="pdf",
            )
        finally:
            # Clean up
            os.unlink(tmp_path)
            
    except Exception as e:
        logger.error("PDF analysis error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze PDF: {str(e)}",
        )


@app.post(
    "/analyze/video",
    response_model=AnalysisResponse,
    tags=["Analysis"],
)
async def analyze_video(
    file: UploadFile = File(..., description="Video file to analyze"),
    question: str = Form(..., description="Question about the video"),
):
    """
    Analyze an uploaded video and answer a question about it.
    
    Args:
        file: Uploaded video file
        question: Question about the video
        
    Returns:
        Analysis response
    """
    # Validate file type
    allowed_types = {"video/mp4", "video/mpeg", "video/quicktime", "video/webm"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )
    
    try:
        # Save to temporary file
        suffix = os.path.splitext(file.filename or "video.mp4")[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            analyzer = get_video_analyzer()
            response = analyzer.analyze(tmp_path, question)
            
            return AnalysisResponse(
                response=response,
                media_type="video",
            )
        finally:
            # Clean up
            os.unlink(tmp_path)
            
    except Exception as e:
        logger.error("Video analysis error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze video: {str(e)}",
        )


@app.post(
    "/generate/image",
    response_model=ImageGenerationResponse,
    tags=["Generation"],
)
async def generate_image(request: ImageGenerationRequest):
    """
    Generate an image from a text prompt using Imagen 3.
    
    Args:
        request: ImageGenerationRequest with prompt and style
        
    Returns:
        ImageGenerationResponse with base64 encoded image
    """
    try:
        from modules.image_generation import (
            ImageGenerator,
            ImageStyle,
            ImageGenerationError,
        )
        
        # Map style string to enum
        style_map = {
            "realistic": ImageStyle.REALISTIC,
            "artistic": ImageStyle.ARTISTIC,
            "digital_art": ImageStyle.DIGITAL_ART,
            "oil_painting": ImageStyle.OIL_PAINTING,
            "watercolor": ImageStyle.WATERCOLOR,
            "sketch": ImageStyle.SKETCH,
            "historical": ImageStyle.HISTORICAL,
        }
        
        style = style_map.get(request.style.lower(), ImageStyle.REALISTIC)
        
        generator = ImageGenerator()
        result = generator.generate(
            prompt=request.prompt,
            style=style,
            enhance=True,
        )
        
        return ImageGenerationResponse(
            image_base64=result.to_base64(),
            prompt=result.prompt,
            style=result.style.value,
        )
        
    except ImageGenerationError as e:
        logger.error("Image generation error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate image: {str(e)}",
        )
    except Exception as e:
        error_msg = str(e).lower()
        if 'not available' in error_msg or 'not supported' in error_msg:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Image generation is not available with your current API plan.",
            )
        logger.error("Image generation error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate image: {str(e)}",
        )


# =============================================================================
# Main Entry Point
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
