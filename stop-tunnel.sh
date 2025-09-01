#!/bin/bash

echo "🛑 Stopping Cloudflare Tunnel..."

# Try to stop using saved PID first
if [ -f "/tmp/cloudflared.pid" ]; then
    PID=$(cat /tmp/cloudflared.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo "✅ Stopped tunnel with PID: $PID"
        rm /tmp/cloudflared.pid
    else
        echo "⚠️  Process with saved PID not running"
    fi
fi

# Kill any remaining cloudflared processes
pkill cloudflared
echo "✅ All cloudflared processes stopped"