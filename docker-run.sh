#!/bin/bash
# =============================================================================
# Docker Run Script for SMMS Web Application
# Provides easy deployment for both development and production modes
# =============================================================================

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Default to production mode
RUN_MODE="${1:-prod}"

echo ""
echo "==================================================================="
echo "SMMS Web Application - Docker Run Script"
echo "==================================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found!"
    if [ -f .env.example ]; then
        print_warning "Creating .env from .env.example..."
        cp .env.example .env
        print_warning "Please update .env with your actual values before running."
        read -p "Press Enter to continue or Ctrl+C to exit..."
    else
        print_error ".env file required. Please create one."
        exit 1
    fi
fi

# Run based on mode
case "$RUN_MODE" in
    dev|development)
        print_info "Starting DEVELOPMENT mode with hot-reload..."
        print_info "Container will be bound to: http://localhost:3000"
        echo ""
        docker-compose up --build smms-web-dev
        ;;
    
    prod|production)
        print_info "Starting PRODUCTION mode..."
        print_info "Building optimized image..."
        docker-compose -f docker-compose.prod.yml up -d --build
        
        print_success "Application started successfully!"
        echo ""
        print_info "Access the application at: http://localhost:3000"
        print_info "Bound to localhost (127.0.0.1) only for security"
        echo ""
        print_info "Useful commands:"
        echo "  - View logs:    docker-compose -f docker-compose.prod.yml logs -f"
        echo "  - Stop:         docker-compose -f docker-compose.prod.yml down"
        echo "  - Restart:      docker-compose -f docker-compose.prod.yml restart"
        echo "  - Status:       docker ps"
        echo ""
        print_info "Or use the Makefile:"
        echo "  - View logs:    make logs-prod"
        echo "  - Stop:         make stop"
        ;;
    
    stop)
        print_info "Stopping all containers..."
        docker-compose down 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
        print_success "All containers stopped"
        ;;
    
    logs)
        MODE="${2:-prod}"
        if [ "$MODE" = "dev" ]; then
            docker-compose logs -f smms-web-dev
        else
            docker-compose -f docker-compose.prod.yml logs -f smms-web-prod
        fi
        ;;
    
    status)
        print_info "Container status:"
        echo ""
        docker ps -a | grep -E "smms-web|CONTAINER" || print_warning "No containers found"
        ;;
    
    *)
        print_error "Invalid run mode: $RUN_MODE"
        echo ""
        echo "Usage: $0 [dev|prod|stop|logs|status]"
        echo ""
        echo "Modes:"
        echo "  dev    - Start development server with hot-reload"
        echo "  prod   - Start production server with nginx (default)"
        echo "  stop   - Stop all running containers"
        echo "  logs   - View container logs (add 'dev' or 'prod')"
        echo "  status - Show container status"
        echo ""
        echo "Examples:"
        echo "  $0 dev           # Start development"
        echo "  $0 prod          # Start production"
        echo "  $0 logs dev      # View dev logs"
        echo "  $0 stop          # Stop all"
        exit 1
        ;;
esac

echo ""
