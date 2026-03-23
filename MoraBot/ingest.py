#!/usr/bin/env python3
"""
INTEGR8 Document Ingestion Pipeline
====================================
Loads documents from SOURCE_DOCUMENTS/, splits them into chunks,
and stores embeddings in ChromaDB for RAG retrieval.

Uses Google Gemini Embeddings (gemini-embedding-001) for modern,
cloud-based embedding generation with task-specific optimization.

Usage:
    python ingest.py
"""

import logging
import os
import sys
import warnings
from datetime import datetime

# ============================================================================
# Suppress verbose warnings and logs BEFORE importing libraries
# ============================================================================
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message=".*LangChainDeprecationWarning.*")
os.environ["GRPC_VERBOSITY"] = "ERROR"
os.environ["GLOG_minloglevel"] = "2"

# Suppress verbose loggers
for logger_name in [
    "httpx", "httpcore", "urllib3", "chromadb", "unstructured",
    "PIL", "pdfminer", "chardet", "google", "grpc"
]:
    logging.getLogger(logger_name).setLevel(logging.ERROR)

from dotenv import load_dotenv
load_dotenv()

from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import Language, RecursiveCharacterTextSplitter
from langchain_community.vectorstores.chroma import Chroma
from chromadb.config import Settings

# Document loaders
from langchain_community.document_loaders import (
    CSVLoader,
    PDFMinerLoader,
    TextLoader,
    UnstructuredExcelLoader,
    Docx2txtLoader,
    UnstructuredMarkdownLoader,
    UnstructuredPowerPointLoader,
    UnstructuredImageLoader,
)

# Try to use PyMuPDFLoader (faster, cleaner) or fall back to PDFMinerLoader
try:
    from langchain_community.document_loaders import PyMuPDFLoader
    PDF_LOADER = PyMuPDFLoader
except ImportError:
    PDF_LOADER = PDFMinerLoader


# ============================================================================
# Configuration
# ============================================================================
SOURCE_DIRECTORY = "SOURCE_DOCUMENTS/"
PERSIST_DIRECTORY = "DB/"
INGEST_THREADS = os.cpu_count() or 8

# Google Gemini Embedding Model (modern, cloud-based, no local model needed)
# Supports task types: RETRIEVAL_DOCUMENT, RETRIEVAL_QUERY, SEMANTIC_SIMILARITY, etc.
# Output dimensions: 768, 1536, or 3072 (default)
EMBEDDING_MODEL = "models/gemini-embedding-001"
EMBEDDING_DIMENSIONS = 768  # Smaller = faster, 768 is recommended balance

CHROMA_SETTINGS = Settings(
    anonymized_telemetry=False,
    is_persistent=True,
)

DOCUMENT_MAP = {
    ".txt": TextLoader,
    ".md": UnstructuredMarkdownLoader,
    ".py": TextLoader,
    ".pdf": PDF_LOADER,
    ".csv": CSVLoader,
    ".xls": UnstructuredExcelLoader,
    ".xlsx": UnstructuredExcelLoader,
    ".docx": Docx2txtLoader,
    ".doc": Docx2txtLoader,
    ".pptx": UnstructuredPowerPointLoader,
    ".ppt": UnstructuredPowerPointLoader,
    ".png": UnstructuredImageLoader,
    ".jpg": UnstructuredImageLoader,
    ".jpeg": UnstructuredImageLoader,
}


# ============================================================================
# Console Output Helpers
# ============================================================================
class Colors:
    """ANSI color codes for terminal output."""
    HEADER = "\033[95m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    END = "\033[0m"


def print_header(text: str) -> None:
    """Print a formatted header."""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'=' * 60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}  {text}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'=' * 60}{Colors.END}\n")


def print_step(step: int, total: int, text: str) -> None:
    """Print a step indicator."""
    print(f"{Colors.BLUE}[{step}/{total}]{Colors.END} {text}")


def print_success(text: str) -> None:
    """Print success message."""
    print(f"{Colors.GREEN}✓{Colors.END} {text}")


def print_info(text: str) -> None:
    """Print info message."""
    print(f"{Colors.CYAN}ℹ{Colors.END} {text}")


def print_warning(text: str) -> None:
    """Print warning message."""
    print(f"{Colors.YELLOW}⚠{Colors.END} {text}")


def print_error(text: str) -> None:
    """Print error message."""
    print(f"{Colors.RED}✗{Colors.END} {text}")


# ============================================================================
# File Logging
# ============================================================================
def file_log(logentry: str, silent: bool = False) -> None:
    """Write entry to log file and optionally print."""
    with open("file_ingest.log", "a", encoding="utf-8") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {logentry}\n")
    if not silent:
        print_info(logentry)


