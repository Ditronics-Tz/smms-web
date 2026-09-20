# =============================================================================
# Multi-stage Dockerfile for React TypeScript Application
# Optimized for minimal size (<150MB), security, and production deployment
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Development (for local development with hot-reload)
# -----------------------------------------------------------------------------
FROM oven/bun:1 AS development

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for dependency installation
COPY package.json bun.lock* ./

# Install all dependencies (including dev dependencies for development)
RUN bun install

# Copy source code (in dev, will be overridden by volume mount)
    COPY . .

    # Expose development server port        
EXPOSE 3000

# Start development server (bound to 0.0.0.0 for Docker networking)
CMD ["bun", "run", "start"]

# -----------------------------------------------------------------------------
# Stage 2: Builder (for building production artifacts)
# -----------------------------------------------------------------------------
FROM oven/bun:1 AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Accept build arguments for React environment variables
ARG NODE_ENV=production
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_FIREBASE_MEASUREMENT_ID
ARG REACT_APP_VAPID_KEY
ARG REACT_APP_APP_NAME
ARG REACT_APP_APP_SHORT_NAME
ARG REACT_APP_APP_DESCRIPTION
ARG REACT_APP_LOGO_PATH
ARG REACT_APP_FAVICON_PATH
ARG REACT_APP_PRIMARY_COLOR
ARG REACT_APP_CURRENCY_SYMBOL
ARG REACT_APP_CURRENCY_CODE
ARG REACT_APP_DEFAULT_LOCALE
ARG REACT_APP_SUPPORT_EMAIL
ARG REACT_APP_SUPPORT_PHONE

# Copy package files first for better layer caching
COPY package.json bun.lock* ./

# Install ALL dependencies (including dev deps needed for build).
# Note: this runs before NODE_ENV=production is exported below, so bun
# installs development dependencies as well.
RUN bun install

# Set Node options for build optimization
ENV NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV CI=false

# Set environment variables from build args (baked into build)
ENV NODE_ENV=${NODE_ENV}
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_FIREBASE_API_KEY=${REACT_APP_FIREBASE_API_KEY}
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=${REACT_APP_FIREBASE_AUTH_DOMAIN}
ENV REACT_APP_FIREBASE_PROJECT_ID=${REACT_APP_FIREBASE_PROJECT_ID}
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=${REACT_APP_FIREBASE_STORAGE_BUCKET}
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${REACT_APP_FIREBASE_MESSAGING_SENDER_ID}
ENV REACT_APP_FIREBASE_APP_ID=${REACT_APP_FIREBASE_APP_ID}
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=${REACT_APP_FIREBASE_MEASUREMENT_ID}
ENV REACT_APP_VAPID_KEY=${REACT_APP_VAPID_KEY}
ENV REACT_APP_APP_NAME=${REACT_APP_APP_NAME}
ENV REACT_APP_APP_SHORT_NAME=${REACT_APP_APP_SHORT_NAME}
ENV REACT_APP_APP_DESCRIPTION=${REACT_APP_APP_DESCRIPTION}
ENV REACT_APP_LOGO_PATH=${REACT_APP_LOGO_PATH}
ENV REACT_APP_FAVICON_PATH=${REACT_APP_FAVICON_PATH}
ENV REACT_APP_PRIMARY_COLOR=${REACT_APP_PRIMARY_COLOR}
ENV REACT_APP_CURRENCY_SYMBOL=${REACT_APP_CURRENCY_SYMBOL}
ENV REACT_APP_CURRENCY_CODE=${REACT_APP_CURRENCY_CODE}
ENV REACT_APP_DEFAULT_LOCALE=${REACT_APP_DEFAULT_LOCALE}
ENV REACT_APP_SUPPORT_EMAIL=${REACT_APP_SUPPORT_EMAIL}
ENV REACT_APP_SUPPORT_PHONE=${REACT_APP_SUPPORT_PHONE}

# Copy application source
COPY . .

# Build the application
RUN bun run build

# No need to prune since we only copy build/ to production stage

# -----------------------------------------------------------------------------
# Stage 3: Production (nginx-alpine for minimal size)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Build argument for the backend origin rendered into the CSP below.
ARG REACT_APP_API_BASE_URL

# Copy custom nginx configuration and substitute the __API_ORIGIN__ token
# (used in the Content-Security-Policy connect-src) with the backend origin.
COPY nginx.conf /etc/nginx/nginx.conf.template
RUN sed "s|__API_ORIGIN__|${REACT_APP_API_BASE_URL}|g" \
      /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx 2>/dev/null || true

# Set ownership of nginx directories
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Create nginx PID directory with correct permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 80 (will be mapped to 3000 on host via docker-compose)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
