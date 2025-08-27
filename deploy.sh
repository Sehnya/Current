#!/bin/bash

# Current - Railway Deployment Script
echo "🌊 Deploying Current to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login check
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

# Create project if it doesn't exist
echo "📦 Setting up Railway project..."
railway new current --template blank || true

# Deploy API service
echo "🚀 Deploying API service..."
cd api
railway service create current-api || true
railway up --service current-api
cd ..

# Deploy Web service  
echo "🌐 Deploying Web service..."
cd web
railway service create current-web || true
railway up --service current-web
cd ..

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your API service URL from Railway dashboard"
echo "2. Update NEXT_PUBLIC_API_URL in your web service environment variables"
echo "3. Redeploy the web service"
echo ""
echo "🔗 Useful commands:"
echo "  railway logs --service current-api    # View API logs"
echo "  railway logs --service current-web    # View web logs"
echo "  railway open --service current-web    # Open web app"
echo ""
echo "🎉 Your Current deployment is ready!"