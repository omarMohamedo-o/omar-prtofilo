#!/usr/bin/env python3
"""
MORA AI Assistant - Portfolio Chatbot
======================================

AI assistant for Omar Mohamed Abdelsalam's professional portfolio, specializing in:
- DevOps & Cloud Infrastructure
- CI/CD & Automation
- Technical Q&A about Omar's skills and experience
- Project information and certifications

Features:
- Text-based conversation with RAG support
- Voice-based conversation with Whisper transcription
- Image analysis with Gemini vision
- PDF document analysis and Q&A
- Video analysis

Usage:
    python chatbot.py
    
    Or import and use programmatically:
    
    from chatbot import MORAChatbot
    
    bot = MORAChatbot()
    response = bot.chat("Tell me about Omar's DevOps experience")

Author: Omar Mohamed Abdelsalam
Version: 2.0.0
"""

from __future__ import annotations

import sys
from typing import Optional, Callable
from dataclasses import dataclass

# Import modules
from modules.config import (
    get_settings,
    get_logger,
    suppress_library_warnings,
    ConfigurationError,
)
from modules.audio import (
    AudioProcessor,
    recognize_speech,
    process_user_voice,
    hear_response,
    SpeechRecognitionError,
)
from modules.image_analysis import (
    ImageAnalyzer,
    identify_url_content_type,
    ImageLoadError,
    UnsafeURLError,
)
from modules.pdf_analysis import (
    PDFAnalyzer,
    PDFLoadError,
)
from modules.video_analysis import VideoAnalyzer
from modules.image_generation import ImageGenerator
from modules.chat import (
    ChatEngine,
    retrieval_qa_pipeline,
    DatabaseNotFoundError,
    RateLimitError,
)


# Suppress verbose library warnings
suppress_library_warnings()


# =============================================================================
# Configuration
# =============================================================================

@dataclass
class ConversationMode:
    """Conversation mode constants."""
    TEXT = "t"
    VOICE = "v"
    IMAGE = "i"
    IMAGE_GEN = "g"
    PDF = "p"
    VIDEO = "vid"
    EXIT = ("quit", "q", "exit")


# =============================================================================
# MORA Chatbot Class
# =============================================================================

