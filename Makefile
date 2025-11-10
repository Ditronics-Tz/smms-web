# =============================================================================
# Makefile for SMMS Web Application Docker Management
# Provides easy-to-use commands for building, running, and managing containers
# =============================================================================

.PHONY: help build-dev build-prod dev prod stop clean logs test size scan

# Default target - show help
help:
	@echo "==================================================================="
	@echo "SMMS Web Application - Docker Management Commands"
	@echo "==================================================================="
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev          - Start development server with hot-reload"
	@echo "  make build-dev    - Build development Docker image"
	@echo ""
	@echo "Production Commands:"
	@echo "  make prod         - Start production server (nginx)"
	@echo "  make build-prod   - Build production Docker image"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make stop         - Stop all running containers"
	@echo "  make clean        - Remove all containers and images"
	@echo "  make logs         - View container logs"
	@echo "  make logs-dev     - View development container logs"
	@echo "  make logs-prod    - View production container logs"
	@echo "  make test         - Run tests in container"
	@echo "  make size         - Show Docker image sizes"
	@echo "  make scan         - Security scan of production image"
	@echo "  make shell        - Open shell in running dev container"
	@echo "  make shell-prod   - Open shell in running prod container"
	@echo ""
	@echo "==================================================================="

# Build development image
build-dev:
	@echo "Building development Docker image..."
	docker-compose build smms-web-dev
	@echo "✓ Development image built successfully"

# Build production image
build-prod:
	@echo "Building production Docker image (optimized)..."
	docker-compose -f docker-compose.prod.yml build smms-web-prod
	@echo "✓ Production image built successfully"
	@echo ""
	@make size

# Start development server with hot-reload
dev:
	@echo "Starting development server on http://localhost:3000..."
	docker-compose up --build smms-web-dev
	
# Start development server in background
dev-detached:
	@echo "Starting development server in background..."
	docker-compose up -d --build smms-web-dev
	@echo "✓ Development server started at http://localhost:3000"
	@echo "  View logs: make logs-dev"

# Start production server
prod:
	@echo "Starting production server on http://localhost:3000..."
	docker-compose -f docker-compose.prod.yml up -d --build
	@echo "✓ Production server started successfully"
	@echo "  Access: http://localhost:3000"
	@echo "  View logs: make logs-prod"

# Stop all containers
stop:
	@echo "Stopping all containers..."
	docker-compose down
	docker-compose -f docker-compose.prod.yml down
	@echo "✓ All containers stopped"

# Clean up containers, images, and volumes
clean: stop
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --rmi all 2>/dev/null || true
	docker-compose -f docker-compose.prod.yml down -v --rmi all 2>/dev/null || true
	docker system prune -f
	@echo "✓ Cleanup complete"

# View logs from all services
logs:
	docker-compose logs -f

# View development logs
logs-dev:
	docker-compose logs -f smms-web-dev

# View production logs
logs-prod:
	docker-compose -f docker-compose.prod.yml logs -f smms-web-prod

# Run tests in container
test:
	@echo "Running tests in Docker container..."
	docker-compose run --rm smms-web-dev npm test -- --watchAll=false

# Show image sizes
size:
	@echo "==================================================================="
	@echo "Docker Image Sizes"
	@echo "==================================================================="
	@docker images | grep -E "smms-web|REPOSITORY" || echo "No images found"
	@echo ""
	@echo "Target: Production image < 150MB"
	@echo "==================================================================="

# Security scan using Docker Scout (if available)
scan:
	@echo "Running security scan on production image..."
	@if command -v docker scout >/dev/null 2>&1; then \
		docker scout cves smms-web:prod; \
	else \
		echo "Docker Scout not installed. Install with: docker scout install"; \
	fi

# Open shell in development container
shell:
	@echo "Opening shell in development container..."
	docker-compose exec smms-web-dev /bin/sh

# Open shell in production container
shell-prod:
	@echo "Opening shell in production container..."
	docker-compose -f docker-compose.prod.yml exec smms-web-prod /bin/sh

# Rebuild and restart (useful for code changes that require full rebuild)
rebuild-dev:
	@echo "Rebuilding development environment..."
	docker-compose down
	docker-compose build --no-cache smms-web-dev
	docker-compose up -d smms-web-dev
	@echo "✓ Development environment rebuilt"

rebuild-prod:
	@echo "Rebuilding production environment..."
	docker-compose -f docker-compose.prod.yml down
	docker-compose -f docker-compose.prod.yml build --no-cache smms-web-prod
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✓ Production environment rebuilt"

# Check running containers
status:
	@echo "==================================================================="
	@echo "Running Containers"
	@echo "==================================================================="
	@docker ps -a | grep -E "smms-web|CONTAINER" || echo "No containers running"

# Validate Docker configuration
validate:
	@echo "Validating Docker configuration..."
	docker-compose config
	@echo ""
	@echo "Validating production configuration..."
	docker-compose -f docker-compose.prod.yml config
	@echo "✓ Configuration is valid"
