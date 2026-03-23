"""
Chat Module for INTEGR8 AI Assistant
====================================

Provides RAG-based conversational interface using ChromaDB vector store
and Google Gemini language models.

Features:
- Retrieval-augmented generation for document Q&A
- Conversation memory for contextual follow-ups
- Integration with local knowledge base
- Fallback to general Gemini chat

Usage:
    from modules.chat import ChatEngine, retrieval_qa_pipeline
    
    # Use RAG pipeline
    qa = retrieval_qa_pipeline()
    result = qa.invoke({"query": "What is the history of Alexandria?"})
    
    # Or use ChatEngine for full conversation management
    engine = ChatEngine()
    response = engine.chat("Tell me about ancient Egypt")
"""

from __future__ import annotations

import time
from functools import wraps, lru_cache
from pathlib import Path
from typing import Optional, Tuple, Callable, TypeVar

from langchain_classic.chains import RetrievalQA
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_chroma import Chroma

from google import genai
from google.genai import types

from modules.config import (
    get_settings,
    get_genai_client,
    get_logger,
    INTEGR8_SYSTEM_PROMPT,
    QA_PROMPT_TEMPLATE,
)


# =============================================================================
# Custom Exceptions
# =============================================================================

class ChatError(Exception):
    """Base exception for chat errors."""
    pass


class DatabaseNotFoundError(ChatError):
    """Raised when vector database is not found."""
    pass


class QueryError(ChatError):
    """Raised when query processing fails."""
    pass


class RateLimitError(ChatError):
    """Raised when API rate limit is exceeded."""
    pass


# =============================================================================
# Retry Decorator
# =============================================================================

T = TypeVar('T')


