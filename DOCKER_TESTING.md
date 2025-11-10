# Docker Configuration Testing & Verification Guide

This guide provides step-by-step instructions to test and verify the Docker setup for SMMS Web.

## Prerequisites

Before testing, ensure you have:
- Docker 20.10+ installed
- Docker Compose v2.0+ installed
- Git repository cloned
- `.env` file created from `.env.example`

## Quick Verification

Run these commands to verify the setup is ready:

```bash
# Verify Docker is running
docker --version
docker compose version

# Validate configurations
docker compose config
docker compose -f docker-compose.prod.yml config

# Check files exist
ls -la Dockerfile nginx.conf Makefile docker-compose*.yml
```

## Test 1: Development Mode

### Build and Run
```bash
# Build development image
docker compose build smms-web-dev

# Start development server
docker compose up smms-web-dev
```

### Expected Results
- ✅ Container starts successfully
- ✅ React dev server running on port 3000
- ✅ Accessible at http://localhost:3000
- ✅ Application loads without errors

### Test Hot-Reload
1. Keep container running
2. Edit a file in `src/` (e.g., `src/App.tsx`)
3. Save changes
4. Verify browser auto-refreshes

### Stop Development
```bash
# Ctrl+C or in another terminal:
docker compose down
```

## Test 2: Production Build

### Build Production Image
```bash
# Build production image
docker compose -f docker-compose.prod.yml build

# Expected: Build completes successfully
# Expected: No errors during npm install or build
```

### Verify Image Size
```bash
# Check image size
docker images | grep smms-web

# Expected output (approximate):
# smms-web   prod   <image-id>   <time>   <150MB
```

### Start Production Server
```bash
# Start production container
docker compose -f docker-compose.prod.yml up -d

# Check container is running
docker ps | grep smms-web

# Check logs
docker compose -f docker-compose.prod.yml logs -f smms-web-prod
```

### Expected Results
- ✅ Container starts in <5 seconds
- ✅ Nginx starts successfully
- ✅ No errors in logs
- ✅ Application accessible at http://localhost:3000
- ✅ Static files served correctly

