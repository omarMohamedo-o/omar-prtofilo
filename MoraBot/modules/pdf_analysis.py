"""
PDF Analysis Module for INTEGR8 AI Assistant
============================================

Provides PDF document loading, embedding, and question-answering
capabilities using LangChain and Google Gemini.

Features:
- Load PDFs from local files or URLs (with SSRF protection)
- Chunk and embed documents for semantic search
- Answer questions using RAG (Retrieval Augmented Generation)
- Support for summarization and detailed Q&A

Usage:
    from modules.pdf_analysis import PDFAnalyzer
    
    analyzer = PDFAnalyzer()
    analyzer.load_pdf("document.pdf")
    response = analyzer.ask("What is the main topic?")
"""

from __future__ import annotations

import tempfile
from pathlib import Path
from typing import Optional, Union, List
from urllib.parse import urlparse

import requests

from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.chains import RetrievalQA
from langchain_classic.chains.question_answering import load_qa_chain
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
)
from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document

from modules.config import (
    get_settings,
    get_logger,
    PDF_QA_PROMPT_TEMPLATE,
)
from modules.image_analysis import is_safe_url, UnsafeURLError


# =============================================================================
# Custom Exceptions
# =============================================================================

class PDFAnalysisError(Exception):
    """Base exception for PDF analysis errors."""
    pass


class PDFLoadError(PDFAnalysisError):
    """Raised when PDF cannot be loaded."""
    pass


class EmbeddingError(PDFAnalysisError):
    """Raised when document embedding fails."""
    pass


class QueryError(PDFAnalysisError):
    """Raised when query processing fails."""
    pass


# =============================================================================
# PDF Analyzer Class
# =============================================================================

