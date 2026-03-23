"""
Audio Module for INTEGR8 AI Assistant
=====================================

Provides speech recognition, text-to-speech, and audio processing
capabilities with production-ready error handling.

Features:
- Speech recognition via Google Speech API
- Speech-to-text transcription via Whisper
- Text-to-speech via gTTS, pyttsx3, and OpenAI TTS
- Audio playback with pygame

Usage:
    from modules.audio import (
        AudioProcessor,
        recognize_speech,
        transcribe_audio,
        speak_text,
    )
    
    processor = AudioProcessor()
    text = processor.recognize_speech()
    processor.speak(response)
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import Optional, Union, Literal
from dataclasses import dataclass, field
from contextlib import contextmanager

import speech_recognition as sr
import langid
import pyttsx3
import pyaudio
import pygame
from gtts import gTTS
from faster_whisper import WhisperModel
from openai import OpenAI

from modules.config import get_settings, get_logger, suppress_library_warnings


# Suppress verbose warnings
suppress_library_warnings()


# =============================================================================
# Custom Exceptions
# =============================================================================

class AudioError(Exception):
    """Base exception for audio processing errors."""
    pass


class SpeechRecognitionError(AudioError):
    """Raised when speech cannot be recognized."""
    pass


class AudioPlaybackError(AudioError):
    """Raised when audio playback fails."""
    pass


class TranscriptionError(AudioError):
    """Raised when audio transcription fails."""
    pass


# =============================================================================
# Configuration
# =============================================================================

@dataclass
class AudioConfig:
    """Audio processing configuration."""
    whisper_model_size: str = "small"
    whisper_device: str = "cpu"
    whisper_compute_type: str = "int8"
    tts_engine_rate: int = 160
    ambient_noise_duration: float = 2.0
    min_input_length: int = 3
    audio_format: str = "mp3"
    temp_filename: str = "output.mp3"
    
    @property
    def cpu_threads(self) -> int:
        """Get optimal CPU thread count."""
        return os.cpu_count() or 4


# =============================================================================
# Audio Processor Class
# =============================================================================

class AudioProcessor:
    """
    Production-ready audio processor for speech recognition and synthesis.
    
    This class provides a unified interface for:
    - Recording audio from microphone
    - Transcribing audio files using Whisper
    - Converting text to speech using multiple engines
    
    Attributes:
        config: Audio processing configuration
        logger: Logger instance for this class
        
    Example:
        processor = AudioProcessor()
        
        # Record and transcribe
        text = processor.record_and_transcribe()
        
        # Speak response
        processor.speak("Hello, I am the INTEGR8 AI Assistant!")
    """
    
    def __init__(self, config: Optional[AudioConfig] = None) -> None:
        """
        Initialize the audio processor.
        
        Args:
            config: Optional custom configuration. Uses defaults if not provided.
        """
        self.config = config or AudioConfig()
        self.logger = get_logger(__name__)
        self._settings = get_settings()
        
        # Initialize components lazily
        self._recognizer: Optional[sr.Recognizer] = None
        self._microphone: Optional[sr.Microphone] = None
        self._whisper_model: Optional[WhisperModel] = None
        self._openai_client: Optional[OpenAI] = None
        self._pyttsx_engine: Optional[pyttsx3.Engine] = None
    
    # =========================================================================
    # Lazy Initialization
    # =========================================================================
    
    @property
    def recognizer(self) -> sr.Recognizer:
        """Get or create speech recognizer."""
        if self._recognizer is None:
            self._recognizer = sr.Recognizer()
        return self._recognizer
    
    @property
    def microphone(self) -> sr.Microphone:
        """Get or create microphone source."""
        if self._microphone is None:
            self._microphone = sr.Microphone()
        return self._microphone
    
    @property
    def whisper_model(self) -> WhisperModel:
        """Get or create Whisper model."""
        if self._whisper_model is None:
            self.logger.info("Loading Whisper model: %s", self.config.whisper_model_size)
            self._whisper_model = WhisperModel(
                self.config.whisper_model_size,
                device=self.config.whisper_device,
                compute_type=self.config.whisper_compute_type,
                cpu_threads=self.config.cpu_threads,
                num_workers=self.config.cpu_threads,
            )
        return self._whisper_model
    
    @property
    def openai_client(self) -> Optional[OpenAI]:
        """Get OpenAI client for TTS."""
        if self._openai_client is None and self._settings.openai_api_key:
            self._openai_client = OpenAI(api_key=self._settings.openai_api_key)
        return self._openai_client
    
    # =========================================================================
    # Speech Recognition
    # =========================================================================
    
    def recognize_speech(self) -> str:
        """
        Record audio from microphone and recognize speech using Google Speech API.
        
        Returns:
            Recognized text from speech
            
        Raises:
            SpeechRecognitionError: If speech cannot be recognized
        """
        self.logger.info("Starting speech recognition...")
        
        try:
            with self.microphone as source:
                self.logger.debug("Listening for speech...")
                print("Listening...")
                audio = self.recognizer.listen(source)
            
            text = self.recognizer.recognize_google(audio)
            self.logger.info("Recognized: %s", text)
            print(f"You said: {text}")
            return text
            
        except sr.UnknownValueError as e:
            self.logger.warning("Could not understand speech")
            raise SpeechRecognitionError("Could not understand what you said.") from e
            
        except sr.RequestError as e:
            self.logger.error("Google Speech API error: %s", e)
            raise SpeechRecognitionError(f"Could not connect to Google Speech: {e}") from e
    
    def record_and_transcribe(self) -> Optional[str]:
        """
        Record audio from microphone and transcribe using Whisper.
        
        This method adjusts for ambient noise before recording for
        improved accuracy.
        
        Returns:
            Transcribed text or None if too short/error
        """
        self.logger.info("Recording audio for Whisper transcription...")
        
        try:
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(
                    source, 
                    duration=self.config.ambient_noise_duration
                )
                self.logger.debug("Adjusted for ambient noise")
                print("\nListening...\n")
                audio = self.recognizer.listen(source)
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                f.write(audio.get_wav_data())
                temp_path = f.name
            
            try:
                text = self.transcribe_audio(temp_path)
                
                if len(text.strip()) < self.config.min_input_length:
                    self.logger.warning("Input too short: '%s'", text)
                    print("No input detected. Please try again.")
                    return None
                
                self.logger.info("Transcribed: %s", text)
                print(f"User: {text}")
                return text
                
            finally:
                # Clean up temp file
                Path(temp_path).unlink(missing_ok=True)
                
        except Exception as e:
            self.logger.error("Recording/transcription error: %s", e)
            return None
    
    def transcribe_audio(self, audio_path: Union[str, Path]) -> str:
        """
        Transcribe an audio file using Whisper.
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            Transcribed text
            
        Raises:
            TranscriptionError: If transcription fails
        """
        audio_path = Path(audio_path)
        
        if not audio_path.exists():
            raise TranscriptionError(f"Audio file not found: {audio_path}")
        
        self.logger.debug("Transcribing: %s", audio_path)
        
        try:
            segments, _ = self.whisper_model.transcribe(str(audio_path))
            text = "".join(segment.text for segment in segments)
            return text
            
        except Exception as e:
            self.logger.error("Whisper transcription failed: %s", e)
            raise TranscriptionError(f"Failed to transcribe audio: {e}") from e
    
    # =========================================================================
    # Text-to-Speech
    # =========================================================================
    
    def speak(
        self, 
        text: str, 
        engine: Literal["gtts", "pyttsx3", "openai"] = "gtts"
    ) -> None:
        """
        Convert text to speech and play audio.
        
        Args:
            text: Text to speak
            engine: TTS engine to use ("gtts", "pyttsx3", or "openai")
        """
        # Clean text
        cleaned_text = self._clean_text_for_speech(text)
        
        if not cleaned_text.strip():
            self.logger.warning("Empty text provided for speech")
            return
        
        self.logger.debug("Speaking with %s engine: %s...", engine, cleaned_text[:50])
        
        if engine == "gtts":
            self._speak_gtts(cleaned_text)
        elif engine == "pyttsx3":
            self._speak_pyttsx3(cleaned_text)
        elif engine == "openai":
            self._speak_openai(cleaned_text)
        else:
            raise ValueError(f"Unknown TTS engine: {engine}")
    
    def _clean_text_for_speech(self, text: str) -> str:
        """Remove special characters that disrupt speech."""
        return text.replace("*", "").replace("\n", " ").replace("#", "")
    
    def _speak_gtts(self, text: str, filename: str = "output.mp3") -> None:
        """Speak using Google TTS."""
        try:
            # Detect language
            lang_code, _ = langid.classify(text)
            
            # Generate audio
            tts = gTTS(text=text, lang=lang_code, slow=False, tld="co.uk")
            tts.save(filename)
            
            # Play audio
            self._play_audio_file(filename)
            
        except Exception as e:
            self.logger.error("gTTS error: %s", e)
            raise AudioPlaybackError(f"Failed to speak with gTTS: {e}") from e
            
        finally:
            # Cleanup
            Path(filename).unlink(missing_ok=True)
    
    def _speak_pyttsx3(self, text: str) -> None:
        """Speak using pyttsx3 engine."""
        try:
            if self._pyttsx_engine is None:
                self._pyttsx_engine = pyttsx3.init()
                self._pyttsx_engine.setProperty("rate", self.config.tts_engine_rate)
                voices = self._pyttsx_engine.getProperty("voices")
                if len(voices) > 1:
                    self._pyttsx_engine.setProperty("voice", voices[1].id)
            
            self._pyttsx_engine.say(text)
            self._pyttsx_engine.runAndWait()
            
        except Exception as e:
            self.logger.error("pyttsx3 error: %s", e)
            raise AudioPlaybackError(f"Failed to speak with pyttsx3: {e}") from e
    
    def _speak_openai(self, text: str) -> None:
        """Speak using OpenAI TTS with streaming."""
        if not self.openai_client:
            raise AudioPlaybackError("OpenAI API key not configured for TTS")
        
        try:
            player_stream = pyaudio.PyAudio().open(
                format=pyaudio.paInt16,
                channels=1,
                rate=24000,
                output=True,
            )
            
            stream_started = False
            silence_threshold = 0.01
            
            with self.openai_client.audio.speech.with_streaming_response.create(
                model="tts-1",
                voice="alloy",
                response_format="pcm",
                input=text,
            ) as response:
                for chunk in response.iter_bytes(chunk_size=1024):
                    if stream_started:
                        player_stream.write(chunk)
                    elif max(chunk) > silence_threshold:
                        player_stream.write(chunk)
                        stream_started = True
                        
        except Exception as e:
            self.logger.error("OpenAI TTS error: %s", e)
            raise AudioPlaybackError(f"Failed to speak with OpenAI: {e}") from e
    
    def _play_audio_file(self, filepath: Union[str, Path]) -> None:
        """Play an audio file using pygame."""
        filepath = str(filepath)
        
        try:
            pygame.mixer.init()
            pygame.mixer.music.load(filepath)
            pygame.mixer.music.play()
            
            # Wait for playback to finish
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
                
        finally:
            pygame.mixer.music.stop()
            pygame.mixer.quit()


# =============================================================================
# Convenience Functions (Backward Compatibility)
# =============================================================================

# Global processor instance
_processor: Optional[AudioProcessor] = None


def get_processor() -> AudioProcessor:
    """Get or create global audio processor instance."""
    global _processor
    if _processor is None:
        _processor = AudioProcessor()
    return _processor


def recognize_speech() -> str:
    """
    Record and recognize speech from microphone.
    
    Returns:
        Recognized text
        
    Raises:
        SpeechRecognitionError: If recognition fails
    """
    return get_processor().recognize_speech()


def process_user_voice() -> Optional[str]:
    """
    Record and transcribe user voice using Whisper.
    
    Returns:
        Transcribed text or None
    """
    return get_processor().record_and_transcribe()


def process_audio_path(audio_path: Union[str, Path]) -> Optional[str]:
    """
    Transcribe an audio file.
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        Transcribed text or None
    """
    processor = get_processor()
    try:
        text = processor.transcribe_audio(audio_path)
        if len(text.strip()) < 3:
            print("No input detected. Please try again.")
            return None
        print(f"User: {text}")
        return text
    except TranscriptionError as e:
        print(f"Transcription error: {e}")
        return None


def wav_to_text(audio_path: Union[str, Path]) -> str:
    """
    Transcribe a WAV file to text.
    
    Args:
        audio_path: Path to WAV file
        
    Returns:
        Transcribed text
    """
    return get_processor().transcribe_audio(audio_path)


def text_to_speech(text: str) -> None:
    """
    Convert text to speech using pyttsx3.
    
    Args:
        text: Text to speak
    """
    get_processor().speak(text, engine="pyttsx3")


def voice(text: str, filename: str = "output.mp3") -> None:
    """
    Convert text to speech using gTTS.
    
    Args:
        text: Text to speak
        filename: Temporary audio filename (ignored, uses default)
    """
    get_processor().speak(text, engine="gtts")


def hear_response(text: str, filename: str = "output.mp3") -> str:
    """
    Speak response text using gTTS.
    
    Args:
        text: Text to speak
        filename: Output filename (for compatibility)
        
    Returns:
        Filename used
    """
    get_processor().speak(text, engine="gtts")
    return filename


def speek(text: str) -> None:
    """
    Stream speech using OpenAI TTS.
    
    Args:
        text: Text to speak
    """
    get_processor().speak(text, engine="openai")
