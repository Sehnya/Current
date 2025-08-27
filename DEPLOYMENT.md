# 🚀 Railway Deployment Guide

This guide will help you deploy Current to Railway with both the API and frontend.

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

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Current Issues**: Create an issue in your GitHub repository
