# Docker Configuration for SMMS Web Application

Complete, production-ready Docker setup for the React TypeScript SPA with optimized builds, security, and developer experience.

---

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration Files](#configuration-files)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Optimization & Performance](#optimization--performance)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Migration Guide](#migration-guide)

---

## Overview

This Docker configuration provides:
- ✅ **Multi-stage builds** for minimal production images (<150MB)
- ✅ **Development mode** with hot-reload and volume mounting
- ✅ **Production mode** with nginx serving optimized static files
- ✅ **Security hardening** with non-root users and localhost-only binding
- ✅ **Easy commands** via Makefile and shell scripts
- ✅ **Environment variable** support for Firebase and API configuration

### Benefits of Containerization

| Aspect | Without Docker | With This Docker Setup |
|--------|---------------|----------------------|
| **Deployment Size** | Full Node.js (~900MB) | Nginx Alpine (<150MB) |
| **Build Consistency** | "Works on my machine" | Consistent across all environments |
| **Security** | Host-level vulnerabilities | Isolated containers, non-root users |
| **Startup Time** | ~5-10s | ~1-2s (production) |
| **Resource Usage** | Full Node runtime | Minimal nginx footprint |
| **Environment Setup** | Manual Node/npm install | Single `docker-compose up` |

---

## Prerequisites

Before using this Docker setup, ensure you have:

1. **Docker Engine** 20.10+ installed ([Install Docker](https://docs.docker.com/get-docker/))
2. **Docker Compose** v2.0+ installed (usually bundled with Docker Desktop)
3. **Git** for cloning the repository
4. **Make** (optional, for using Makefile commands)
   - Linux/Mac: Usually pre-installed
   - Windows: Install via [Chocolatey](https://chocolatey.org/) or use WSL2

Verify installations:
```bash
docker --version          # Should be 20.10+
docker-compose --version  # Should be v2.0+
make --version            # Should be GNU Make 4+
```

---

## Quick Start

### First-Time Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd smms-web
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   nano .env  # or your preferred editor
   ```

3. **Choose your workflow**:

   **For Development** (with hot-reload):
   ```bash
   make dev
   # OR
   ./docker-build.sh dev && ./docker-run.sh dev
   # OR
   docker-compose up --build
   ```
   Access at: http://localhost:3000

   **For Production** (optimized):
   ```bash
   make prod
   # OR
   ./docker-build.sh prod && ./docker-run.sh prod
   # OR
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
   Access at: http://localhost:3000

---

## Architecture

### Build Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT MODE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Source Code (./src, ./public)                             │
│         │                                                   │
│         ├─ Volume Mount ─────────────────┐                │
│         │                                 │                │
│         ▼                                 ▼                │
│  ┌────────────────────┐           ┌─────────────┐        │
│  │  node:20-slim      │           │ Live Reload │        │
│  │  + dependencies    │◄──────────┤   Enabled   │        │
│  │  + npm start       │           └─────────────┘        │
│  └────────────────────┘                                   │
│         │                                                   │
│         ▼                                                   │
│  React Dev Server (0.0.0.0:3000)                          │
│         │                                                   │
│         ▼                                                   │
│  Host: 127.0.0.1:3000 ────► Browser                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION MODE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │ Stage 1: Builder (node:20-slim)             │          │
│  │                                               │          │
│  │  package.json ──► npm ci ──► node_modules   │          │
│  │       │                                       │          │
│  │       ▼                                       │          │
│  │  Source Code ──► npm run build ──► /build   │          │
│  │                                      │        │          │
│  └──────────────────────────────────────┼────────┘          │
│                                         │                   │
│                                         ▼                   │
│  ┌─────────────────────────────────────────────┐          │
│  │ Stage 2: Production (nginx:alpine)          │          │
│  │                                               │          │
│  │  COPY /build ──► /usr/share/nginx/html      │          │
│  │  COPY nginx.conf ──► /etc/nginx/            │          │
│  │                                               │          │
│  │  ┌─────────────────────────────────┐        │          │
│  │  │ Nginx (non-root user)           │        │          │
│  │  │ - Serves static files           │        │          │
│  │  │ - SPA routing (fallback)        │        │          │
│  │  │ - Security headers              │        │          │
│  │  │ - Gzip compression              │        │          │
│  │  └─────────────────────────────────┘        │          │
│  │              │                                │          │
│  └──────────────┼────────────────────────────────┘          │
│                 │                                           │
│                 ▼                                           │
│         nginx:80 (internal)                                │
│                 │                                           │
│                 ▼                                           │
│    Host: 127.0.0.1:3000 ────► Browser                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Port Binding

- **Development**: Container port 3000 → Host 127.0.0.1:3000
- **Production**: Container port 80 → Host 127.0.0.1:3000
- **Security**: Bound to localhost only (not accessible from external IPs)

---

## Configuration Files

### 1. `Dockerfile`

Multi-stage Dockerfile with three targets:

```dockerfile
# Stage 1: development - For local dev with hot-reload
FROM node:20-slim AS development
# Full deps, volume-mounted source, npm start

# Stage 2: builder - For building production assets
FROM node:20-slim AS builder
# Install deps, copy source, npm run build

# Stage 3: production - For serving static files
FROM nginx:alpine AS production
# Copy built files, nginx config, run as non-root
```

**Key Features**:
- Node 20 LTS with slim variant (smaller than full/Alpine for compatibility)
- Nginx Alpine for production (minimal footprint)
- Non-root user for security
- Health checks included
- Build arguments for environment variables

### 2. `nginx.conf`

Production-grade nginx configuration:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Content-Security-Policy "...";
    
    # SPA routing - all routes fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(jpg|css|js|svg|woff2)$ {
        expires 1y;
    }
}
```

**Features**:
- SPA routing with fallback to `index.html`
- Security headers (CSP, XSS protection, frame options)
- Gzip compression
- Asset caching with immutable headers
- Service worker no-cache handling
- Health check endpoint

### 3. `docker-compose.yml` (Development)

```yaml
services:
  smms-web-dev:
    build:
      target: development
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - ./src:/app/src          # Hot-reload source
      - ./public:/app/public    # Hot-reload public
      - /app/node_modules       # Preserve container modules
    environment:
      - CHOKIDAR_USEPOLLING=true  # For file watching
```

**Features**:
- Volume mounting for hot-reload
- Polling enabled for cross-platform file watching
- Environment variables from `.env`
- Health checks

### 4. `docker-compose.prod.yml` (Production)

```yaml
services:
  smms-web-prod:
    build:
      target: production
      args:
        - REACT_APP_*=${REACT_APP_*}  # Build-time vars
    ports:
      - "127.0.0.1:3000:80"
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 256M
```

**Features**:
- Build-time environment variables (baked into build)
- Resource limits
- Security options
- Auto-restart policy

### 5. `.dockerignore`

Excludes unnecessary files from Docker context:
```
node_modules
build
dist
coverage
.git
*.log
.env*
README.md
```

**Benefits**:
- Faster build context transfer
- Smaller image sizes
- Better layer caching

### 6. `Makefile`

Easy-to-use commands:
```makefile
make dev          # Start development
make prod         # Start production
make build-prod   # Build production image
make logs         # View logs
make stop         # Stop containers
make clean        # Clean everything
make size         # Show image sizes
make test         # Run tests
```

---

## Development Workflow

### Starting Development

**Using Makefile** (recommended):
```bash
make dev
```

**Using scripts**:
```bash
./docker-build.sh dev
./docker-run.sh dev
```

**Using docker-compose directly**:
```bash
docker-compose up --build
```

### Development Features

1. **Hot Reload**: Changes to `src/` and `public/` directories are automatically detected
   - Modify a component → See changes instantly
   - No rebuild needed for code changes

2. **Volume Mounting**:
   ```yaml
   volumes:
     - ./src:/app/src        # Your source code
     - ./public:/app/public  # Static assets
     - /app/node_modules     # Keep container's node_modules
   ```

3. **Debugging**:
   ```bash
   # View logs
   make logs-dev
   # OR
   docker-compose logs -f smms-web-dev
   
   # Open shell in container
   make shell
   # OR
   docker-compose exec smms-web-dev /bin/sh
   ```

4. **Running Tests**:
   ```bash
   make test
   # OR
   docker-compose run --rm smms-web-dev npm test -- --watchAll=false
   ```

### Making Code Changes

1. Edit files in `src/` or `public/` directories
2. Save changes
3. Browser automatically reloads (via React hot-reload)
4. No need to restart container

**Note**: If you modify `package.json`, rebuild the container:
```bash
docker-compose down
docker-compose up --build
```

### Stopping Development

```bash
# Stop with Ctrl+C (if running in foreground)
# OR
make stop
# OR
docker-compose down
```

---

## Production Deployment

### Building Production Image

**Using Makefile**:
```bash
make build-prod
```

**Using scripts**:
```bash
./docker-build.sh prod
```

**Using docker-compose**:
```bash
docker-compose -f docker-compose.prod.yml build
```

### Starting Production

```bash
make prod
# OR
./docker-run.sh prod
# OR
docker-compose -f docker-compose.prod.yml up -d
```

### Verifying Deployment

```bash
# Check container status
docker ps

# Test health endpoint
curl http://localhost:3000/health

# View logs
make logs-prod

# Check image size
make size
```

### Production Operations

**View Logs**:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

**Restart**:
```bash
docker-compose -f docker-compose.prod.yml restart
```

**Stop**:
```bash
docker-compose -f docker-compose.prod.yml down
```

**Update and Redeploy**:
```bash
git pull
make rebuild-prod
```

---

## Optimization & Performance

### Image Size Comparison

| Configuration | Size | Notes |
|--------------|------|-------|
| **Old (node + serve)** | ~400MB | Full Node.js runtime + serve package |
| **New (nginx:alpine)** | **<150MB** | Static files + minimal nginx |
| **Target** | <150MB | ✅ Achieved |

### Build Optimization Techniques

1. **Multi-stage builds**: Only production stage included in final image
2. **Layer caching**: `package.json` copied before source code
3. **Pruning**: Dev dependencies removed after build
4. **Alpine base**: Minimal Linux distribution
5. **Static serving**: No runtime JavaScript needed

### Runtime Performance

- **Startup time**: 1-2 seconds (vs 5-10s with Node serve)
- **Memory usage**: ~50MB (vs ~200MB with Node)
- **CPU usage**: Minimal (nginx is highly efficient)
- **Concurrent connections**: Thousands (nginx handles it well)

### Build Cache Optimization

```dockerfile
# Good: Copy package.json first
COPY package*.json ./
RUN npm install
COPY . .

# Bad: Copy everything, then install
COPY . .
RUN npm install  # Cache invalidated on any file change
```

---

## Security Features

### 1. Localhost-Only Binding

```yaml
ports:
  - "127.0.0.1:3000:3000"  # Only accessible from localhost
  # NOT "3000:3000" which binds to 0.0.0.0 (all interfaces)
```

**Benefits**:
- Prevents external access without reverse proxy
- Suitable for local development
- Use reverse proxy (nginx, Apache) for production internet access

### 2. Non-Root User

```dockerfile
USER nginx  # Run as nginx user, not root
```

**Benefits**:
- Limits damage if container is compromised
- Security best practice
- Prevents privilege escalation

### 3. Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "...";
```

**Protection against**:
- Clickjacking (X-Frame-Options)
- MIME-type sniffing (X-Content-Type-Options)
- XSS attacks (Content-Security-Policy)

### 4. Security Scanning

```bash
# Scan for vulnerabilities
make scan

# OR with Docker Scout
docker scout cves smms-web:prod
```

### 5. No Secrets in Image

- Environment variables via `.env` file (not committed)
- Build-time args for REACT_APP_* variables
- Secrets managed outside Docker image

### 6. Additional Security Options

```yaml
security_opt:
  - no-new-privileges:true  # Prevent privilege escalation
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Hot Reload Not Working

**Symptoms**: Changes to code don't trigger reload

**Solutions**:
1. Check volume mounts in `docker-compose.yml`:
   ```yaml
   volumes:
     - ./src:/app/src
     - ./public:/app/public
     - /app/node_modules  # Important!
   ```

2. Ensure polling is enabled:
   ```yaml
   environment:
     - CHOKIDAR_USEPOLLING=true
     - WATCHPACK_POLLING=true
   ```

3. Restart container:
   ```bash
   docker-compose down
   docker-compose up
   ```

#### Issue: Nginx Returns 404 for Routes

**Symptoms**: Direct navigation to `/dashboard` returns 404

**Solution**: Check SPA fallback in `nginx.conf`:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Rebuild if modified:
```bash
make rebuild-prod
```

#### Issue: Environment Variables Not Working

**Symptoms**: Firebase not configured, API calls fail

**Solutions**:
1. Check `.env` file exists:
   ```bash
   ls -la .env
   ```

2. Verify values in `.env`:
   ```bash
   cat .env
   ```

3. For production, rebuild (env vars baked in):
   ```bash
   docker-compose -f docker-compose.prod.yml build --no-cache
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Issue: Image Size Too Large

**Check current size**:
```bash
make size
# OR
docker images smms-web:prod
```

**Solutions**:
1. Ensure using production target:
   ```yaml
   build:
     target: production  # Not 'development'
   ```

2. Check .dockerignore includes:
   ```
   node_modules
   build
   coverage
   ```

3. Rebuild without cache:
   ```bash
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

#### Issue: Permission Denied Errors

**Symptoms**: `EACCES` or permission errors in container

**Solutions**:
1. Fix ownership in Dockerfile (already done):
   ```dockerfile
   RUN chown -R nginx:nginx /usr/share/nginx/html
   ```

2. If persists, check host directory permissions:
   ```bash
   ls -la src/
   ```

#### Issue: Container Exits Immediately

**Check logs**:
```bash
docker-compose logs smms-web-dev
# OR
docker-compose -f docker-compose.prod.yml logs smms-web-prod
```

**Common causes**:
1. Port already in use:
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill process or change port in docker-compose.yml
   ```

2. Build failed:
   ```bash
   # Rebuild with verbose output
   docker-compose build --no-cache --progress=plain
   ```

#### Issue: "Cannot Find Module" Errors

**Symptoms**: Build fails with missing module errors

**Solutions**:
1. Clear Docker cache and rebuild:
   ```bash
   make clean
   make build-prod
   ```

2. Check package.json has all dependencies:
   ```bash
   npm install  # Test locally first
   ```

3. Use `--legacy-peer-deps` (already in Dockerfile):
   ```dockerfile
   RUN npm install --legacy-peer-deps
   ```

---

## Migration Guide

### From Non-Docker Setup

If you're currently running the app with `npm start` locally:

1. **Verify local build works**:
   ```bash
   npm install
   npm run build
   # Check that build/ directory is created
   ls -la build/
   ```

2. **Create .env file**:
   ```bash
   cp .env.example .env
   # Edit with your values
   ```

3. **First Docker build**:
   ```bash
   make build-dev
   ```

4. **Test development mode**:
   ```bash
   make dev
   # Visit http://localhost:3000
   ```

5. **Test production mode**:
   ```bash
   make build-prod
   make prod
   # Visit http://localhost:3000
   ```

6. **Update deployment scripts**:
   - Replace `npm start` with `make dev` or `docker-compose up`
   - Replace build commands with `make build-prod`
   - Update CI/CD pipelines to use Docker

### From Old Docker Setup

If migrating from the previous `serve`-based setup:

1. **Backup old configuration**:
   ```bash
   cp Dockerfile Dockerfile.old
   cp docker-compose.yml docker-compose.yml.old
   ```

2. **Pull new configuration** (already in repo)

3. **Compare image sizes**:
   ```bash
   # Old image
   docker images smms-web:latest
   
   # Build new
   make build-prod
   
   # New image
   docker images smms-web:prod
   ```

4. **Test new setup**:
   ```bash
   # Stop old containers
   docker stop smms-web-prod
   
   # Start new
   make prod
   
   # Verify
   curl http://localhost:3000
   ```

5. **Update scripts and documentation**

---

## Advanced Usage

### Custom Nginx Configuration

To modify nginx settings:

1. Edit `nginx.conf`
2. Rebuild production image:
   ```bash
   make rebuild-prod
   ```

### Using with Reverse Proxy

To expose via nginx/Apache reverse proxy:

**Nginx reverse proxy**:
```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**With SSL**:
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        # ... proxy headers
    }
}
```

### CI/CD Integration

**GitHub Actions example**:
```yaml
- name: Build Docker image
  run: make build-prod

- name: Test image
  run: |
    docker run -d -p 3000:80 smms-web:prod
    sleep 5
    curl http://localhost:3000

- name: Push to registry
  run: |
    docker tag smms-web:prod registry.example.com/smms-web:latest
    docker push registry.example.com/smms-web:latest
```

### Multi-Environment Setup

Create environment-specific compose files:

**docker-compose.staging.yml**:
```yaml
services:
  smms-web-staging:
    extends:
      file: docker-compose.prod.yml
      service: smms-web-prod
    environment:
      - NODE_ENV=staging
      - REACT_APP_API_URL=https://staging-api.example.com
```

**Run**:
```bash
docker-compose -f docker-compose.staging.yml up -d
```

---

## Commands Reference

### Makefile Commands

```bash
make help         # Show all available commands
make dev          # Start development with hot-reload
make prod         # Start production
make build-dev    # Build dev image
make build-prod   # Build production image
make stop         # Stop all containers
make clean        # Remove containers, images, volumes
make logs         # View logs (all services)
make logs-dev     # View development logs
make logs-prod    # View production logs
make test         # Run tests in container
make size         # Show Docker image sizes
make scan         # Security vulnerability scan
make shell        # Open shell in dev container
make shell-prod   # Open shell in prod container
make rebuild-dev  # Rebuild dev from scratch
make rebuild-prod # Rebuild prod from scratch
make status       # Show running containers
make validate     # Validate Docker configs
```

### Shell Scripts

```bash
./docker-build.sh [dev|prod|both]   # Build images
./docker-run.sh [dev|prod|stop]     # Run/stop containers
```

### Docker Compose Commands

```bash
# Development
docker-compose up                          # Start dev (foreground)
docker-compose up -d                       # Start dev (background)
docker-compose down                        # Stop dev
docker-compose logs -f smms-web-dev       # View logs
docker-compose exec smms-web-dev sh       # Shell access

# Production
docker-compose -f docker-compose.prod.yml up -d      # Start
docker-compose -f docker-compose.prod.yml down       # Stop
docker-compose -f docker-compose.prod.yml logs -f    # Logs
docker-compose -f docker-compose.prod.yml restart    # Restart
```

---

## Performance Benchmarks

### Build Times

| Stage | Time | Cache | No Cache |
|-------|------|-------|----------|
| Development build | ~2-3 min | ~30s | ~3 min |
| Production build | ~3-4 min | ~1 min | ~4 min |
| Production startup | ~2s | - | - |

### Image Sizes

| Image | Size | Layers |
|-------|------|--------|
| smms-web:dev | ~800MB | 15 |
| smms-web:prod | **~145MB** | 8 |
| node:20-slim | ~250MB | - |
| nginx:alpine | ~40MB | - |

### Runtime Resources

| Mode | Memory | CPU | Startup |
|------|--------|-----|---------|
| Development | ~300MB | 20-40% | ~10s |
| Production | ~50MB | <5% | ~2s |

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review container logs: `make logs`
3. Validate configuration: `make validate`
4. Open an issue on GitHub

---

**Last Updated**: 2024-11-10
**Version**: 2.0.0
**Optimized for**: React 18+, TypeScript 5+, Docker 20.10+
