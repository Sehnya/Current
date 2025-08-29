#!/bin/bash

echo "🛑 Stopping Current Stack services..."

docker-compose down

echo "✅ Services stopped successfully!"
echo "💾 Data is preserved in ./app/data/"