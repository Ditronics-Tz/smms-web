#!/bin/bash
# =============================================================================
# Docker Build Script for SMMS Web Application
# Supports both development and production builds with optimization
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

# Default to production build
BUILD_TYPE="${1:-prod}"

echo ""
echo "==================================================================="
echo "SMMS Web Application - Docker Build Script"
echo "==================================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Using .env.example as template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Created .env file. Please update it with your values."
    else
        print_error ".env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Build based on type
case "$BUILD_TYPE" in
    dev|development)
        print_info "Building DEVELOPMENT Docker image..."
        docker-compose build smms-web-dev
        print_success "Development image built successfully!"
        echo ""
        print_info "To run: docker-compose up smms-web-dev"
        print_info "Or use: make dev"
        ;;
    
    prod|production)
        print_info "Building PRODUCTION Docker image (optimized)..."
        docker-compose -f docker-compose.prod.yml build smms-web-prod
        print_success "Production image built successfully!"
        
        # Show image size
        echo ""
        print_info "Image size information:"
        docker images | grep -E "smms-web|REPOSITORY" | head -5
        
        # Check if image is under 150MB
        IMAGE_SIZE=$(docker images smms-web:prod --format "{{.Size}}" | head -1)
        echo ""
        print_info "Production image size: ${IMAGE_SIZE}"
        print_info "Target: < 150MB"
        
        echo ""
        print_info "To run: docker-compose -f docker-compose.prod.yml up -d"
        print_info "Or use: make prod"
        ;;
    
    both)
        print_info "Building BOTH development and production images..."
        
        print_info "Building development image..."
        docker-compose build smms-web-dev
        print_success "Development image built!"
        
        print_info "Building production image..."
        docker-compose -f docker-compose.prod.yml build smms-web-prod
        print_success "Production image built!"
        
        echo ""
        docker images | grep -E "smms-web|REPOSITORY" | head -5
        ;;
    
    *)
        print_error "Invalid build type: $BUILD_TYPE"
        echo ""
        echo "Usage: $0 [dev|prod|both]"
        echo "  dev  - Build development image with hot-reload"
        echo "  prod - Build production image with nginx (default)"
        echo "  both - Build both images"
        exit 1
        ;;
esac

echo ""
echo "==================================================================="
print_success "Build complete!"
echo "==================================================================="
echo ""