class MORAChatbot:
    """
    Main MORA AI Assistant orchestrator for Omar's portfolio.
    
    This class coordinates all chatbot functionalities:
    - Text and voice conversations about Omar's background
    - Image and PDF analysis
    - Video analysis
    - Response handling and memory
    
    Attributes:
        chat_engine: Engine for text conversations
        audio_processor: Audio recording and playback
        image_analyzer: Image analysis with Gemini
        pdf_analyzer: PDF document analysis
        video_analyzer: Video content analysis
        
    Example:
        bot = MORAChatbot()
        
        # Text conversation
        response = bot.chat("Tell me about Omar's DevOps skills")
        
        # Image analysis
        response = bot.analyze_image("project.jpg", "What is this?")
        
        # PDF Q&A
        bot.load_pdf("resume.pdf")
        response = bot.ask_pdf("What certifications does Omar have?")
    """
    
    def __init__(self) -> None:
        """Initialize the chatbot with all components."""
        self.logger = get_logger(__name__)
        
        try:
            self._settings = get_settings()
        except ConfigurationError as e:
            self.logger.error("Configuration error: %s", e)
            print(f"Error: {e}")
            sys.exit(1)
        
        self.logger.info("Initializing MORA AI Assistant v2.0.0")
        
        # Initialize components lazily
        self._chat_engine: Optional[ChatEngine] = None
        self._audio_processor: Optional[AudioProcessor] = None
        self._image_analyzer: Optional[ImageAnalyzer] = None
        self._pdf_analyzer: Optional[PDFAnalyzer] = None
        self._video_analyzer: Optional[VideoAnalyzer] = None
        self._image_generator: Optional[ImageGenerator] = None
        
        # Preload chat engine for faster first response
        print("Loading knowledge base...", end="", flush=True)
        _ = self.chat_engine  # Trigger lazy initialization
        print(" Ready!\n")
    
    # =========================================================================
    # Lazy Component Initialization
    # =========================================================================
    
    @property
    def chat_engine(self) -> ChatEngine:
        """Get or create chat engine."""
        if self._chat_engine is None:
            self._chat_engine = ChatEngine()
        return self._chat_engine
    
    @property
    def audio_processor(self) -> AudioProcessor:
        """Get or create audio processor."""
        if self._audio_processor is None:
            self._audio_processor = AudioProcessor()
        return self._audio_processor
    
    @property
    def image_analyzer(self) -> ImageAnalyzer:
        """Get or create image analyzer."""
        if self._image_analyzer is None:
            self._image_analyzer = ImageAnalyzer()
        return self._image_analyzer
    
    @property
    def pdf_analyzer(self) -> PDFAnalyzer:
        """Get or create PDF analyzer."""
        if self._pdf_analyzer is None:
            self._pdf_analyzer = PDFAnalyzer()
        return self._pdf_analyzer
    
    @property
    def video_analyzer(self) -> VideoAnalyzer:
        """Get or create video analyzer."""
        if self._video_analyzer is None:
            self._video_analyzer = VideoAnalyzer()
        return self._video_analyzer
    
    @property
    def image_generator(self) -> ImageGenerator:
        """Get or create image generator."""
        if self._image_generator is None:
            self._image_generator = ImageGenerator()
        return self._image_generator
    
    # =========================================================================
    # Core Chat Methods
    # =========================================================================
    
    def chat(self, query: str) -> str:
        """
        Process a text chat query.
        
        Automatically uses RAG if available, falls back to general
        conversation otherwise.
        
        Args:
            query: User's question or message
            
        Returns:
            Response text
        """
        return self.chat_engine.chat(query)
    
    def chat_voice(self) -> Optional[str]:
        """
        Process voice input and return response.
        
        Records audio, transcribes, and generates response.
        
        Returns:
            Response text or None if recording failed
        """
        query = self.audio_processor.record_and_transcribe()
        
        if not query:
            return None
        
        return self.chat(query)
    
    # =========================================================================
    # Image Analysis
    # =========================================================================
    
    def analyze_image(self, source: str, question: str) -> str:
        """
        Analyze an image and answer a question about it.
        
        Args:
            source: Image file path or URL
            question: Question about the image
            
        Returns:
            Analysis response
        """
        image = self.image_analyzer.load_image(source)
        return self.image_analyzer.analyze(image, question)
    
    # =========================================================================
    # PDF Analysis
    # =========================================================================
    
    def load_pdf(self, source: str) -> None:
        """
        Load a PDF document for analysis.
        
        Args:
            source: PDF file path or URL
        """
        self.pdf_analyzer.load_pdf(source)
    
    def ask_pdf(self, question: str) -> str:
        """
        Ask a question about the loaded PDF.
        
        Args:
            question: Question about the document
            
        Returns:
            Answer text
        """
        return self.pdf_analyzer.ask(question)
    
    # =========================================================================
    # Video Analysis
    # =========================================================================
    
    def analyze_video(self, source: str, question: str) -> str:
        """
        Analyze a video and answer a question about it.
        
        Args:
            source: Video file path or URL
            question: Question about the video
            
        Returns:
            Analysis response
        """
        return self.video_analyzer.analyze(source, question)
    
    # =========================================================================
    # Response Handling
    # =========================================================================
    
    def handle_response(
        self,
        query: str,
        answer: str,
        speak: bool = False,
    ) -> None:
        """
        Handle and display a response.
        
        Args:
            query: Original question
            answer: Generated answer
            speak: Whether to speak the response
        """
        print(f"\nQuestion: {query}")
        print(f"Answer: {answer}")
        
        if speak:
            self.audio_processor.speak(answer, engine="gtts")
    
    def prompt_voice_response(self, answer: str) -> None:
        """
        Prompt user to hear response via voice.
        
        Args:
            answer: Response text to potentially speak
        """
        try:
            choice = input("\nDo you want to hear the response? (yes/no): ").lower()
            if choice in ("yes", "y"):
                self.audio_processor.speak(answer, engine="gtts")
        except KeyboardInterrupt:
            pass


