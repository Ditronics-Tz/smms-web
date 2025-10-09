#!/bin/bash

# Production deployment script

echo "Starting SMMS Web Application in production mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Make sure to set environment variables."
fi

# Start the application using docker-compose
docker compose up -d

echo "Application started successfully!"
echo "Access the application at: http://localhost:3000"
echo "To view logs: docker-compose logs -f smms-web"
echo "To stop: docker-compose down"