class PDFAnalyzer:
    """
    Production-ready PDF analyzer using LangChain and Gemini.
    
    This class provides:
    - Safe PDF loading from files and URLs
    - Document chunking and embedding
    - Question-answering with source retrieval
    - Summarization capabilities
    
    Attributes:
        pages: Loaded PDF pages as LangChain documents
        vector_store: ChromaDB vector store for retrieval
        qa_chain: RetrievalQA chain for answering questions
        
    Example:
        analyzer = PDFAnalyzer()
        
        # Load PDF
        analyzer.load_pdf("historical_document.pdf")
        
        # Ask questions
        answer = analyzer.ask("When was this written?")
        print(answer)
        
        # Get detailed answer with sources
        result = analyzer.ask_with_sources("What are the key events?")
    """
    
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        retrieval_k: int = 5,
        model_name: str = "gemini-1.5-flash",
        embedding_model: str = "models/embedding-001",
    ) -> None:
        """
        Initialize the PDF analyzer.
        
        Args:
            chunk_size: Size of text chunks for embedding
            chunk_overlap: Overlap between chunks
            retrieval_k: Number of chunks to retrieve for each query
            model_name: Gemini model for Q&A
            embedding_model: Model for document embeddings
        """
        self.logger = get_logger(__name__)
        self._settings = get_settings()
        
        # Configuration
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.retrieval_k = retrieval_k
        self.model_name = model_name
        self.embedding_model = embedding_model
        
        # State
        self.pages: List[Document] = []
        self.vector_store: Optional[Chroma] = None
        self.qa_chain: Optional[RetrievalQA] = None
        self._stuff_chain = None
        
        # Initialize components
        self._text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        
        self._embeddings = GoogleGenerativeAIEmbeddings(
            model=embedding_model,
            google_api_key=self._settings.google_api_key,
        )
        
        self._llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=self._settings.google_api_key,
            temperature=1.0,
        )
        
        # Build prompt template
        self._prompt = PromptTemplate(
            template=PDF_QA_PROMPT_TEMPLATE,
            input_variables=["context", "question"],
        )
    
    # =========================================================================
    # PDF Loading
    # =========================================================================
    
    def load_pdf(
        self,
        source: Union[str, Path],
        timeout: int = 20,
    ) -> List[Document]:
        """
        Load PDF from file path or URL.
        
        Args:
            source: Local file path or HTTP(S) URL
            timeout: Request timeout for URLs (seconds)
            
        Returns:
            List of loaded document pages
            
        Raises:
            PDFLoadError: If PDF cannot be loaded
            UnsafeURLError: If URL fails safety check
        """
        source_str = str(source)
        
        if source_str.startswith(("http://", "https://")):
            self.pages = self._load_from_url(source_str, timeout)
        else:
            self.pages = self._load_from_file(Path(source_str))
        
        self.logger.info("Loaded PDF with %d pages", len(self.pages))
        
        # Build vector store and chains
        self._build_vector_store()
        self._build_qa_chains()
        
        return self.pages
    
    def _load_from_file(self, path: Path) -> List[Document]:
        """Load PDF from local file."""
        if not path.exists():
            raise PDFLoadError(f"PDF file not found: {path}")
        
        if not path.is_file():
            raise PDFLoadError(f"Path is not a file: {path}")
        
        try:
            self.logger.debug("Loading PDF from file: %s", path)
            loader = PyPDFLoader(str(path))
            return loader.load_and_split()
            
        except Exception as e:
            raise PDFLoadError(f"Failed to load PDF: {e}") from e
    
    def _load_from_url(self, url: str, timeout: int) -> List[Document]:
        """Load PDF from URL with SSRF protection."""
        if not is_safe_url(url):
            raise UnsafeURLError(f"URL failed safety validation: {url}")
        
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            raise UnsafeURLError(f"Unsupported URL scheme: {parsed.scheme}")
        
        try:
            self.logger.debug("Downloading PDF from URL: %s", url)
            response = requests.get(url, stream=True, timeout=timeout)
            response.raise_for_status()
            
            # Save to temp file and load
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
                f.write(response.content)
                temp_path = f.name
            
            try:
                loader = PyPDFLoader(temp_path)
                return loader.load_and_split()
            finally:
                # Cleanup temp file
                Path(temp_path).unlink(missing_ok=True)
                
        except requests.RequestException as e:
            raise PDFLoadError(f"Failed to download PDF: {e}") from e
        except Exception as e:
            raise PDFLoadError(f"Failed to process PDF: {e}") from e
    
    # =========================================================================
    # Vector Store & Chain Building
    # =========================================================================
    
    def _build_vector_store(self) -> None:
        """Build vector store from loaded pages."""
        if not self.pages:
            raise EmbeddingError("No pages loaded. Call load_pdf() first.")
        
        try:
            self.logger.info("Building vector store from %d pages", len(self.pages))
            
            # Extract and split text
            context = "\n\n".join(
                page.page_content for page in self.pages
            )
            texts = self._text_splitter.split_text(context)
            
            self.logger.debug("Created %d text chunks", len(texts))
            
            # Create vector store
            self.vector_store = Chroma.from_texts(
                texts,
                self._embeddings,
            )
            
        except Exception as e:
            raise EmbeddingError(f"Failed to build vector store: {e}") from e
    
    def _build_qa_chains(self) -> None:
        """Build QA chains for document queries."""
        if self.vector_store is None:
            raise QueryError("Vector store not initialized.")
        
        # Build retrieval QA chain
        retriever = self.vector_store.as_retriever(
            search_kwargs={"k": self.retrieval_k}
        )
        
        self.qa_chain = RetrievalQA.from_chain_type(
            self._llm,
            retriever=retriever,
            return_source_documents=False,
        )
        
        # Build stuff chain for direct page queries
        self._stuff_chain = load_qa_chain(
            self._llm,
            chain_type="stuff",
            prompt=self._prompt,
        )
        
        self.logger.info("QA chains built successfully")
    
    # =========================================================================
    # Question Answering
    # =========================================================================
    
    def ask(self, question: str) -> str:
        """
        Ask a question about the loaded PDF.
        
        Uses retrieval-based Q&A to find relevant chunks and answer.
        
        Args:
            question: Question to ask
            
        Returns:
            Answer string
            
        Raises:
            QueryError: If no PDF is loaded or query fails
        """
        if self.qa_chain is None:
            raise QueryError("No PDF loaded. Call load_pdf() first.")
        
        self.logger.info("Processing question: %s", question[:50])
        
        try:
            result = self.qa_chain.invoke({"query": question})
            answer = result.get("result", "No answer found.")
            
            self.logger.debug("Answer length: %d", len(answer))
            return answer
            
        except Exception as e:
            raise QueryError(f"Failed to process question: {e}") from e
    
    def ask_with_pages(self, question: str) -> str:
        """
        Ask a question using the full document context.
        
        Uses the stuff chain with all pages for more comprehensive answers.
        Better for summarization or questions requiring full context.
        
        Args:
            question: Question to ask
            
        Returns:
            Answer string
        """
        if self._stuff_chain is None or not self.pages:
            raise QueryError("No PDF loaded. Call load_pdf() first.")
        
        self.logger.info("Processing question with full context: %s", question[:50])
        
        try:
            result = self._stuff_chain.invoke(
                {"input_documents": self.pages, "question": question},
                return_only_outputs=True,
            )
            
            return result.get("output_text", "No answer found.")
            
        except Exception as e:
            raise QueryError(f"Failed to process question: {e}") from e
    
    def summarize(self) -> str:
        """
        Generate a summary of the loaded PDF.
        
        Returns:
            Summary text
        """
        return self.ask_with_pages(
            "Please provide a comprehensive summary of this document, "
            "including the main topics, key points, and any important conclusions."
        )
    
    @property
    def is_loaded(self) -> bool:
        """Check if a PDF is currently loaded."""
        return len(self.pages) > 0 and self.qa_chain is not None
    
    def clear(self) -> None:
        """Clear loaded PDF and release resources."""
        self.pages = []
        self.vector_store = None
        self.qa_chain = None
        self._stuff_chain = None
        self.logger.info("PDF analyzer cleared")


# =============================================================================
# Convenience Functions (Backward Compatibility)
# =============================================================================

# Global analyzer instance
_analyzer: Optional[PDFAnalyzer] = None


def get_pdf_analyzer() -> PDFAnalyzer:
    """Get or create global PDF analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = PDFAnalyzer()
    return _analyzer


def load_pdf(source: Union[str, Path]) -> PDFAnalyzer:
    """
    Load a PDF document.
    
    Args:
        source: PDF file path or URL
        
    Returns:
        PDFAnalyzer instance with loaded document
    """
    analyzer = get_pdf_analyzer()
    analyzer.load_pdf(source)
    return analyzer


def ask_pdf(question: str) -> str:
    """
    Ask a question about the loaded PDF.
    
    Args:
        question: Question to ask
        
    Returns:
        Answer string
        
    Raises:
        QueryError: If no PDF is loaded
    """
    return get_pdf_analyzer().ask(question)
