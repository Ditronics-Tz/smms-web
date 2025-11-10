# Docker Quick Start Guide

## 🚀 Quick Commands

### Development (Hot-Reload)
```bash
make dev
# OR
docker compose up
```
Access at: http://localhost:3000

### Production (Optimized)
```bash
make prod
# OR
docker compose -f docker-compose.prod.yml up -d
```
Access at: http://localhost:3000

### Stop All Containers
```bash
make stop
# OR
docker compose down && docker compose -f docker-compose.prod.yml down
```

## 📋 Command Reference

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make dev` | Start development with hot-reload |
| `make prod` | Start production server |
| `make build-prod` | Build production Docker image |
| `make stop` | Stop all containers |
| `make logs` | View logs |
| `make clean` | Clean up Docker resources |
| `make size` | Show image sizes |
| `make test` | Run tests in container |

## 🔧 First-Time Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your values**:
   ```bash
   nano .env  # or your editor
   ```

3. **Start development**:
   ```bash
   make dev
   ```

## 📖 Full Documentation

See [DOCKER.md](DOCKER.md) for complete guide including:
- Architecture details
- Configuration explanations
- Troubleshooting
- Security features
- Performance benchmarks
- CI/CD integration

## 🐛 Troubleshooting

**Hot reload not working?**
- Check volume mounts in docker-compose.yml
- Ensure CHOKIDAR_USEPOLLING=true in environment

**Build fails?**
```bash
make clean
make build-prod
```

**Port already in use?**
```bash
lsof -i :3000  # Check what's using port 3000
```

**Need to rebuild?**
```bash
make rebuild-prod  # Full rebuild without cache
```

## 📊 Image Comparison

| Configuration | Size |
|--------------|------|
| Old (node + serve) | ~400MB |
| New (nginx:alpine) | **<150MB** ✅ |

## 🔐 Security Features

- ✅ Localhost-only binding (127.0.0.1)
- ✅ Non-root user execution
- ✅ Security headers (CSP, XSS protection)
- ✅ No secrets in image
- ✅ Minimal attack surface

## 📦 What's Included

```
smms-web/
├── Dockerfile              # Multi-stage build config
├── docker-compose.yml      # Development setup
├── docker-compose.prod.yml # Production setup
├── nginx.conf             # Nginx configuration
├── Makefile               # Easy commands
├── docker-build.sh        # Build script
├── docker-run.sh          # Run script
├── DOCKER.md              # Full documentation
└── DOCKER_QUICK_START.md  # This file
```

## 💡 Tips

- Use `make dev` for development (hot-reload enabled)
- Use `make prod` for production (optimized build)
- Check `make logs` if something goes wrong
- Run `make size` to verify image size
- Use `make shell` to access container shell

---

**Need help?** Check [DOCKER.md](DOCKER.md) or run `make help`
