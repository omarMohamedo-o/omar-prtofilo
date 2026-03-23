# ============================================
# MORA Portfolio - Nginx Reverse Proxy Dockerfile
# ============================================

FROM nginx:1.27-alpine

# Metadata
LABEL maintainer="Omar Mohamed Abdelsalam" \
    description="MORA Portfolio - Nginx Reverse Proxy" \
    version="1.0"

# Install curl for healthcheck and setup directories for non-root nginx
RUN apk upgrade --no-cache && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/* && \
    rm -f /etc/nginx/conf.d/default.conf && \
    # Create cache directories with proper ownership
    mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    # Ensure nginx can write to necessary directories
    chown -R nginx:nginx /var/log/nginx && \
    # Create and set permissions for pid file
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Comment out user directive for non-root operation
RUN sed -i 's/^user nginx;/#user nginx;/' /etc/nginx/nginx.conf

# Switch to non-root user
USER nginx

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
