# 🚀 Deployment Guide

This guide covers multiple deployment options for Current, with the API and frontend as separate services.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your Current code to GitHub
3. **Railway CLI** (optional): `npm install -g @railway/cli`

## 🎯 Deployment Strategy

We'll deploy Current as **two separate services** on Railway:

1. **API Service** (`api/` folder) - FastAPI backend
2. **Web Service** (`web/` folder) - Next.js frontend

## 🔧 Step 1: Deploy the API Service

### Via Railway Dashboard

1. **Create New Project**
   - Go to [railway.app/new](https://railway.app/new)
   - Select "Deploy from GitHub repo"
   - Choose your Current repository

2. **Configure API Service**
   - **Service Name**: `current-api`
   - **Root Directory**: `api`
   - **Build Command**: Auto-detected (nixpacks will handle this)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**

   ```
   PORT=8000
   PYTHONPATH=/app
   RAILWAY_ENVIRONMENT=production
   ```

4. **Optional: Add GitHub Token** (for higher API rate limits)
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

### Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new

# Deploy API service
cd api
railway up
```

## 🌐 Step 2: Deploy the Web Service

### Via Railway Dashboard

1. **Add New Service** to your existing project
   - Click "New Service" in your project
   - Select "GitHub Repo"
   - Choose the same repository

2. **Configure Web Service**
   - **Service Name**: `current-web`
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**

   ```
   PORT=3000
   NEXT_PUBLIC_API_URL=https://your-api-service.railway.app
   ```

   > **Important**: Replace `your-api-service.railway.app` with your actual API service URL from step 1

### Via Railway CLI

```bash
# In your web directory
cd web
railway service create current-web
railway up
```

## ⚙️ Step 3: Configure Service Communication

1. **Get API Service URL**
   - Go to your API service in Railway dashboard
   - Copy the public URL (e.g., `https://current-api-production.railway.app`)

2. **Update Web Service Environment**
   - Go to your Web service settings
   - Update `NEXT_PUBLIC_API_URL` with your API service URL
   - Redeploy the web service

## 🔄 Step 4: Initial Data Setup

The API service will automatically run the initial stack crawl on first deployment. If you need to manually trigger it:

1. **Via Railway Dashboard**
   - Go to your API service
   - Open the "Deployments" tab
   - Click on the latest deployment
   - Use the terminal to run: `python cli.py update-stacks`

2. **Via Railway CLI**
   ```bash
   railway run python cli.py update-stacks
   ```

## 🎨 Step 5: Custom Domain (Optional)

### For the Web Service

1. Go to your Web service settings
2. Click "Networking" → "Custom Domain"
3. Add your domain (e.g., `current.yourdomain.com`)
4. Update DNS records as instructed

### For the API Service

1. Go to your API service settings
2. Add custom domain (e.g., `api.yourdomain.com`)
3. Update the Web service `NEXT_PUBLIC_API_URL` to use your custom API domain

## 📊 Monitoring & Logs

### View Logs

```bash
# API service logs
railway logs --service current-api

# Web service logs
railway logs --service current-web
```

### Health Checks

- **API Health**: `https://your-api-url.railway.app/health`
- **Web Health**: `https://your-web-url.railway.app/`

## 🔧 Environment Variables Reference

### API Service (`current-api`)

```env
PORT=8000
PYTHONPATH=/app
RAILWAY_ENVIRONMENT=production
GITHUB_TOKEN=optional_github_token
```

### Web Service (`current-web`)

```env
PORT=3000
NEXT_PUBLIC_API_URL=https://your-api-service.railway.app
NEXT_PUBLIC_GA_ID=optional_google_analytics_id
```

## 🚨 Troubleshooting

### Common Issues

1. **API Service Won't Start**
   - Check that `PORT` environment variable is set
   - Verify `requirements.txt` includes all dependencies
   - Check logs for Python import errors

2. **Web Service Can't Connect to API**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check API service is running and accessible
   - Ensure CORS is properly configured in API

3. **Build Failures**
   - Check `nixpacks.toml` configuration
   - Verify all dependencies are listed
   - Check for syntax errors in code

### Debug Commands

```bash
# Check service status
railway status

# View environment variables
railway variables

# Connect to service shell
railway shell

# View recent deployments
railway deployments
```

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your connected GitHub branch:

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Update Current"
   git push origin main
   ```

2. **Railway Auto-deploys**
   - Both services will automatically rebuild and deploy
   - Monitor progress in Railway dashboard

## 💰 Cost Optimization

### Railway Pricing Tips

- **Starter Plan**: $5/month per service (2 services = $10/month)
- **Pro Plan**: Usage-based pricing
- **Sleep Mode**: Services sleep after 30 minutes of inactivity (Starter plan)

### Optimization Strategies

1. **Combine Services**: Consider deploying as a single service with both API and web
2. **Caching**: Implement Redis for API response caching
3. **CDN**: Use Railway's built-in CDN for static assets

## 🎉 Success!

Once deployed, you'll have:

- **API**: `https://your-api-service.railway.app`
- **Web**: `https://your-web-service.railway.app`
- **Docs**: `https://your-api-service.railway.app/docs`

Your Current deployment is now live and automatically updating with the latest stack data! 🌊

---

# 🌐 Alternative Deployment Options

## 🐳 Docker Deployment

### Option 1: Separate Containers

Create production docker-compose:

```yaml
# docker-compose.prod.yml
version: "3.9"

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.prod
    ports:
      - "8000:8000"
    environment:
      - PYTHONPATH=/app
      - PORT=8000
    volumes:
      - api_data:/app/data
    restart: unless-stopped

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api
    restart: unless-stopped

volumes:
  api_data:
```

Create API production Dockerfile:

```dockerfile
# api/Dockerfile.prod
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml current
```

## ☁️ Cloud Platform Deployments

### 🚀 Vercel (Web) + Railway/Render (API)

**API on Railway/Render:**

- Deploy API using Railway guide above
- Or use Render.com with similar configuration

**Web on Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web directory
cd web
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
```

### 🌊 DigitalOcean App Platform

Create `app.yaml`:

```yaml
name: current-app
services:
  - name: api
    source_dir: /api
    github:
      repo: your-username/current
      branch: main
    run_command: uvicorn main:app --host 0.0.0.0 --port $PORT
    environment_slug: python
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: PORT
        value: "8000"
      - key: PYTHONPATH
        value: "/app"
    health_check:
      http_path: /health

  - name: web
    source_dir: /web
    github:
      repo: your-username/current
      branch: main
    run_command: npm start
    build_command: npm run build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NEXT_PUBLIC_API_URL
        value: ${api.PUBLIC_URL}
```

Deploy:

```bash
doctl apps create --spec app.yaml
```

### 🔥 Google Cloud Run

**Deploy API:**

```bash
# Build and push to Container Registry
cd api
gcloud builds submit --tag gcr.io/PROJECT-ID/current-api

# Deploy to Cloud Run
gcloud run deploy current-api \
  --image gcr.io/PROJECT-ID/current-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000 \
  --set-env-vars PORT=8000,PYTHONPATH=/app
```

**Deploy Web:**

```bash
cd web
gcloud builds submit --tag gcr.io/PROJECT-ID/current-web

gcloud run deploy current-web \
  --image gcr.io/PROJECT-ID/current-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://current-api-xxx.run.app
```

### ⚡ AWS (ECS + ALB)

**API Service:**

```yaml
# api-task-definition.json
{
  "family": "current-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions":
    [
      {
        "name": "current-api",
        "image": "your-account.dkr.ecr.region.amazonaws.com/current-api:latest",
        "portMappings": [{ "containerPort": 8000, "protocol": "tcp" }],
        "environment":
          [
            { "name": "PORT", "value": "8000" },
            { "name": "PYTHONPATH", "value": "/app" },
          ],
        "healthCheck":
          {
            "command":
              ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
            "interval": 30,
            "timeout": 5,
            "retries": 3,
          },
      },
    ],
}
```

Deploy:

```bash
# Create ECR repositories
aws ecr create-repository --repository-name current-api
aws ecr create-repository --repository-name current-web

# Build and push images
docker build -t current-api ./api
docker tag current-api:latest ACCOUNT.dkr.ecr.REGION.amazonaws.com/current-api:latest
docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/current-api:latest

# Create ECS service
aws ecs create-service \
  --cluster current-cluster \
  --service-name current-api \
  --task-definition current-api \
  --desired-count 1 \
  --launch-type FARGATE
```

## 🏠 Self-Hosted Options

### 🐧 Linux VPS (Ubuntu/Debian)

**Setup Script:**

```bash
#!/bin/bash
# deploy.sh

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip python3-venv nginx nodejs npm

# Clone repository
git clone https://github.com/your-username/current.git
cd current

# Setup API
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service for API
sudo tee /etc/systemd/system/current-api.service > /dev/null <<EOF
[Unit]
Description=Current API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/current/api
Environment=PATH=/home/ubuntu/current/api/venv/bin
Environment=PYTHONPATH=/home/ubuntu/current/api
ExecStart=/home/ubuntu/current/api/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Setup Web
cd ../web
npm install
npm run build

# Create systemd service for Web
sudo tee /etc/systemd/system/current-web.service > /dev/null <<EOF
[Unit]
Description=Current Web
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/current/web
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

# Configure Nginx
sudo tee /etc/nginx/sites-available/current > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/current /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Run deployment:

```bash
chmod +x deploy.sh
./deploy.sh
```

### 🏗️ Kubernetes

**API Deployment:**

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: current-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: current-api
  template:
    metadata:
      labels:
        app: current-api
    spec:
      containers:
        - name: current-api
          image: current-api:latest
          ports:
            - containerPort: 8000
          env:
            - name: PORT
              value: "8000"
            - name: PYTHONPATH
              value: "/app"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: current-api-service
spec:
  selector:
    app: current-api
  ports:
    - port: 8000
      targetPort: 8000
  type: ClusterIP
```

Deploy:

```bash
kubectl apply -f k8s/
```

## 📊 Monitoring & Observability

### 🔍 Health Checks

Add to your API (`main.py`):

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "2.0.0",
        "uptime": time.time() - start_time
    }

@app.get("/metrics")
async def metrics():
    return {
        "total_stacks": len(storage.load_stacks()),
        "memory_usage": psutil.Process().memory_info().rss / 1024 / 1024,
        "cpu_percent": psutil.Process().cpu_percent()
    }
```

### 📈 Logging

Add structured logging:

```python
import logging
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    logger.info(json.dumps({
        "method": request.method,
        "url": str(request.url),
        "status_code": response.status_code,
        "process_time": process_time
    }))

    return response
```

## 🔐 Security Considerations

### 🛡️ API Security

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Add security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["yourdomain.com", "*.yourdomain.com"])
app.add_middleware(HTTPSRedirectMiddleware)

# Rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/stacks")
@limiter.limit("100/minute")
async def list_stacks(request: Request):
    # ... existing code
```

### 🔑 Environment Variables

```bash
# Production environment variables
API_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port/0
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
LOG_LEVEL=INFO
SENTRY_DSN=your-sentry-dsn
```

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **DigitalOcean Docs**: [docs.digitalocean.com](https://docs.digitalocean.com)
- **Current Issues**: Create an issue in your GitHub repository
