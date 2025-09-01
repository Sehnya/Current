#!/bin/bash

echo "🛑 Stopping all Current Stack services..."

# Stop Docker containers
echo "📦 Stopping Docker containers..."
docker-compose down

# Stop Cloudflare tunnel
echo "🌐 Stopping Cloudflare tunnel..."
if [ -f "/tmp/cloudflared.pid" ]; then
    PID=$(cat /tmp/cloudflared.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "✅ Stopped tunnel (PID: $PID)"
    fi
    rm -f /tmp/cloudflared.pid
fi

# Kill any remaining cloudflared processes
pkill cloudflared 2>/dev/null || true

echo "✅ All services stopped!"
echo ""
echo "💡 To start again: ./start-with-docker.sh"