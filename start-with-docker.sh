#!/bin/bash

echo "🚀 Starting Docker and Current Stack..."

# Function to check if Docker is running
check_docker() {
    docker info > /dev/null 2>&1
}

# Function to start Docker Desktop
start_docker() {
    echo "🐳 Starting Docker Desktop..."
    
    # Try different possible Docker Desktop locations
    if [ -f "/Applications/Docker.app/Contents/MacOS/Docker" ]; then
        open -a "/Applications/Docker.app"
    elif [ -f "/Applications/Docker Desktop.app/Contents/MacOS/Docker Desktop" ]; then
        open -a "/Applications/Docker Desktop.app"
    else
        echo "❌ Docker Desktop not found in Applications folder."
        echo "Please start Docker Desktop manually and then run:"
        echo "  ./start-permanent.sh"
        exit 1
    fi
    
    # Wait for Docker to start
    echo "⏳ Waiting for Docker to start..."
    local timeout=60
    local count=0
    
    while ! check_docker && [ $count -lt $timeout ]; do
        sleep 2
        count=$((count + 2))
        echo "   Waiting... ($count/$timeout seconds)"
    done
    
    if check_docker; then
        echo "✅ Docker is now running!"
    else
        echo "❌ Docker failed to start within $timeout seconds"
        echo "Please start Docker Desktop manually and try again"
        exit 1
    fi
}

# Check if Docker is already running
if check_docker; then
    echo "✅ Docker is already running"
else
    start_docker
fi

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Stop any existing containers and tunnel
echo "🛑 Stopping any existing containers and tunnel..."
docker-compose down 2>/dev/null || true
pkill cloudflared 2>/dev/null || true

# Start services in detached mode with build
echo "🔨 Starting services permanently..."
docker-compose up -d --build

# Wait for services to initialize
echo "⏳ Waiting for services to initialize..."
sleep 10

# Start Cloudflare tunnel in background
echo "🌐 Starting Cloudflare tunnel..."
if command -v cloudflared &> /dev/null; then
    # Check if credentials exist
    CREDS_FILE=$(grep "credentials-file:" cloudflare-tunnel.yml | cut -d' ' -f2)
    if [ -f "$CREDS_FILE" ]; then
        nohup cloudflared tunnel --config cloudflare-tunnel.yml run > /tmp/cloudflared.log 2>&1 &
        TUNNEL_PID=$!
        echo $TUNNEL_PID > /tmp/cloudflared.pid
        echo "✅ Cloudflare tunnel started (PID: $TUNNEL_PID)"
        sleep 5
    else
        echo "⚠️  Cloudflare credentials not found. Tunnel not started."
        echo "   Run: cloudflared tunnel login"
    fi
else
    echo "⚠️  cloudflared not installed. Install with: brew install cloudflared"
fi

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 SUCCESS! Current Stack is now running permanently!"
    echo "=================================================="
    echo ""
    echo "🌐 Your site is available at:"
    echo "   Production: https://current.seh-nya.com"
    echo "   Local: http://localhost"
    echo ""
    echo "🔌 API endpoints:"
    echo "   API: https://current.seh-nya.com/api"
    echo "   Docs: https://current.seh-nya.com/api/docs"
    echo ""
    echo "🎯 These services will now:"
    echo "   ✅ Keep running when you close terminal/IDE"
    echo "   ✅ Automatically restart if they crash"
    echo "   ✅ Restart when Docker starts (system reboot)"
    echo ""
    echo "📊 Management commands:"
    echo "   ./check-services.sh     # Check status"
    echo "   docker-compose logs -f  # View logs"
    echo "   docker-compose down     # Stop services"
    echo ""
    
    # Create a comprehensive status check script
    cat > check-services.sh << 'EOF'
#!/bin/bash
echo "📊 Current Stack Services Status"
echo "================================"
docker-compose ps
echo ""

echo "🔗 Service URLs:"
echo "  🌐 Production: https://current.seh-nya.com"
echo "  🏠 Local: http://localhost"
echo "  🔌 API: https://current.seh-nya.com/api"
echo "  📚 API Docs: https://current.seh-nya.com/api/docs"
echo ""

echo "📈 Quick Health Check:"
if curl -s http://localhost/api/ready > /dev/null; then
    echo "  ✅ API is responding"
else
    echo "  ❌ API is not responding"
fi

if curl -s http://localhost > /dev/null; then
    echo "  ✅ Web is responding"
else
    echo "  ❌ Web is not responding"
fi

if pgrep cloudflared > /dev/null; then
    echo "  ✅ Cloudflare tunnel is running"
else
    echo "  ❌ Cloudflare tunnel is not running"
fi

echo ""
echo "📝 Recent logs (last 10 lines):"
echo "docker-compose logs --tail=10"
EOF
    chmod +x check-services.sh
    
    echo "💡 Created check-services.sh for quick status monitoring"
    echo ""
    echo "🚀 You can now close this terminal - your services will keep running!"
    
else
    echo "❌ Failed to start services. Checking logs..."
    docker-compose logs --tail=20
    echo ""
    echo "💡 Try running: docker-compose logs -f"
    exit 1
fi