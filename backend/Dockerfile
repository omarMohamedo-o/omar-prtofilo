# ============================================
# MORA Portfolio - Backend Dockerfile
# Multi-stage build for Node.js SMTP service
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts --no-audit --no-fund && \
    npm cache clean --force

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM node:20-alpine AS production

# Metadata
LABEL maintainer="Omar Mohamed Abdelsalam" \
    description="MORA Portfolio Backend - SMTP Service" \
    version="1.0"

WORKDIR /app

# Install curl for healthcheck (minimal install)
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Create non-root user before copying files
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy only necessary application files
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs index.js ./

# Environment
ENV NODE_ENV=production \
    PORT=3001

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["node", "index.js"]
