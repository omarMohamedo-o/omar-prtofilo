# ============================================
# MORA Portfolio - MoraBot Dockerfile
# Multi-stage build for Python FastAPI
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    portaudio19-dev \
    libsndfile1-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Pip configuration for reliability
ENV PIP_DEFAULT_TIMEOUT=300 \
    PIP_RETRIES=5 \
    PIP_NO_CACHE_DIR=1

# Copy requirements
COPY requirements.txt .

# Install CPU-only PyTorch first (much smaller than CUDA version)
RUN pip install --upgrade pip && \
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install remaining requirements (torch already satisfied)
RUN pip install -r requirements.txt

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM python:3.11-slim AS production

# Metadata
LABEL maintainer="Omar Mohamed Abdelsalam" \
    description="MORA AI Chatbot - FastAPI Backend" \
    version="2.0"

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    libsndfile1 \
    libmagic1 \
    libportaudio2 \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user for security
RUN groupadd -r morabot && useradd -r -g morabot morabot

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application code
COPY --chown=morabot:morabot . .

# Create necessary directories
RUN mkdir -p /app/uploads /app/generated_images /app/DB && \
    chown -R morabot:morabot /app

# Ensure morabot home and HuggingFace cache dir exist and are owned
RUN mkdir -p /home/morabot/.cache/huggingface && \
    chown -R morabot:morabot /home/morabot

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8001

# Switch to non-root user
USER morabot

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8001"]
