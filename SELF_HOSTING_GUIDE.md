# 🏠 Self-Hosting Guide

Complete guide to running Current Stack locally with Docker/OrbStack and testing with Insomnia.

## 🚀 Quick Start

### Prerequisites

- **OrbStack** (recommended) or Docker Desktop
- **Insomnia** (optional, for API testing)

### One-Command Setup

```bash
# Clone and start
git clone <your-repo-url>
cd current
./start-local.sh
```

That's it! Your stack will be running at:

- **Web App**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📋 Detailed Setup

### 1. Install Dependencies

#### OrbStack (Recommended)

```bash
# Install via Homebrew
brew install orbstack

# Or download from https://orbstack.dev
```

#### Docker Desktop (Alternative)

```bash
# Install via Homebrew
brew install --cask docker

# Or download from https://docker.com
```

#### Insomnia (API Testing)

```bash
# Install via Homebrew
brew install --cask insomnia

# Or download from https://insomnia.rest
```

### 2. Start Services

#### Option A: Using Startup Script (Recommended)

```bash
./start-local.sh
```

#### Option B: Manual Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Import API Collection to Insomnia

1. Open Insomnia
2. Click **Create** → **Import From** → **File**
3. Select `insomnia-collection.json`
4. You'll get a "Current Stack API" workspace with:
   - Health Check
   - Get All Stacks
   - Search Stacks
   - API Documentation link

## 🔧 Development Workflow

### Making Changes

#### Backend Changes (FastAPI)

```bash
# API auto-reloads on file changes
# Just edit files in app/ directory
```

#### Frontend Changes (Next.js)

```bash
# Web auto-reloads on file changes
# Just edit files in web/ directory
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Just API
docker-compose logs -f api

# Just Web
docker-compose logs -f web
```

### Rebuilding After Changes

```bash
# Rebuild specific service
docker-compose up --build api

# Rebuild everything
docker-compose up --build
```

## 📊 Service Details

### API Service (Port 8000)

- **Framework**: FastAPI
- **Database**: JSON file storage
- **Data Location**: `./app/data/`
- **Health Check**: `/ready`
- **Documentation**: `/docs`

### Web Service (Port 3000)

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **API Connection**: http://localhost:8000

## 🛠 Troubleshooting

### Services Won't Start

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :8000

# Kill processes if needed
kill -9 <PID>

# Restart services
docker-compose down && docker-compose up --build
```

### API Not Responding

```bash
# Check API logs
docker-compose logs api

# Restart just the API
docker-compose restart api
```

### Web App Can't Connect to API

```bash
# Verify API is running
curl http://localhost:8000/ready

# Check web service logs
docker-compose logs web
```

### Data Issues

```bash
# Reset data (will lose all crawled data)
rm -rf ./app/data/*
docker-compose restart api

# Or crawl fresh data
docker-compose exec api python cli.py update-stacks
```

## 🔄 Data Management

### Initial Data Population

```bash
# Crawl fresh stack data
docker-compose exec api python cli.py update-stacks
```

### Backup Data

```bash
# Backup current data
cp -r ./app/data ./app/data-backup-$(date +%Y%m%d)
```

### Restore Data

```bash
# Restore from backup
cp -r ./app/data-backup-YYYYMMDD ./app/data
docker-compose restart api
```

## 🌐 Production Deployment

### Using Docker Compose on Server

```bash
# On your server
git clone <your-repo>
cd current

# Update environment for production
export NEXT_PUBLIC_API_URL=http://your-domain.com:8000

# Start with production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables

```bash
# API
PORT=8000

# Web
NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=3000
```

## 📱 API Testing with Insomnia

### Pre-configured Requests

1. **Health Check** - Verify API is running
2. **Get All Stacks** - Retrieve complete stack list
3. **Search Stacks** - Test search functionality with query parameter
4. **API Documentation** - Direct link to interactive docs

### Custom Requests

Base URL: `http://localhost:8000`

Common endpoints:

- `GET /stacks` - All stacks
- `GET /stacks/search?q=react` - Search
- `GET /ready` - Health check
- `GET /docs` - API documentation

## 🎯 Next Steps

1. **Customize the stack data** by editing crawling logic in `app/crawler.py`
2. **Add new endpoints** in `app/main.py`
3. **Modify the UI** in `web/` directory
4. **Set up monitoring** with health checks
5. **Deploy to production** using the same Docker setup

## 💡 Tips

- **OrbStack is faster** than Docker Desktop for local development
- **Use Insomnia environments** to switch between local/production APIs
- **Data persists** between container restarts in `./app/data/`
- **Hot reload works** for both frontend and backend during development
- **Check logs first** when troubleshooting issues
