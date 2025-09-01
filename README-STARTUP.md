# Current Stack - Permanent Startup Guide

## Quick Start (Recommended)

1. **Start Docker and Services:**

   ```bash
   ./start-with-docker.sh
   ```

   This will automatically start Docker Desktop and your services.

2. **If Docker Desktop needs manual start:**
   - Open Docker Desktop from Applications or Spotlight
   - Wait for Docker to fully start (whale icon in menu bar)
   - Then run: `./start-permanent.sh`

## Your Services Will Be Available At:

- 🌐 **Production**: https://current.seh-nya.com
- 🏠 **Local**: http://localhost
- 🔌 **API**: https://current.seh-nya.com/api
- 📚 **API Docs**: https://current.seh-nya.com/api/docs

## Key Features:

✅ **Runs permanently** - survives terminal/IDE closure
✅ **Auto-restart** - recovers from crashes
✅ **Cloudflare tunnel** - accessible from internet
✅ **Docker restart policy** - starts with Docker

## Management Commands:

```bash
# Check status anytime
./check-services.sh

# View live logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart services
docker-compose restart

# Full restart with rebuild
docker-compose up -d --build
```

## Troubleshooting:

**If services don't start:**

1. Make sure Docker Desktop is running
2. Check logs: `docker-compose logs`
3. Try rebuilding: `docker-compose up -d --build`

**If tunnel doesn't work:**

1. Check Cloudflare credentials: `ls ~/.cloudflared/`
2. Test tunnel manually: `cloudflared tunnel --config cloudflare-tunnel.yml run`

**If you need to install as system service:**

```bash
./install-service.sh    # Install permanent system service
./uninstall-service.sh  # Remove system service
```