def retry_on_rate_limit(
    max_retries: int = 3,
    initial_delay: float = 5.0,
    backoff_factor: float = 2.0,
    max_delay: float = 60.0,
) -> Callable:
    """
    Decorator to retry function calls on rate limit errors.
    
    Args:
        max_retries: Maximum number of retry attempts
        initial_delay: Initial delay in seconds before first retry
        backoff_factor: Multiply delay by this factor after each retry
        max_delay: Maximum delay between retries
        
    Returns:
        Decorated function
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            logger = get_logger(__name__)
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    error_msg = str(e).lower()
                    
                    # Check if it's a rate limit error
                    if '429' in error_msg or 'resource_exhausted' in error_msg or 'quota' in error_msg:
                        last_exception = e
                        
                        if attempt < max_retries:
                            logger.warning(
                                "Rate limit hit (attempt %d/%d). Retrying in %.1fs...",
                                attempt + 1, max_retries + 1, delay
                            )
                            time.sleep(delay)
                            delay = min(delay * backoff_factor, max_delay)
                        else:
                            logger.error("Rate limit exceeded after %d attempts", max_retries + 1)
                            raise RateLimitError(
                                f"API rate limit exceeded after {max_retries + 1} attempts. "
                                "Please wait a moment and try again, or check your quota at "
                                "https://ai.google.dev/gemini-api/docs/rate-limits"
                            ) from e
                    else:
                        # Not a rate limit error, re-raise immediately
                        raise
            
            # Should not reach here, but just in case
            if last_exception:
                raise last_exception
            
        return wrapper
    return decorator


# =============================================================================
# RAG Pipeline
# =============================================================================

# Cached RAG pipeline instance
_cached_qa_pipeline: Optional[RetrievalQA] = None
_cached_pipeline_dir: Optional[str] = None


def get_cached_qa_pipeline(
    persist_directory: Optional[str] = None,
) -> Optional[RetrievalQA]:
    """
    Get cached RAG pipeline, creating if necessary.
    
    This avoids reinitializing the pipeline on every query.
    """
    global _cached_qa_pipeline, _cached_pipeline_dir
    
    settings = get_settings()
    persist_dir = persist_directory or str(settings.persist_directory)
    
    # Return cached if same directory
    if _cached_qa_pipeline is not None and _cached_pipeline_dir == persist_dir:
        return _cached_qa_pipeline
    
    # Create new pipeline
    try:
        _cached_qa_pipeline = retrieval_qa_pipeline(persist_directory=persist_dir)
        _cached_pipeline_dir = persist_dir
        return _cached_qa_pipeline
    except DatabaseNotFoundError:
        return None


def retrieval_qa_pipeline(
    persist_directory: Optional[str] = None,
    embedding_model: Optional[str] = None,
    llm_model: str = "models/gemini-2.5-flash",
    temperature: float = 0.3,
) -> RetrievalQA:
    """
    Create a retrieval-augmented Q&A pipeline.
    
    Args:
        persist_directory: ChromaDB persistence directory
        embedding_model: Sentence transformer model name
        llm_model: Gemini model for generation
        temperature: Model temperature setting
        
    Returns:
        RetrievalQA chain instance
        
    Raises:
        DatabaseNotFoundError: If vector store doesn't exist
    """
    logger = get_logger(__name__)
    settings = get_settings()
    
    # Use settings defaults if not specified
    persist_dir = persist_directory or str(settings.persist_directory)
    embed_model = embedding_model or settings.embedding_model
    
    # Check if database exists
    if not Path(persist_dir).exists():
        raise DatabaseNotFoundError(
            f"Vector database not found at {persist_dir}. "
            "Run ingest.py first to create the database."
        )
    
    logger.info("Loading embeddings model: %s", embed_model)
    embeddings = GoogleGenerativeAIEmbeddings(
        model=embed_model,
        task_type="RETRIEVAL_QUERY",  # Optimized for query retrieval
    )
    
    logger.info("Loading vector store from: %s", persist_dir)
    db = Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings,
        client_settings=settings.chroma_settings,
    )
    
    retriever = db.as_retriever(search_kwargs={"k": 3})  # fewer docs = faster
    
    # Build prompt
    prompt = PromptTemplate(
        template=QA_PROMPT_TEMPLATE,
        input_variables=["context", "question"],
    )
    
    # Create LLM
    llm = ChatGoogleGenerativeAI(
        model=llm_model,
        temperature=temperature,
        google_api_key=settings.google_api_key,
    )
    
    # Build chain
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt},
    )
    
    logger.info("RAG pipeline ready")
    return qa


# =============================================================================
# Chat Engine
# =============================================================================

class ChatEngine:
    """
    Unified chat engine with RAG and general conversation support.
    
    This class provides:
    - RAG-based Q&A from local knowledge base
    - Fallback to general Gemini conversation
    - Conversation memory for context
    - Historical focus and accuracy
    
    Attributes:
        memory: Conversation history
        qa_pipeline: RAG pipeline (if database available)
        
    Example:
        engine = ChatEngine()
        
        # Chat with automatic RAG/general selection
        response = engine.chat("What happened in ancient Alexandria?")
        
        # Force general conversation
        response = engine.chat_general("Tell me about history")
    """
    
    NOT_IN_CONTEXT = "answer is not available in the context"
    
    def __init__(
        self,
        use_rag: bool = True,
        system_prompt: Optional[str] = None,
    ) -> None:
        """
        Initialize the chat engine.
        
        Args:
            use_rag: Whether to use RAG pipeline (if available)
            system_prompt: Custom system prompt
        """
        self.logger = get_logger(__name__)
        self._settings = get_settings()
        self._client = get_genai_client()
        
        self.system_prompt = system_prompt or INTEGR8_SYSTEM_PROMPT
        self.memory: list[str] = []
        
        # Try to initialize RAG pipeline (uses cache)
        self._qa_pipeline: Optional[RetrievalQA] = None
        if use_rag:
            self._qa_pipeline = get_cached_qa_pipeline()
        
        # Build generation config
        self._config = {
            **self._settings.generation_config.to_dict(),
            "safety_settings": self._settings.get_safety_settings_list(),
        }
    
    @property
    def has_rag(self) -> bool:
        """Check if RAG pipeline is available."""
        return self._qa_pipeline is not None
    
    def chat(self, query: str) -> str:
        """
        Process a chat query with automatic RAG/general selection.
        
        First tries RAG pipeline, falls back to general conversation
        if answer not found in context.
        
        Args:
            query: User's question or message
            
        Returns:
            Response text
        """
        self.logger.info("Processing query: %s", query[:50])
        
        # Try RAG first if available
        if self._qa_pipeline:
            try:
                answer = self._invoke_rag_with_retry(query)
                
                # Check if answer was found
                if answer and self.NOT_IN_CONTEXT.lower() not in answer.lower():
                    self._add_to_memory(query, answer)
                    return answer
                    
            except RateLimitError:
                # Re-raise rate limit errors to inform the user
                raise
            except Exception as e:
                self.logger.warning("RAG query failed: %s", e)
        
        # Fallback to general conversation
        return self._chat_general_with_retry(query)
    
    @retry_on_rate_limit(max_retries=1, initial_delay=2.0)
    def _invoke_rag_with_retry(self, query: str) -> str:
        """Invoke RAG pipeline with retry on rate limits."""
        result = self._qa_pipeline.invoke({"query": query})
        return result.get("result", "")
    
    @retry_on_rate_limit(max_retries=1, initial_delay=2.0)
    def _chat_general_with_retry(self, query: str) -> str:
        """Internal method with retry logic for general chat."""
        return self._do_chat_general(query)
    
    def chat_general(self, query: str) -> str:
        """
        Process query using general Gemini conversation.
        
        Args:
            query: User's question or message
            
        Returns:
            Response text
        """
        return self._chat_general_with_retry(query)
    
    def _do_chat_general(self, query: str) -> str:
        """Internal implementation of general chat."""
        self.logger.info("Using general conversation for: %s", query[:50])
        
        # Build context with memory
        self._add_to_memory_user(query)
        full_prompt = f"{self.system_prompt}\n\n{self._get_memory_context()}"
        
        try:
            response = self._client.models.generate_content(
                model=self._settings.default_model,
                contents=full_prompt,
                config=self._config,
            )
            
            answer = response.text
            self._add_to_memory_assistant(answer)
            
            return answer
            
        except Exception as e:
            self.logger.error("General chat failed: %s", e)
            raise
    
    def chat_with_source(self, query: str) -> Tuple[str, bool]:
        """
        Chat and indicate whether answer came from RAG.
        
        Args:
            query: User's question
            
        Returns:
            Tuple of (answer, is_from_rag)
        """
        if self._qa_pipeline:
            try:
                answer = self._invoke_rag_with_retry(query)
                
                if answer and self.NOT_IN_CONTEXT.lower() not in answer.lower():
                    self._add_to_memory(query, answer)
                    return answer, True
                    
            except RateLimitError:
                # Re-raise rate limit errors
                raise
            except Exception:
                pass
        
        return self.chat_general(query), False
    
    # =========================================================================
    # Memory Management
    # =========================================================================
    
    def _add_to_memory(self, query: str, answer: str) -> None:
        """Add Q&A pair to memory."""
        self.memory.append(f"User: {query}")
        self.memory.append(f"Answer: {answer}")
        self._trim_memory()
    
    def _add_to_memory_user(self, query: str) -> None:
        """Add user message to memory."""
        self.memory.append(f"User: {query}")
        self._trim_memory()
    
    def _add_to_memory_assistant(self, answer: str) -> None:
        """Add assistant message to memory."""
        self.memory.append(f"Answer: {answer}")
        self._trim_memory()
    
    def _get_memory_context(self) -> str:
        """Get formatted memory context."""
        return "\n".join(self.memory)
    
    def _trim_memory(self, max_entries: int = 20) -> None:
        """Trim memory to max entries."""
        if len(self.memory) > max_entries:
            self.memory = self.memory[-max_entries:]
    
    def clear_memory(self) -> None:
        """Clear conversation memory."""
        self.memory.clear()
        self.logger.info("Conversation memory cleared")


# =============================================================================
# Convenience Functions
# =============================================================================

# Global engine instance
_engine: Optional[ChatEngine] = None


def get_chat_engine() -> ChatEngine:
    """Get or create global chat engine instance."""
    global _engine
    if _engine is None:
        _engine = ChatEngine()
    return _engine


def chat(query: str) -> str:
    """
    Send a chat query and get a response.
    
    Args:
        query: User's question or message
        
    Returns:
        Response text
    """
    return get_chat_engine().chat(query)


def chat_general(query: str) -> str:
    """
    Send a query to general Gemini conversation.
    
    Args:
        query: User's question or message
        
    Returns:
        Response text
    """
    return get_chat_engine().chat_general(query)