# ============================================================================
# Document Loading
# ============================================================================
def load_single_document(file_path: str) -> Document | None:
    """Load a single document from file path."""
    try:
        file_extension = os.path.splitext(file_path)[1].lower()
        loader_class = DOCUMENT_MAP.get(file_extension)
        
        if not loader_class:
            file_log(f"Unsupported file type: {file_path}", silent=True)
            return None
        
        loader = loader_class(file_path)
        docs = loader.load()
        
        if docs:
            file_log(f"Loaded: {os.path.basename(file_path)}", silent=True)
            return docs[0]
        return None
        
    except Exception as ex:
        file_log(f"Error loading {file_path}: {ex}", silent=True)
        return None


def load_documents(source_dir: str) -> list[Document]:
    """Load all documents from source directory."""
    # Collect file paths
    paths = []
    for root, _, files in os.walk(source_dir):
        for file_name in files:
            file_extension = os.path.splitext(file_name)[1].lower()
            if file_extension in DOCUMENT_MAP:
                source_path = os.path.join(root, file_name)
                paths.append(source_path)
    
    if not paths:
        print_warning(f"No supported documents found in {source_dir}")
        return []
    
    # Show files to be processed
    print_info(f"Found {len(paths)} document(s) to process:")
    for path in paths:
        print(f"   • {os.path.basename(path)}")
    print()
    
    # Load documents sequentially (more reliable on Windows)
    docs = []
    for i, path in enumerate(paths, 1):
        print(f"   Loading [{i}/{len(paths)}]: {os.path.basename(path)}...", end=" ")
        doc = load_single_document(path)
        if doc:
            docs.append(doc)
            print(f"{Colors.GREEN}OK{Colors.END}")
        else:
            print(f"{Colors.RED}FAILED{Colors.END}")
    
    return docs


def split_documents(documents: list[Document]) -> tuple[list[Document], list[Document]]:
    """Split documents by type (text vs Python code)."""
    text_docs, python_docs = [], []
    for doc in documents:
        if doc is not None:
            file_extension = os.path.splitext(doc.metadata.get("source", ""))[1].lower()
            if file_extension == ".py":
                python_docs.append(doc)
            else:
                text_docs.append(doc)
    return text_docs, python_docs


# ============================================================================
# Main Ingestion Pipeline
# ============================================================================
def main() -> None:
    """Run the document ingestion pipeline."""
    start_time = datetime.now()
    
    print_header("INTEGR8 Document Ingestion Pipeline")
    
    # Step 1: Check source directory
    print_step(1, 4, "Scanning source directory...")
    if not os.path.exists(SOURCE_DIRECTORY):
        print_error(f"Source directory not found: {SOURCE_DIRECTORY}")
        sys.exit(1)
    
    # Step 2: Load documents
    print_step(2, 4, "Loading documents...")
    documents = load_documents(SOURCE_DIRECTORY)
    
    if not documents:
        print_error("No documents loaded. Add files to SOURCE_DOCUMENTS/ folder.")
        sys.exit(1)
    
    print_success(f"Loaded {len(documents)} document(s)")
    
    # Step 3: Split into chunks
    print_step(3, 4, "Splitting documents into chunks...")
    text_documents, python_documents = split_documents(documents)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    python_splitter = RecursiveCharacterTextSplitter.from_language(
        language=Language.PYTHON, chunk_size=880, chunk_overlap=200
    )
    
    chunks = text_splitter.split_documents(text_documents)
    chunks.extend(python_splitter.split_documents(python_documents))
    
    print_success(f"Created {len(chunks)} text chunk(s)")
    
    # Step 4: Generate embeddings and store in ChromaDB
    print_step(4, 4, "Generating embeddings and storing in vector database...")
    print_info(f"Using Google Gemini Embeddings: {EMBEDDING_MODEL}")
    print_info(f"Embedding dimensions: {EMBEDDING_DIMENSIONS}")
    
    # Check for API key
    if not os.getenv("GOOGLE_API_KEY"):
        print_error("GOOGLE_API_KEY not found in environment variables!")
        print_info("Please add GOOGLE_API_KEY to your .env file")
        sys.exit(1)
    
    # Use Google Gemini Embeddings (modern, cloud-based, no local model needed)
    embeddings = GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL,
        task_type="RETRIEVAL_DOCUMENT",  # Optimized for document indexing
    )
    
    db = Chroma.from_documents(
        chunks,
        embeddings,
        persist_directory=PERSIST_DIRECTORY,
        client_settings=CHROMA_SETTINGS,
    )
    
    print_success(f"Vector database saved to: {PERSIST_DIRECTORY}")
    
    # Summary
    elapsed = (datetime.now() - start_time).total_seconds()
    
    print_header("Ingestion Complete!")
    print(f"""
{Colors.BOLD}Summary:{Colors.END}
  • Documents processed: {len(documents)}
  • Text chunks created:  {len(chunks)}
  • Database location:    {PERSIST_DIRECTORY}
  • Time elapsed:         {elapsed:.2f} seconds
""")


if __name__ == "__main__":
    main()
