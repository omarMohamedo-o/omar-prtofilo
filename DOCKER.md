# MORA Portfolio - Docker Setup

Production-ready Docker containerization for the MORA Portfolio application.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│                      (Port 80/443)                           │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                   │
│    /api/* ──────────────>│ /*  ─────────────────────────────>│
│                          │                                   │
▼                          ▼                                   │
┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│   MoraBot      │  │    Frontend      │  │     Redis        │ │
│  (FastAPI)     │  │ (React + Nginx)  │  │    (Cache)       │ │
│   Port 8001    │  │    Port 80       │  │   Port 6379      │ │
└────────────────┘  └──────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Services

| Service | Description | Internal Port |
|---------|-------------|---------------|
| `frontend` | React + Vite SPA served by Nginx | 80 |
| `morabot` | Python FastAPI AI chatbot | 8001 |
| `nginx` | Reverse proxy & load balancer | 80, 443 |
| `redis` | Cache (optional) | 6379 |

## Quick Start

### 1. Setup Environment Variables

```bash
# Copy example env files
cp .env.example .env
cp MoraBot/.env.example MoraBot/.env

# Edit MoraBot/.env with your API keys
nano MoraBot/.env
```

### 2. Build and Run

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

### 3. Access the Application

- **Frontend**: <http://localhost>
- **API Health**: <http://localhost/api/health>

## Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild specific service
docker compose build frontend
docker compose build morabot

# View logs for specific service
docker compose logs -f morabot

# Shell into container
docker compose exec morabot bash
docker compose exec frontend sh
```

## Configuration

### Environment Variables

#### Root `.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `HTTP_PORT` | 80 | HTTP port |
| `HTTPS_PORT` | 443 | HTTPS port |

#### `MoraBot/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google Gemini API key |
| `OPENAI_API_KEY` | No | OpenAI API key (for TTS) |

### Volumes

| Volume | Purpose |
|--------|---------|
| `morabot_db` | ChromaDB vector database |
| `morabot_uploads` | User uploaded files |
| `morabot_images` | Generated images |
| `redis_data` | Redis persistence |
| `nginx_logs` | Nginx access/error logs |

## Production Deployment

### SSL/TLS Setup

1. Place certificates in `nginx/ssl/`:

   ```
   nginx/ssl/
   ├── cert.pem
   └── key.pem
   ```

2. Uncomment SSL volume in `docker-compose.yml`

3. Add SSL configuration to `nginx/conf.d/default.conf`

### Security Features

- Non-root users in containers
- Dropped Linux capabilities
- Resource limits
- Health checks
- JSON logging with rotation
- Rate limiting

## Development

For local development without Docker:

```bash
# Frontend (Terminal 1)
cd frontend
npm install
npm run dev

# MoraBot (Terminal 2)
cd MoraBot
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8001 --reload
```

## Troubleshooting

### MoraBot fails health check

```bash
# Check logs
docker compose logs morabot

# Verify .env file exists
cat MoraBot/.env
```

### Frontend build fails

```bash
# Check build output
docker compose build frontend --no-cache
```

### Port already in use

```bash
# Change port in .env
echo "HTTP_PORT=8080" >> .env
docker compose up -d
```
