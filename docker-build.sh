#!/bin/bash

# Build script for SMMS Web Application

echo "Building SMMS Web Application Docker image..."

# Build the Docker image
docker build -t smms-web:latest -t smms-web:prod .

echo "Docker image built successfully!"
echo "To run the container, use: docker-compose up -d"
echo "Or run directly with: docker run -p 3000:3000 --env-file .env smms-web:latest"