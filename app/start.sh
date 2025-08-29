#!/bin/bash

# Railway startup script for Current API
set -e

echo "🌊 Starting Current API..."

# Create data directory if it doesn't exist
mkdir -p /app/data

# Set default port if not provided
export PORT=${PORT:-8000}

echo "📊 Port: $PORT"
echo "🐍 Python version: $(python --version)"
echo "📦 Pip version: $(pip --version)"

# Find uvicorn in the Python path
echo "🔍 Looking for uvicorn..."
UVICORN_PATH=$(python -m pip show uvicorn | grep Location | cut -d' ' -f2)
echo "📍 Uvicorn location: $UVICORN_PATH"

# Start the application using run_server.py
echo "🚀 Starting server..."
exec python run_server.py