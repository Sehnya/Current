# Railway Deployment Guide

This guide walks you through deploying the Current app to Railway using a monorepo setup.

## 🚀 Quick Deploy

1. **Connect to Railway**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and create project
   railway login
   railway init
   ```

2. **Deploy from root**
   ```bash
   railway up
   ```

Railway will automatically detect the `railway.toml` configuration and deploy both services.

## 📁 Project Structure

```
current/
├── railway.toml          # Monorepo configuration
├── api/                  # FastAPI backend
│   ├── Dockerfile       # Container config
│   ├── Procfile         # Fallback start command
│   └── requirements.txt # Python dependencies
├── web/                  # Next.js frontend
│   ├── Dockerfile       # Container config
│   └── package.json     # Node.js dependencies
└── docker-compose.yml   # Local development
```

## ⚙️ Environment Variables

### API Service

```bash
FRONTEND_ORIGIN=https://current.vercel.app  # or your domain
DATA_PATH=/data/stacks.json
HISTORY_PATH=/data/history.json
GITHUB_TOKEN=<optional for higher rate limits>
```

### Web Service

```bash
NEXT_PUBLIC_API_URL=https://<api-subdomain>.up.railway.app
```

## 🔧 Railway Configuration

The `railway.toml` file configures two services:

- **API**: FastAPI backend running on Python
- **Web**: Next.js frontend with build step

## 📊 Health Checks

- **API**: `/health` endpoint with 60s timeout
- **Web**: `/` endpoint (default Next.js)

## 🗄️ Data Storage

For persistent data, add a Railway Volume:

1. Go to API service → Settings → Volumes
2. Mount `/data`
3. Set environment variables:
   - `DATA_PATH=/data/stacks.json`
   - `HISTORY_PATH=/data/history.json`

## 🔍 Troubleshooting

### Common Issues

1. **API fails to start**
   - Check logs for missing dependencies
   - Verify `requirements.txt` includes all packages
   - Ensure `PYTHONPATH` is set correctly

2. **Web shows blank page**
   - Verify `NEXT_PUBLIC_API_URL` is set
   - Check browser console for CORS errors
   - Ensure API service is running

3. **CORS errors**
   - Set `FRONTEND_ORIGIN` environment variable
   - Check API logs for CORS middleware setup

### Verification Steps

1. **API Service Logs**: Look for "Uvicorn running on..."
2. **Web Service Logs**: Look for "Ready on..."
3. **Browser DevTools**: Check Network tab for API calls

## 🚀 Local Development

```bash
# Start both services
docker-compose up

# Or manually:
# Terminal 1 - API
cd api
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Web
cd web
npm install
npm run dev
```

Access:

- Web: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📈 Production Optimizations

1. **Tighten CORS**: Remove `"*"` from allowed origins
2. **Add caching**: Implement Redis for API responses
3. **Database**: Migrate from JSON to PostgreSQL
4. **Monitoring**: Add health check endpoints
5. **CDN**: Use Railway's edge caching

## 🔄 CI/CD

GitHub Actions automatically:

- Runs syntax checks on Python files
- Builds Next.js application
- Validates both services before deployment

## 📝 Next Steps

1. Deploy to Railway
2. Set environment variables
3. Test both services
4. Configure custom domain (optional)
5. Set up monitoring and alerts
