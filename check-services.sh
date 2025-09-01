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
