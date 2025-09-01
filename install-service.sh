#!/bin/bash

echo "🔧 Installing Current Stack as a system service..."

PROJECT_DIR="/Users/sehnya/Code 2.0/OSource"
PLIST_FILE="com.currentstack.services.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Check if Docker is installed and get the correct path
DOCKER_COMPOSE_PATH=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_PATH=$(which docker-compose)
elif [ -f "/usr/local/bin/docker-compose" ]; then
    DOCKER_COMPOSE_PATH="/usr/local/bin/docker-compose"
elif [ -f "/opt/homebrew/bin/docker-compose" ]; then
    DOCKER_COMPOSE_PATH="/opt/homebrew/bin/docker-compose"
else
    echo "❌ docker-compose not found. Please install Docker Desktop."
    exit 1
fi

echo "📍 Found docker-compose at: $DOCKER_COMPOSE_PATH"

# Update the plist file with correct docker-compose path
sed "s|/usr/local/bin/docker-compose|$DOCKER_COMPOSE_PATH|g" "$PLIST_FILE" > "$LAUNCH_AGENTS_DIR/$PLIST_FILE"

# Stop any existing service
launchctl unload "$LAUNCH_AGENTS_DIR/$PLIST_FILE" 2>/dev/null || true

# Load the new service
launchctl load "$LAUNCH_AGENTS_DIR/$PLIST_FILE"

echo "✅ Service installed successfully!"
echo ""
echo "🎯 Your Current Stack will now:"
echo "  • Start automatically when you log in"
echo "  • Keep running when terminal/IDE is closed"
echo "  • Restart automatically if it crashes"
echo "  • Be accessible at https://current.seh-nya.com"
echo ""
echo "📊 To check status:"
echo "  launchctl list | grep currentstack"
echo ""
echo "🛑 To stop the service:"
echo "  launchctl unload ~/Library/LaunchAgents/$PLIST_FILE"
echo ""
echo "🔄 To restart the service:"
echo "  launchctl unload ~/Library/LaunchAgents/$PLIST_FILE"
echo "  launchctl load ~/Library/LaunchAgents/$PLIST_FILE"