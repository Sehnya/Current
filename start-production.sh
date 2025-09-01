#!/bin/bash

echo "🚀 Starting Current Stack with Cloudflare Tunnel..."

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if credentials file exists
CREDS_FILE=$(grep "credentials-file:" cloudflare-tunnel.yml | cut -d' ' -f2)
if [ ! -f "$CREDS_FILE" ]; then
    echo "❌ Cloudflare credentials not found: $CREDS_FILE"
    echo "Run: cloudflared tunnel login"
    exit 1
fi

# Start all services including tunnel
echo "🔨 Starting services with Cloudflare tunnel..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 Production URL: https://current.seh-nya.com"
    echo "🏠 Local URL: http://localhost"
    echo "🔌 API: https://current.seh-nya.com/api"
    echo "📊 API Docs: https://current.seh-nya.com/api/docs"
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    echo "📊 To check status: docker-compose ps"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi