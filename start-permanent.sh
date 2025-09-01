#!/bin/bash

echo "🚀 Starting Current Stack permanently..."

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Start services in detached mode with build
echo "🔨 Starting services permanently..."
docker-compose up -d --build

# Wait for services to initialize
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully and will run permanently!"
    echo ""
    echo "🌐 Production URL: https://current.seh-nya.com"
    echo "🏠 Local URL: http://localhost"
    echo "🔌 API: https://current.seh-nya.com/api"
    echo "📊 API Docs: https://current.seh-nya.com/api/docs"
    echo ""
    echo "🎯 These services will now:"
    echo "  • Keep running when you close terminal/IDE"
    echo "  • Automatically restart if they crash"
    echo "  • Restart when Docker starts (system reboot)"
    echo ""
    echo "📝 Management commands:"
    echo "  docker-compose logs -f    # View logs"
    echo "  docker-compose ps         # Check status"
    echo "  docker-compose down       # Stop services"
    echo "  docker-compose restart    # Restart services"
    
    # Create a status check script
    cat > check-services.sh << 'EOF'
#!/bin/bash
echo "📊 Current Stack Services Status:"
echo "=================================="
docker-compose ps
echo ""
echo "🔗 Quick Links:"
echo "  Production: https://current.seh-nya.com"
echo "  Local: http://localhost"
echo "  API: https://current.seh-nya.com/api"
echo "  API Docs: https://current.seh-nya.com/api/docs"
echo ""
echo "📝 Recent logs (last 20 lines):"
echo "docker-compose logs --tail=20"
EOF
    chmod +x check-services.sh
    echo "💡 Created check-services.sh for quick status checks"
    
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi