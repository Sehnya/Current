#!/bin/bash

# Railway startup script for Current API
set -e

echo "🌊 Starting Current API..."

# Ensure we're in the correct directory
cd "$(dirname "$0")"
echo "📁 Working directory: $(pwd)"

# Create data directory if it doesn't exist
mkdir -p data

# Set default port if not provided
export PORT=${PORT:-8000}

echo "📊 Port: $PORT"
echo "�  Python version: $(python --version)"
echo "📦 Pip version: $(pip --version)"

# Check if run_server.py exists
if [ ! -f "run_server.py" ]; then
    echo "❌ run_server.py not found in $(pwd)"
    echo "📂 Files in current directory:"
    ls -la
    exit 1
fi

# Find uvicorn in the Python path
echo "🔍 Looking for uvicorn..."
UVICORN_PATH=$(python -m pip show uvicorn | grep Location | cut -d' ' -f2)
echo "📍 Uvicorn location: $UVICORN_PATH"

# Start the application using run_server.py
echo "🚀 Starting server..."
exec python run_server.py