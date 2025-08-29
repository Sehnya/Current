#!/bin/bash

echo "🚀 Starting Current Stack with Cloudflare Tunnel..."

# Start Docker services
echo "📦 Starting Docker services..."
docker-compose up --build -d

# Wait a moment for services to start
sleep 5

# Check if services are running
echo "🔍 Checking services..."
docker-compose ps

# Start Cloudflare tunnel
echo "🌐 Starting Cloudflare tunnel..."
echo "Your app will be available at: https://current.seh-nya.com"
echo "Press Ctrl+C to stop the tunnel"

cloudflared tunnel --config cloudflare-tunnel.yml run current-stack