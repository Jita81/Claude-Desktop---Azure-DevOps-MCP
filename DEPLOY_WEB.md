# Deploy to Railway via Web Interface

## ✅ Local Test Passed!

Your server is ready to deploy. It successfully ran locally and responded to health checks.

---

## 🚀 Deploy via Railway Web (No CLI Needed)

### Step 1: Prepare GitHub Repository

```bash
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp

# Initialize git if not already done
git init
git add .
git commit -m "Azure DevOps MCP Server ready for Railway"

# Push to your GitHub
# Option A: Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/azure-devops-mcp.git
git branch -M main
git push -u origin main

# Option B: If already connected, just push:
git push
```

### Step 2: Deploy on Railway

1. **Go to Railway**: https://railway.app
2. **Click "Start a New Project"**
3. **Click "Deploy from GitHub repo"**
   - Authorize Railway to access your GitHub (first time only)
4. **Select your repository**: `azure-devops-mcp`
5. **Railway auto-deploys!** 
   - It detects Node.js automatically
   - Runs `npm install`
   - Runs `npm run build`
   - Starts with `node server.js`

### Step 3: Generate Public URL

1. In Railway dashboard, click your project
2. Click **"Settings"** tab
3. Scroll to **"Networking"**
4. Click **"Generate Domain"**
5. You'll get a URL like: `azure-devops-mcp-production.up.railway.app`

---

## ✅ Test Your Deployment

Once Railway gives you a URL, test immediately:

### Test 1: Health Check

```bash
curl https://azure-devops-mcp-production.up.railway.app/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "Azure DevOps MCP Server",
  "version": "3.0.0",
  "timestamp": "2025-11-01T14:55:00.000Z",
  "environment": "production"
}
```

### Test 2: Authentication Test

```bash
curl -X POST https://azure-devops-mcp-production.up.railway.app/mcp
```

**Expected:**
```json
{
  "error": "Missing X-ADO-PAT or X-ADO-ORG header",
  "message": "Please provide X-ADO-PAT and X-ADO-ORG headers in your request"
}
```

### Test 3: Real MCP Request

```bash
curl -X POST https://azure-devops-mcp-production.up.railway.app/mcp \
  -H "X-ADO-PAT: YOUR_PAT_TOKEN" \
  -H "X-ADO-ORG: YOUR_ORG_NAME" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"core_list_projects","arguments":{}}}'
```

### Test 4: Feature Requirements Tool

```bash
curl -X POST https://azure-devops-mcp-production.up.railway.app/mcp \
  -H "X-ADO-PAT: YOUR_PAT_TOKEN" \
  -H "X-ADO-ORG: YOUR_ORG_NAME" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"wit_feature_requirements","arguments":{"project":"ADOTest","featureId":357}}}'
```

---

## 🎯 Alternative: Deploy from Local (Without GitHub)

If you don't want to use GitHub, use Railway CLI locally:

### Install Railway CLI

```bash
# Using Homebrew (Mac)
brew install railway

# Or using npm (if network allows)
npm install -g @railway/cli
```

### Deploy Directly

```bash
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Generate domain
railway domain
```

---

## 👥 Share with Your Team

Once deployed, share this config with your team:

**Railway URL**: `https://your-app.up.railway.app`

**Claude Desktop Config** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "azure-devops": {
      "url": "https://your-app.up.railway.app/mcp",
      "transport": "sse",
      "headers": {
        "X-ADO-PAT": "THEIR_PERSONAL_PAT",
        "X-ADO-ORG": "THEIR_ORG_NAME"
      }
    }
  }
}
```

---

## 📊 Monitor Your Deployment

### View Logs in Railway Dashboard

1. Go to Railway dashboard
2. Click your project
3. Click **"Deployments"** tab
4. Click **"View Logs"**

### Check Metrics

1. Go to your project in Railway
2. Click **"Metrics"** tab
3. See CPU, Memory, Network usage

---

## 💰 Pricing

**Railway Plans**:
- **Hobby**: $5/month (500 execution hours)
- **Pro**: $20/month (unlimited)

For 100 users with intermittent usage: **Hobby plan is sufficient**

---

## 🎉 You're Ready!

The server is tested and ready to deploy:

1. ✅ Local server works (tested successfully)
2. ✅ Health endpoint responds
3. ✅ Code built successfully
4. ✅ Ready for Railway deployment

**Next step**: Push to GitHub and deploy via Railway web interface!

---

## 🔍 Troubleshooting

### "Build Failed" on Railway

Check the build logs in Railway dashboard. Common issues:
- Missing `package.json` dependencies
- Wrong Node.js version (Railway uses 18+ by default, we need 20)

**Fix**: Add to `package.json`:
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### "Server Not Responding"

1. Check Railway logs for errors
2. Verify `server.js` is being run
3. Check the PORT environment variable is set

### "Authentication Failed"

- Verify PAT token is valid
- Check PAT has correct permissions
- Ensure organization name is correct

---

## 📋 Quick Checklist

- [x] Local server tested ✅
- [x] Build completed ✅
- [x] `server.js` created ✅
- [x] `railway.json` configured ✅
- [ ] Push to GitHub
- [ ] Deploy on Railway
- [ ] Generate domain
- [ ] Test with curl
- [ ] Share with team

---

**Ready to deploy?** Follow Step 1 and Step 2 above!

