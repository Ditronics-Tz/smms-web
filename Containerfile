# =============================================================================
# Multi-stage Containerfile for React TypeScript Application (Podman)
# Optimized for minimal size (<150MB), security, and production deployment
# Build with: podman build -f Containerfile -t smms-web:prod --target production .
# Reuses the same pinned, multi-stage recipe as Dockerfile; Podman/Buildah
# accept the same syntax. OCI image, runs as non-root nginx user.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Development (for local development with hot-reload)
# -----------------------------------------------------------------------------
FROM node:20-slim AS development

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN printf 'Types: deb\nURIs: http://mirror.liquidtelecom.com/debian/debian\nSuites: bookworm bookworm-updates\nComponents: main\nSigned-By: /usr/share/keyrings/debian-archive-keyring.gpg\n' > /etc/apt/sources.list.d/debian.sources; : > /etc/apt/sources.list 2>/dev/null; (for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do echo "apt-get update attempt $i"; rm -rf /var/lib/apt/lists/* 2>/dev/null; apt-get -o Acquire::Retries=2 -o Acquire::http::Timeout=12 update; ls /var/lib/apt/lists/*bookworm*main*binary*Packages* 1>/dev/null 2>&1 && break || sleep 5; done) && ls /var/lib/apt/lists/*bookworm*main*binary*Packages* 1>/dev/null 2>&1 && apt-get -o Acquire::Retries=10 install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for development)
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 10 && \
    npm config set fetch-retry-mintimeout 30000 && \
    for i in 1 2 3 4 5; do echo "npm install attempt $i"; npm install --legacy-peer-deps && break || sleep 20; done && \
    test -d node_modules/react-scripts

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
RUN printf 'Types: deb\nURIs: http://mirror.liquidtelecom.com/debian/debian\nSuites: bookworm bookworm-updates\nComponents: main\nSigned-By: /usr/share/keyrings/debian-archive-keyring.gpg\n' > /etc/apt/sources.list.d/debian.sources; : > /etc/apt/sources.list 2>/dev/null; (for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do echo "apt-get update attempt $i"; rm -rf /var/lib/apt/lists/* 2>/dev/null; apt-get -o Acquire::Retries=2 -o Acquire::http::Timeout=12 update; ls /var/lib/apt/lists/*bookworm*main*binary*Packages* 1>/dev/null 2>&1 && break || sleep 5; done) && ls /var/lib/apt/lists/*bookworm*main*binary*Packages* 1>/dev/null 2>&1 && apt-get -o Acquire::Retries=10 install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Accept build arguments for React environment variables
ARG NODE_ENV=production
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_FIREBASE_MEASUREMENT_ID
ARG REACT_APP_VAPID_KEY

# Set Node options for build optimization
ENV NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV CI=false

# Set environment variables from build args (baked into build)
ENV NODE_ENV=${NODE_ENV}
ENV REACT_APP_FIREBASE_API_KEY=${REACT_APP_FIREBASE_API_KEY}
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=${REACT_APP_FIREBASE_AUTH_DOMAIN}
ENV REACT_APP_FIREBASE_PROJECT_ID=${REACT_APP_FIREBASE_PROJECT_ID}
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=${REACT_APP_FIREBASE_STORAGE_BUCKET}
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${REACT_APP_FIREBASE_MESSAGING_SENDER_ID}
ENV REACT_APP_FIREBASE_APP_ID=${REACT_APP_FIREBASE_APP_ID}
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=${REACT_APP_FIREBASE_MEASUREMENT_ID}
ENV REACT_APP_VAPID_KEY=${REACT_APP_VAPID_KEY}

# Copy package files first for better layer caching.
# Podman fix: install with yarn --frozen-lockfile using the committed
# yarn.lock. `npm install --legacy-peer-deps` produced a broken tree here
# (ajv-keywords@5 hoisted against ajv@6 -> `Cannot find module
# 'ajv/dist/compile/codegen'`) and NODE_ENV=production silently skipped the
# devDependency `typescript` that react-scripts needs.
COPY package.json yarn.lock ./

# Install ALL dependencies deterministically (including dev deps for build).
# Fails fast if yarn.lock is out of sync with package.json.
RUN corepack enable && \
    yarn config set registry https://registry.npmjs.org/ && \
    for i in 1 2 3; do echo "yarn install attempt $i"; yarn install --frozen-lockfile --production=false --network-timeout 300000 && break || { echo "attempt $i failed"; sleep 20; }; done && \
    test -d node_modules/react-scripts && test -d node_modules/typescript && test -d node_modules/ajv

# Copy application source
COPY . .

# Build the application
RUN npm run build

# No need to prune since we only copy build/ to production stage

# -----------------------------------------------------------------------------
# Stage 3: Production (nginx-alpine for minimal size)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy Podman nginx configuration (listen 8080, unprivileged for non-root user)
COPY podman/nginx.conf /etc/nginx/nginx.conf

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

# Expose port 8080 (mapped to 3000 on host via compose.yaml)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
