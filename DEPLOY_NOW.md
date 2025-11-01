# Deploy to Vercel - Right Now!

## ✅ Pre-Deployment Checklist

Your MCP server is ready to deploy:

- ✅ API structure validated
- ✅ Authentication logic working
- ✅ CORS headers configured
- ✅ Health endpoint ready
- ✅ Error handling implemented
- ✅ 45 tools available
- ✅ Feature requirements tool tested

---

## 🚀 Deploy in 3 Commands

### Step 1: Build the Project

```bash
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp
npm run build
```

**Expected output:**
```
> @azure-devops/mcp-workitems@3.0.0 build
> tsc && shx chmod +x dist/*.js
```

### Step 2: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Step 3: Deploy to Production

```bash
vercel --prod
```

**Follow the prompts:**
1. "Set up and deploy?" → **Yes**
2. "Which scope?" → Choose your account
3. "Link to existing project?" → **No** (first time)
4. "What's your project's name?" → `azure-devops-mcp` (or your choice)
5. "In which directory is your code located?" → `./` (press Enter)
6. Wait for deployment... (~30 seconds)

**You'll get a URL like:**
```
✅  Production: https://azure-devops-mcp.vercel.app
```

---

## ✅ Test Your Deployment

Copy your deployment URL and test immediately:

### Test 1: Health Check

```bash
curl https://azure-devops-mcp.vercel.app/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "Azure DevOps MCP Server",
  "version": "3.0.0"
}
```

### Test 2: Authentication Check

```bash
curl -X POST https://azure-devops-mcp.vercel.app/mcp
```

**Expected:**
```json
{
  "error": "Missing X-ADO-PAT or X-ADO-ORG header"
}
```

### Test 3: With Your Credentials

```bash
curl -X POST https://azure-devops-mcp.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT_TOKEN" \
  -H "X-ADO-ORG: GenerativeAILab" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "core_list_projects",
      "arguments": {}
    }
  }'
```

**Replace** `YOUR_PAT_TOKEN` with your actual PAT.

---

## 📋 Share with Your Team

Once deployed, share these with your 100-person consultancy:

### 1. The Deployment URL
```
https://azure-devops-mcp.vercel.app
```

### 2. Setup Instructions
Share **TEAM_SETUP.md** with your team.

### 3. Quick Config for Team Members

Each person adds to their Claude Desktop config:

```json
{
  "mcpServers": {
    "azure-devops": {
      "url": "https://azure-devops-mcp.vercel.app/mcp",
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

## 🔍 Monitor Your Deployment

### View Logs

```bash
vercel logs --follow
```

### Check Deployment Status

```bash
vercel ls
```

### View Deployment Details

```bash
vercel inspect
```

---

## 📊 Expected Performance

- **Cold start**: 1-2 seconds (first request)
- **Warm requests**: 200-500ms
- **Health check**: <100ms
- **Concurrent users**: 100+ (Vercel handles this)
- **Monthly cost**: $20-50 for 100 users

---

## ⚙️ Vercel Configuration Summary

Your deployment includes:

- **Runtime**: Node.js 20 (automatic)
- **Memory**: 1024 MB per function
- **Timeout**: 60 seconds per request
- **HTTPS**: Automatic (Let's Encrypt)
- **CDN**: Global edge network
- **Scaling**: Automatic

---

## 🎯 Next Steps After Deployment

1. **Test all endpoints** with the curl commands above
2. **Share TEAM_SETUP.md** with your team
3. **Create a team Slack/Teams channel** for support
4. **Set up PAT rotation reminders** (90 days)
5. **Monitor usage** with `vercel logs`
6. **Gather feedback** from early adopters
7. **Plan AWS migration** when ready for enterprise

---

## 🔒 Security Reminders

Before sharing with your team:

1. ✅ Test with your own PAT first
2. ✅ Verify authentication is working
3. ✅ Check logs for any errors
4. ✅ Document the deployment URL securely
5. ✅ Remind team: PATs should have 90-day expiration
6. ✅ Remind team: Never commit PATs to git

---

## 🆘 Troubleshooting

### "Command not found: vercel"

```bash
npm install -g vercel
```

### "Build failed"

```bash
npm run clean
npm install
npm run build
```

### "Deployment failed"

```bash
vercel --debug
```

### "Can't connect after deployment"

- Wait 30 seconds for DNS propagation
- Try the `.app` URL instead of custom domain
- Check `vercel logs` for errors

---

## 📚 Documentation Created

You have complete documentation:

- ✅ **DEPLOYMENT_GUIDE.md** - Full deployment guide
- ✅ **TEAM_SETUP.md** - 5-minute setup for team members
- ✅ **CURL_TESTING_GUIDE.md** - Comprehensive curl tests
- ✅ **QUICK_CURL_TESTS.md** - Copy-paste curl commands
- ✅ **DEPLOY_NOW.md** - This file
- ✅ **README.md** - Complete tool documentation
- ✅ **FEATURE_REQUIREMENTS_TOOL.md** - New tool docs

---

## 🎉 You're Ready!

Run these 3 commands and you're live:

```bash
npm run build
npm install -g vercel  # if needed
vercel --prod
```

Then test and share with your team!

---

**Questions?** Check the troubleshooting sections in:
- DEPLOYMENT_GUIDE.md
- TEAM_SETUP.md
- CURL_TESTING_GUIDE.md