### Test SPA Routing
1. Navigate to http://localhost:3000
2. Navigate to any route (e.g., http://localhost:3000/dashboard)
3. Refresh the page
4. **Expected**: Page loads correctly (no 404)

### Test Health Endpoint
```bash
# Test health check
curl http://localhost:3000/health

# Expected: "healthy" response
```

### Stop Production
```bash
docker compose -f docker-compose.prod.yml down
```

## Test 3: Makefile Commands

Test each Makefile command:

```bash
# Help
make help
# Expected: Shows all available commands

# Build development
make build-dev
# Expected: Builds dev image successfully

# Build production
make build-prod
# Expected: Builds prod image successfully

# Show image sizes
make size
# Expected: Shows smms-web images with sizes

# Validate config
make validate
# Expected: Configurations are valid

# Development
make dev
# Expected: Starts dev server (Ctrl+C to stop)

# Production
make prod
# Expected: Starts prod server in background

# Logs
make logs-prod
# Expected: Shows production logs (Ctrl+C to exit)

# Status
make status
# Expected: Shows running containers

# Stop
make stop
# Expected: Stops all containers

# Clean (careful - removes images)
make clean
# Expected: Removes containers and images
```

## Test 4: Shell Scripts

### Test Build Script
```bash
# Development build
./docker-build.sh dev
# Expected: Builds dev image with colored output

# Production build
./docker-build.sh prod
# Expected: Builds prod image and shows size

# Both
./docker-build.sh both
# Expected: Builds both images
```

### Test Run Script
```bash
# Development
./docker-run.sh dev
# Expected: Starts dev server (Ctrl+C to stop)

# Production
./docker-run.sh prod
# Expected: Starts prod server in background

# Status
./docker-run.sh status
# Expected: Shows container status

# Logs
./docker-run.sh logs prod
# Expected: Shows production logs

# Stop
./docker-run.sh stop
# Expected: Stops all containers
```

## Test 5: Environment Variables

### Test Build-Time Variables
1. Update `.env` with test values:
   ```env
   REACT_APP_FIREBASE_API_KEY=test_key_123
   ```

2. Build production:
   ```bash
   docker compose -f docker-compose.prod.yml build
   ```

3. Start and check:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   # Open browser console and check if env vars are available
   ```

4. Expected: Environment variables baked into build

## Test 6: Security Features

### Test Localhost Binding
```bash
# Start production
make prod

# Try to access from external IP (should fail if properly bound)
curl http://<server-ip>:3000
# Expected: Connection refused

# Access from localhost (should work)
curl http://localhost:3000
# Expected: HTML response
```

### Test Security Headers
```bash
# Check security headers
curl -I http://localhost:3000

# Expected headers:
# - X-Frame-Options: SAMEORIGIN
# - X-Content-Type-Options: nosniff
# - X-XSS-Protection: 1; mode=block
# - Content-Security-Policy: ...
```

### Test Non-Root User
```bash
# Check running user
docker compose -f docker-compose.prod.yml exec smms-web-prod whoami

# Expected: nginx (not root)
```

## Test 7: Performance

### Test Startup Time
```bash
# Time production startup
time docker compose -f docker-compose.prod.yml up -d

# Expected: < 5 seconds
```

### Test Memory Usage
```bash
# Check memory usage
docker stats smms-web-prod --no-stream

# Expected: < 100MB memory usage
```

### Test Response Time
```bash
# Test response time
time curl -s http://localhost:3000 > /dev/null

# Expected: < 100ms
```

## Test 8: Nginx Configuration

### Test Gzip Compression
```bash
# Check compression
curl -H "Accept-Encoding: gzip" -I http://localhost:3000

# Expected: Content-Encoding: gzip
```

### Test Static Asset Caching
```bash
# Check cache headers for static assets
curl -I http://localhost:3000/static/css/main.*.css

# Expected: Cache-Control with long expiry
```

### Test Service Worker No-Cache
```bash
# Check service worker cache headers
curl -I http://localhost:3000/firebase-messaging-sw.js

# Expected: Cache-Control: no-cache
```

## Test 9: Rebuild and Clean

### Test Rebuild
```bash
# Rebuild without cache
make rebuild-prod

# Expected: Full rebuild from scratch
```

### Test Clean
```bash
# Clean up everything
make clean

# Expected: All containers and images removed

# Verify
docker images | grep smms-web
# Expected: No results
```

## Test 10: CI/CD Simulation

Simulate a CI/CD pipeline:

```bash
# Step 1: Clone repo (already done)

# Step 2: Create .env
cp .env.example .env

# Step 3: Build
make build-prod

# Step 4: Test build succeeded
docker images | grep smms-web:prod

# Step 5: Start
make prod

# Step 6: Health check
sleep 5
curl -f http://localhost:3000/health

# Step 7: Stop
make stop

# Expected: All steps succeed
```

## Common Issues and Solutions

### Issue: Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

### Issue: Build Fails
```bash
# Clean and rebuild
make clean
make build-prod
```

### Issue: Hot Reload Not Working
```bash
# Check volume mounts
docker compose config | grep volumes

# Restart with fresh build
docker compose down
docker compose up --build
```

### Issue: Nginx 404 Errors
```bash
# Check nginx config
docker compose -f docker-compose.prod.yml exec smms-web-prod cat /etc/nginx/nginx.conf

# Check build output exists
docker compose -f docker-compose.prod.yml exec smms-web-prod ls -la /usr/share/nginx/html
```

## Automated Test Script

Create a test script `test-docker.sh`:

```bash
#!/bin/bash
set -e

echo "🧪 Testing Docker Configuration..."

# Test 1: Validate configs
echo "✓ Validating configurations..."
docker compose config > /dev/null
docker compose -f docker-compose.prod.yml config > /dev/null

# Test 2: Build production
echo "✓ Building production image..."
docker compose -f docker-compose.prod.yml build > /dev/null

# Test 3: Check image size
echo "✓ Checking image size..."
SIZE=$(docker images smms-web:prod --format "{{.Size}}")
echo "  Image size: $SIZE"

# Test 4: Start production
echo "✓ Starting production..."
docker compose -f docker-compose.prod.yml up -d

# Test 5: Wait for startup
echo "✓ Waiting for startup..."
sleep 10

# Test 6: Health check
echo "✓ Testing health endpoint..."
curl -f http://localhost:3000/health

# Test 7: Test main page
echo "✓ Testing main page..."
curl -f http://localhost:3000 > /dev/null

# Test 8: Cleanup
echo "✓ Cleaning up..."
docker compose -f docker-compose.prod.yml down

echo "✅ All tests passed!"
```

Run the test script:
```bash
chmod +x test-docker.sh
./test-docker.sh
```

## Success Criteria

Your Docker setup is working correctly if:

- ✅ All configurations validate successfully
- ✅ Production image builds without errors
- ✅ Production image size is < 150MB
- ✅ Development mode has hot-reload working
- ✅ Production serves static files correctly
- ✅ SPA routing works (no 404 on refresh)
- ✅ Security headers are present
- ✅ Health check returns "healthy"
- ✅ Application loads and functions correctly
- ✅ All Makefile commands work
- ✅ Localhost-only binding is enforced
- ✅ Non-root user execution verified

## Performance Benchmarks

Compare your results with these targets:

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| Image Size | <150MB | <120MB | <100MB |
| Build Time | <10min | <5min | <3min |
| Startup Time | <5s | <3s | <2s |
| Memory Usage | <100MB | <75MB | <50MB |
| Response Time | <200ms | <100ms | <50ms |

## Next Steps

After successful testing:

1. ✅ Commit and push changes
2. ✅ Update deployment documentation
3. ✅ Configure CI/CD pipeline
4. ✅ Deploy to staging environment
5. ✅ Run security scans
6. ✅ Deploy to production

## Support

For issues or questions:
- Check [DOCKER.md](DOCKER.md) for detailed documentation
- Review logs: `make logs` or `make logs-prod`
- Check container status: `make status`
- Clean and rebuild: `make clean && make build-prod`

---

**Last Updated**: 2024-11-10
**Version**: 1.0.0
