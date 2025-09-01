#!/bin/bash

echo "🗑️  Uninstalling Current Stack service..."

PLIST_FILE="com.currentstack.services.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

# Stop and unload the service
launchctl unload "$LAUNCH_AGENTS_DIR/$PLIST_FILE" 2>/dev/null || true

# Remove the plist file
rm -f "$LAUNCH_AGENTS_DIR/$PLIST_FILE"

# Stop Docker containers
echo "🛑 Stopping Docker containers..."
docker-compose down 2>/dev/null || true

echo "✅ Service uninstalled successfully!"
echo "💡 Your containers have been stopped. You can start them manually with:"
echo "  docker-compose up -d"