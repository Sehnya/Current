#!/bin/bash

echo "🌐 Starting Cloudflare Tunnel in background..."

# Get the absolute path of the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared is not installed. Install it with:"
    echo "   brew install cloudflared"
    echo "   or download from: https://github.com/cloudflare/cloudflared/releases"
    exit 1
fi

# Check if tunnel config exists
if [ ! -f "cloudflare-tunnel.yml" ]; then
    echo "❌ cloudflare-tunnel.yml not found"
    exit 1
fi

# Check if credentials file exists
CREDS_FILE=$(grep "credentials-file:" cloudflare-tunnel.yml | cut -d' ' -f2)
if [ ! -f "$CREDS_FILE" ]; then
    echo "❌ Credentials file not found: $CREDS_FILE"
    echo "Make sure you've authenticated with: cloudflared tunnel login"
    exit 1
fi

# Start tunnel in background
echo "🚀 Starting tunnel..."
nohup cloudflared tunnel --config cloudflare-tunnel.yml run > /tmp/cloudflared.log 2>&1 &
TUNNEL_PID=$!

# Wait a moment to check if it started successfully
sleep 3

if ps -p $TUNNEL_PID > /dev/null; then
    echo "✅ Cloudflare tunnel started successfully!"
    echo "📝 PID: $TUNNEL_PID"
    echo "📊 Log file: /tmp/cloudflared.log"
    echo "🌐 Your site should be available at: https://current.seh-nya.com"
    echo ""
    echo "To stop the tunnel:"
    echo "  kill $TUNNEL_PID"
    echo "  or use: pkill cloudflared"
    
    # Save PID for easy stopping
    echo $TUNNEL_PID > /tmp/cloudflared.pid
    echo "💡 PID saved to /tmp/cloudflared.pid"
else
    echo "❌ Failed to start tunnel. Check logs:"
    echo "  tail -f /tmp/cloudflared.log"
    exit 1
fi