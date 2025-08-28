# 🚂 Railway Deployment Troubleshooting

## 🔍 Common Issues & Solutions

### Issue: Health Check Failing

**Symptoms:**

```
Attempt #1 failed with service unavailable. Continuing to retry for 4m59s
```

**Solutions:**

#### 1. Check Environment Variables

Ensure these are set in Railway:

```env
PORT=$PORT  # Railway sets this automatically
PYTHONPATH=/app
```

#### 2. Verify Health Endpoint

Test locally first:

```bash
cd api
source venv/bin/activate
python main.py &
curl http://localhost:8000/health
```

#### 3. Check Logs

In Railway dashboard:

- Go to your service
- Click "Deployments" tab
- Click on the failing deployment
- Check "Build Logs" and "Deploy Logs"

#### 4. Increase Health Check Timeout

In `railway.json`:

```json
{
  "deploy": {
    "healthcheckTimeout": 300
  }
}
```

### Issue: Build Failures

**Symptoms:**

```
Build failed with exit code 1
```

**Solutions:**

#### 1. Check Python Version

Add `runtime.txt`:

```
python-3.11.0
```

#### 2. Fix Requirements

Ensure `requirements.txt` has all dependencies:

```bash
cd api
source venv/bin/activate
pip freeze > requirements.txt
```

#### 3. Add Nixpacks Config

Create `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ['python311', 'pip']

[phases.install]
cmds = ['pip install -r requirements.txt']

[start]
cmd = 'uvicorn main:app --host 0.0.0.0 --port $PORT'
```

### Issue: Import Errors

**Symptoms:**

```
ModuleNotFoundError: No module named 'models'
```

**Solutions:**

#### 1. Set PYTHONPATH

```env
PYTHONPATH=/app
```

#### 2. Check File Structure

Ensure all Python files are in the same directory:

```
api/
├── main.py
├── models.py
├── storage.py
├── crawler.py
└── scheduler.py
```

### Issue: Port Binding Errors

**Symptoms:**

```
[Errno 98] Address already in use
```

**Solutions:**

#### 1. Use Railway's PORT Variable

```python
import os
port = int(os.environ.get("PORT", 8000))
uvicorn.run(app, host="0.0.0.0", port=port)
```

#### 2. Update Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🛠️ Debugging Steps

### 1. Test Locally First

```bash
cd api
python test_api.py
```

### 2. Check Railway Logs

```bash
railway logs --service current-api
```

### 3. Connect to Railway Shell

```bash
railway shell
```

### 4. Manual Health Check

```bash
curl -v https://your-service.railway.app/health
```

## 🚀 Quick Fix Deployment

If you're still having issues, try this minimal configuration:

### 1. Simplify `railway.json`

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
  }
}
```

### 2. Minimal `requirements.txt`

```
fastapi>=0.110.0
uvicorn>=0.27.0
requests>=2.31.0
pydantic>=2.6.0
python-dateutil>=2.8.2
```

### 3. Simple Health Check

```python
@app.get("/health")
async def health():
    return {"status": "ok"}
```

### 4. Redeploy

```bash
railway up --service current-api
```

## 📞 Getting Help

1. **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
2. **Railway Docs**: [docs.railway.app](https://docs.railway.app)
3. **Check Status**: [status.railway.app](https://status.railway.app)

## 🎯 Working Configuration

Here's a proven working setup:

**File: `api/railway.json`**

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "./start.sh",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

**File: `api/start.sh`**

```bash
#!/bin/bash
set -e
mkdir -p /app/data
export PORT=${PORT:-8000}
exec uvicorn main:app --host 0.0.0.0 --port $PORT --log-level info
```

**File: `api/requirements.txt`**

```
fastapi>=0.110.0
uvicorn>=0.27.0
requests>=2.31.0
schedule>=1.2.0
pydantic>=2.6.0
python-dateutil>=2.8.2
fuzzywuzzy>=0.18.0
```

This configuration should work for most Railway deployments!