# =============================================================================
# Interactive Session Handler
# =============================================================================

class InteractiveSession:
    """
    Interactive command-line session handler.
    
    Manages the conversation loop for different modes:
    text, voice, image, PDF, and video.
    """
    
    def __init__(self, chatbot: MORAChatbot) -> None:
        """
        Initialize the session.
        
        Args:
            chatbot: MORAChatbot instance
        """
        self.bot = chatbot
        self.logger = get_logger(__name__)
    
    def run(self) -> None:
        """Run the interactive session."""
        print("\n" + "=" * 50)
        print("  Welcome to MORA AI Assistant v2.0.0")
        print("  Your professional portfolio assistant")
        print("=" * 50)
        
        while True:
            try:
                mode = self._get_mode()
                
                if mode in ConversationMode.EXIT:
                    print("\nGoodbye! Thank you for using MORA.")
                    break
                
                # Check for natural language image generation requests
                gen_keywords = ["generate", "create", "make", "draw"]
                if any(kw in mode for kw in gen_keywords) and ("image" in mode or "picture" in mode):
                    # Extract the prompt after keywords
                    import re
                    prompt = re.sub(r"^(generate|create|make|draw)\s+(an?\s+)?(image|picture)\s+(of|for)\s*", "", mode, flags=re.IGNORECASE).strip()
                    self._image_generation(initial_prompt=prompt if prompt else None)
                    continue
                
                if mode == ConversationMode.TEXT:
                    self._text_conversation()
                elif mode == ConversationMode.VOICE:
                    self._voice_conversation()
                elif mode == ConversationMode.IMAGE:
                    self._image_conversation()
                elif mode == ConversationMode.IMAGE_GEN:
                    self._image_generation()
                elif mode == ConversationMode.PDF:
                    self._pdf_conversation()
                elif mode == ConversationMode.VIDEO:
                    self._video_conversation()
                else:
                    print("Invalid option. Please try again.")
                    
            except KeyboardInterrupt:
                print("\n\nInterrupted. Returning to main menu...")
                continue
            except Exception as e:
                self.logger.error("Session error: %s", e)
                print(f"\nError: {e}")
                continue
    
    def _get_mode(self) -> str:
        """Get conversation mode from user."""
        print("\n" + "-" * 50)
        print("Choose conversation mode:")
        print("  [t] Text chat")
        print("  [v] Voice chat")
        print("  [i] Image analysis")
        print("  [g] Generate image")
        print("  [p] PDF analysis")
        print("  [vid] Video analysis")
        print("  [exit] Quit")
        print("-" * 50)
        
        return input("Enter your choice: ").lower().strip()
    
    def _should_exit(self, query: str) -> bool:
        """Check if user wants to exit."""
        return query.lower().strip() in ConversationMode.EXIT
    
    # =========================================================================
    # Conversation Modes
    # =========================================================================
    
    def _text_conversation(self) -> None:
        """Handle text-based conversation."""
        print("\nText conversation mode. Type 'exit' to return to menu.")
        
        while True:
            query = input("\nYou: ").strip()
            
            if not query:
                continue
            
            if self._should_exit(query):
                return
            
            # Check if query is a URL
            if query.startswith("http"):
                try:
                    content_type = identify_url_content_type(query)
                    
                    if content_type == "image":
                        self._image_conversation(query)
                        continue
                    elif content_type == "pdf":
                        self._pdf_conversation(query)
                        continue
                except (UnsafeURLError, ImageLoadError) as e:
                    print(f"Error processing URL: {e}")
                    continue
            
            # Regular chat
            try:
                print("Thinking...", end="", flush=True)
                answer = self.bot.chat(query)
                print("\r" + " " * 12 + "\r", end="")  # Clear "Thinking..."
                self.bot.handle_response(query, answer)
                self.bot.prompt_voice_response(answer)
            except RateLimitError as e:
                print("\r" + " " * 12 + "\r", end="")
                print(f"\n⚠️  Rate limit exceeded. Please wait a moment and try again.")
                print(f"    (Your API quota may be exhausted - check https://ai.google.dev/gemini-api/docs/rate-limits)")
            except Exception as e:
                print("\r" + " " * 12 + "\r", end="")
                print(f"Error: {e}")
    
    def _voice_conversation(self) -> None:
        """Handle voice-based conversation."""
        print("\nVoice conversation mode. Say 'exit' to return to menu.")
        
        while True:
            try:
                query = self.bot.audio_processor.record_and_transcribe()
                
                if not query:
                    continue
                
                if self._should_exit(query):
                    return
                
                print("Thinking...", end="", flush=True)
                answer = self.bot.chat(query)
                print("\r" + " " * 12 + "\r", end="")  # Clear "Thinking..."
                self.bot.handle_response(query, answer)
                self.bot.prompt_voice_response(answer)
                
            except SpeechRecognitionError as e:
                print(f"Speech recognition error: {e}")
            except Exception as e:
                print(f"Error: {e}")
    
    def _image_conversation(self, image_source: Optional[str] = None) -> None:
        """
        Handle image analysis conversation.
        
        Args:
            image_source: Optional pre-specified image source
        """
        # Get image source if not provided
        if not image_source:
            image_source = input("\nEnter image path or URL: ").strip()
        
        if self._should_exit(image_source):
            return
        
        try:
            # Load image
            image = self.bot.image_analyzer.load_image(image_source)
            print(f"\nImage loaded successfully.")
            
            # Conversation loop
            while True:
                mode = input("\nInput mode - [t] text, [v] voice, [exit] quit: ").lower()
                
                if mode in ConversationMode.EXIT or mode == "exit":
                    return
                
                # Get question
                if mode == "t":
                    question = input("\nYour question about the image: ").strip()
                elif mode == "v":
                    print("\nSpeak your question...")
                    question = self.bot.audio_processor.record_and_transcribe()
                    if not question:
                        continue
                else:
                    print("Invalid option.")
                    continue
                
                if self._should_exit(question):
                    return
                
                # Analyze
                print("Thinking...", end="", flush=True)
                answer = self.bot.image_analyzer.analyze(image, question)
                print("\r" + " " * 12 + "\r", end="")  # Clear "Thinking..."
                self.bot.handle_response(question, answer)
                self.bot.prompt_voice_response(answer)
                
        except (ImageLoadError, UnsafeURLError) as e:
            print(f"Error loading image: {e}")
        except Exception as e:
            print(f"Error: {e}")
    
    def _image_generation(self, initial_prompt: Optional[str] = None) -> None:
        """Handle image generation conversation."""
        from modules.image_generation import generate_image
        
        print("\n--- Image Generation Mode ---")
        
        first_run = True
        while True:
            # Use initial prompt on first run if provided
            if first_run and initial_prompt:
                prompt = initial_prompt
                print(f"\nGenerating: {prompt}")
                first_run = False
            else:
                prompt = input("\nDescribe the image to generate (or 'exit' to quit): ").strip()
            
            if self._should_exit(prompt) or prompt.lower() == "exit":
                return
            
            if not prompt:
                print("Please enter a description.")
                continue
            
            try:
                print("\nGenerating image... This may take a moment.")
                result = generate_image(prompt)
                
                if result and result.image:
                    # Save image using GeneratedImage's save method
                    import os
                    output_dir = "generated_images"
                    os.makedirs(output_dir, exist_ok=True)
                    
                    filename = f"{output_dir}/generated_{len(os.listdir(output_dir)) + 1}.png"
                    result.save(filename)
                    
                    print(f"\n✓ Image saved to: {filename}")
                else:
                    print("\nFailed to generate image. Please try a different prompt.")
                    
            except Exception as e:
                print(f"Error generating image: {e}")
    
    def _pdf_conversation(self, pdf_source: Optional[str] = None) -> None:
        """
        Handle PDF analysis conversation.
        
        Args:
            pdf_source: Optional pre-specified PDF source
        """
        # Get PDF source if not provided
        if not pdf_source:
            pdf_source = input("\nEnter PDF path or URL: ").strip()
        
        if self._should_exit(pdf_source):
            return
        
        try:
            # Load PDF
            print("\nLoading PDF... This may take a moment.")
            self.bot.pdf_analyzer.load_pdf(pdf_source)
            print(f"PDF loaded: {len(self.bot.pdf_analyzer.pages)} pages")
            
            # Conversation loop
            while True:
                mode = input("\nInput mode - [t] text, [v] voice, [exit] quit: ").lower()
                
                if mode in ConversationMode.EXIT or mode == "exit":
                    return
                
                # Get question
                if mode == "t":
                    question = input("\nYour question about the PDF: ").strip()
                elif mode == "v":
                    print("\nSpeak your question...")
                    question = self.bot.audio_processor.record_and_transcribe()
                    if not question:
                        continue
                else:
                    print("Invalid option.")
                    continue
                
                if self._should_exit(question):
                    return
                
                # Answer question
                print("Thinking...", end="", flush=True)
                answer = self.bot.pdf_analyzer.ask_with_pages(question)
                print("\r" + " " * 12 + "\r", end="")  # Clear "Thinking..."
                self.bot.handle_response(question, answer)
                self.bot.prompt_voice_response(answer)
                
        except PDFLoadError as e:
            print(f"Error loading PDF: {e}")
        except Exception as e:
            print(f"Error: {e}")
    
    def _video_conversation(self, video_source: Optional[str] = None) -> None:
        """
        Handle video analysis conversation.
        
        Args:
            video_source: Optional pre-specified video source
        """
        # Get video source if not provided
        if not video_source:
            video_source = input("\nEnter video path or URL: ").strip()
        
        if self._should_exit(video_source):
            return
        
        try:
            print("\nVideo analysis mode.")
            
            # Conversation loop
            while True:
                mode = input("\nInput mode - [t] text, [v] voice, [exit] quit: ").lower()
                
                if mode in ConversationMode.EXIT or mode == "exit":
                    return
                
                # Get question
                if mode == "t":
                    question = input("\nYour question about the video: ").strip()
                elif mode == "v":
                    print("\nSpeak your question...")
                    question = self.bot.audio_processor.record_and_transcribe()
                    if not question:
                        continue
                else:
                    print("Invalid option.")
                    continue
                
                if self._should_exit(question):
                    return
                
                # Analyze video
                print("Thinking...", end="", flush=True)
                answer = self.bot.video_analyzer.analyze(video_source, question)
                print("\r" + " " * 12 + "\r", end="")  # Clear "Thinking..."
                self.bot.handle_response(question, answer)
                self.bot.prompt_voice_response(answer)
                
        except Exception as e:
            print(f"Error: {e}")


# =============================================================================
# Main Entry Point
# =============================================================================

def main() -> None:
    """Main entry point for the chatbot."""
    try:
        chatbot = MORAChatbot()
        session = InteractiveSession(chatbot)
        session.run()
    except KeyboardInterrupt:
        print("\n\nGoodbye!")
        sys.exit(0)
    except ConfigurationError as e:
        print(f"Configuration error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
