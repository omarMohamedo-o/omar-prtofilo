# ============================================
# MORA Portfolio - Frontend Dockerfile
# Multi-stage build for React + Vite
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts --no-audit --no-fund

# Copy source code
COPY public ./public
COPY src ./src
COPY index.html ./
COPY postcss.config.js tailwind.config.js vite.config.js ./

# Build arguments for API URL configuration
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Build optimizations
ENV NODE_ENV=production

# Build application (Vite outputs to dist/)
RUN npm run build && \
    rm -rf node_modules && \
    npm cache clean --force

# ============================================
# Stage 2: Production Runtime (Nginx)
# ============================================
FROM nginx:1.27-alpine AS production

# Metadata
LABEL maintainer="Omar Mohamed Abdelsalam" \
    description="MORA Portfolio Frontend" \
    version="1.0"

# Install minimal tools and setup directories for non-root nginx
RUN apk upgrade --no-cache && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/* && \
    rm -f /etc/nginx/conf.d/default.conf && \
    # Remove user directive from nginx.conf (not needed when running as non-root)
    sed -i 's/^user  nginx;/#user  nginx;/' /etc/nginx/nginx.conf && \
    # Create cache directories with proper ownership for nginx user
    mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    # Ensure nginx can write to necessary directories
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    # Create and set permissions for pid file
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder (Vite outputs to dist/)
COPY --from=builder /app/dist /usr/share/nginx/html

# Set ownership of copied files
RUN chown -R nginx:nginx /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
