#!/bin/bash

# Current API Deployment Script
# Usage: ./deploy.sh [platform]
# Platforms: railway, vercel, docker, vps

set -e

PLATFORM=${1:-docker}
PROJECT_NAME="current"

echo "🚀 Deploying Current to $PLATFORM..."

case $PLATFORM in
  "railway")
    echo "📡 Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
      echo "Installing Railway CLI..."
      npm install -g @railway/cli
    fi
    
    # Login to Railway
    railway login
    
    # Deploy API
    echo "🔧 Deploying API service..."
    cd api
    railway up --service current-api
    cd ..
    
    # Deploy Web
    echo "🌐 Deploying Web service..."
    cd web
    railway up --service current-web
    cd ..
    
    echo "✅ Railway deployment complete!"
    ;;
    
  "vercel")
    echo "▲ Deploying Web to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
      echo "Installing Vercel CLI..."
      npm install -g vercel
    fi
    
    # Deploy web to Vercel
    cd web
    vercel --prod
    cd ..
    
    echo "⚠️  Don't forget to deploy your API separately (Railway, Render, etc.)"
    echo "✅ Vercel deployment complete!"
    ;;
    
  "docker")
    echo "🐳 Deploying with Docker..."
    
    # Build and run production containers
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build
    docker-compose -f docker-compose.prod.yml up -d
    
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    # Health check
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
      echo "✅ API is healthy!"
    else
      echo "❌ API health check failed"
      exit 1
    fi
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
      echo "✅ Web is healthy!"
    else
      echo "❌ Web health check failed"
      exit 1
    fi
    
    echo "✅ Docker deployment complete!"
    echo "🌐 Web: http://localhost:3000"
    echo "🔧 API: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
    ;;
    
  "vps")
    echo "🏠 Deploying to VPS..."
    
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install dependencies
    sudo apt install -y python3 python3-pip python3-venv nginx nodejs npm
    
    # Setup API
    echo "🔧 Setting up API..."
    cd api
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    
    # Setup Web
    echo "🌐 Setting up Web..."
    cd web
    npm install
    npm run build
    cd ..
    
    # Create systemd services
    echo "⚙️ Creating systemd services..."
    
    # API service
    sudo tee /etc/systemd/system/current-api.service > /dev/null <<EOF
[Unit]
Description=Current API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PWD/api
Environment=PATH=$PWD/api/venv/bin
Environment=PYTHONPATH=$PWD/api
ExecStart=$PWD/api/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF
    
    # Web service
    sudo tee /etc/systemd/system/current-web.service > /dev/null <<EOF
[Unit]
Description=Current Web
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PWD/web
Environment=NEXT_PUBLIC_API_URL=http://localhost:8000
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOF
    
    # Start services
    sudo systemctl daemon-reload
    sudo systemctl enable current-api current-web
    sudo systemctl start current-api current-web
    
    echo "✅ VPS deployment complete!"
    echo "🔧 API: http://localhost:8000"
    echo "🌐 Web: http://localhost:3000"
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: railway, vercel, docker, vps"
    exit 1
    ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "📊 Monitor your services and check logs for any issues."