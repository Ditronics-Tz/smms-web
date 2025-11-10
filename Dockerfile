# =============================================================================
# Multi-stage Dockerfile for React TypeScript Application
# Optimized for minimal size (<150MB), security, and production deployment
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Development (for local development with hot-reload)
# -----------------------------------------------------------------------------
FROM node:20-slim AS development

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for development)
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 300000 && \
    npm install --legacy-peer-deps

# Copy source code (in dev, will be overridden by volume mount)
COPY . .

# Expose development server port
EXPOSE 3000

# Start development server (bound to 0.0.0.0 for Docker networking)
CMD ["npm", "start"]

# -----------------------------------------------------------------------------
# Stage 2: Builder (for building production artifacts)
# -----------------------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set Node options for build optimization
ENV NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV CI=false

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with optimizations
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --only=production --legacy-peer-deps && \
    npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies to reduce size
RUN npm prune --production

# -----------------------------------------------------------------------------
# Stage 3: Production (nginx-alpine for minimal size)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

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
