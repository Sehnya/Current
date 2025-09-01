#!/bin/bash

echo "🚀 Starting Current Stack services in background..."

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start services in detached mode
echo "🔨 Starting services in background..."
docker-compose up -d --build

# Wait a moment for services to initialize
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully in background!"
    echo ""
    echo "🌐 Web UI: http://localhost"
    echo "🔌 API: http://localhost/api"
    echo "📊 API Docs: http://localhost/api/docs"
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    echo "📊 To check status: docker-compose ps"
    
    # Create a simple status check script
    cat > check-status.sh << 'EOF'
#!/bin/bash
echo "📊 Current Stack Services Status:"
docker-compose ps
echo ""
echo "🔗 Quick Links:"
echo "  Web UI: http://localhost"
echo "  API: http://localhost/api"
echo "  API Docs: http://localhost/api/docs"
EOF
    chmod +x check-status.sh
    echo "💡 Created check-status.sh for quick status checks"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi