# Deploy to Railway - Quick Guide

## Why Railway?

Railway is simpler than Vercel for this use case:
- ✅ Runs Node.js servers directly (no serverless complexity)
- ✅ Easy environment variable management
- ✅ Simple deployment (one command or connect GitHub)
- ✅ Built-in monitoring and logs
- ✅ Free tier available

---

## 🚀 Deploy Now (2 Options)

### Option 1: Railway CLI (Fastest)

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login to Railway

```bash
railway login
```

This will open your browser for authentication.

#### Step 3: Initialize and Deploy

```bash
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp

# Initialize Railway project
railway init

# Deploy
railway up
```

#### Step 4: Get Your URL

```bash
# Generate a public URL
railway domain

# This gives you a URL like: azure-devops-mcp-production.up.railway.app
```

---

### Option 2: GitHub Integration (Recommended for Teams)

#### Step 1: Push to GitHub

```bash
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp

# If not already a git repo
git init
git add .
git commit -m "Azure DevOps MCP Server for Railway"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/azure-devops-mcp.git
git push -u origin main
```

#### Step 2: Deploy on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys
6. Click "Settings" → "Generate Domain"

---

## ✅ Test Your Deployment

Once deployed, you'll get a URL like: `https://azure-devops-mcp-production.up.railway.app`

### Test 1: Health Check

```bash
curl https://azure-devops-mcp-production.up.railway.app/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "Azure DevOps MCP Server",
  "version": "3.0.0"
}
```

### Test 2: Authentication

```bash
curl -X POST https://azure-devops-mcp-production.up.railway.app/mcp
```

**Expected:**
```json
{
  "error": "Missing X-ADO-PAT or X-ADO-ORG header"
}
```

### Test 3: Real Request

```bash
curl -X POST https://azure-devops-mcp-production.up.railway.app/mcp \
  -H "X-ADO-PAT: YOUR_PAT" \
  -H "X-ADO-ORG: GenerativeAILab" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"core_list_projects","arguments":{}}}'
```

---

## 📊 Monitor Your Deployment

### View Logs

```bash
railway logs
```

Or in the Railway dashboard: Your Project → Deployments → View Logs

### Check Status

```bash
railway status
```

### View Metrics

Go to Railway dashboard → Your Project → Metrics

---

## 🔧 Local Testing (Before Deployment)

Test the Railway server locally:

```bash
# Build first
npm run build

# Start the server
PORT=3000 node server.js

# In another terminal, test it
curl http://localhost:3000/health
```

---

## 👥 Team Configuration

Share this with your team:

**Railway URL**: `https://your-app.up.railway.app`

**Claude Desktop Config**:
```json
{
  "mcpServers": {
    "azure-devops": {
      "url": "https://your-app.up.railway.app/mcp",
      "transport": "sse",
      "headers": {
        "X-ADO-PAT": "their-personal-pat",
        "X-ADO-ORG": "their-org-name"
      }
    }
  }
}
```

---

## 💰 Pricing

**Railway Pricing**:
- **Hobby Plan**: $5/month (500 hours)
- **Pro Plan**: $20/month (unlimited)
- **For 100 users**: Hobby plan is likely sufficient

**Estimated Cost**: $5-20/month

---

## 🔍 Troubleshooting

### "railway: command not found"

```bash
npm install -g @railway/cli
```

### "Build failed"

Check Railway logs:
```bash
railway logs
```

Common fixes:
- Ensure `package.json` has correct `type: "module"`
- Ensure `server.js` exists
- Check Node.js version (Railway uses 18+ by default)

### "Cannot connect to server"

1. Check deployment status: `railway status`
2. Verify domain is generated: `railway domain`
3. Check logs: `railway logs`

---

## 🎯 Advantages Over Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Setup** | Simple | Complex (serverless) |
| **Long-running** | ✅ Native | ⚠️ Limited |
| **WebSocket/SSE** | ✅ Full support | ⚠️ Limited |
| **Logs** | ✅ Real-time | ✅ Real-time |
| **Cost** | $5-20/month | $20-50/month |
| **Deploy time** | ~2 min | ~1 min |

---

## 📋 Files Created for Railway

- `server.js` - HTTP server wrapper for MCP
- `railway.json` - Railway configuration
- `RAILWAY_DEPLOY.md` - This guide

---

## 🚀 Quick Deploy Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Build project
npm run build

# Deploy
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp
railway init
railway up

# Get your URL
railway domain
```

Then test with:
```bash
curl https://your-app.up.railway.app/health
```

---

## 🎉 You're Done!

Railway deployment is much simpler:
1. One command to deploy
2. Native Node.js support
3. Easy monitoring
4. Works perfectly for MCP servers

Share TEAM_SETUP.md with your team using your Railway URL!

