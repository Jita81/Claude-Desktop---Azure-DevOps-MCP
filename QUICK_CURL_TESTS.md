# Quick Curl Tests - Copy & Paste Ready

## After Deploying to Vercel

Once you deploy with `vercel --prod`, you'll get a URL. Use these curl commands to test it.

**Replace** `YOUR_DEPLOYMENT_URL` with your actual Vercel URL.

---

## Test 1: Health Check (No Authentication)

```bash
curl https://YOUR_DEPLOYMENT_URL.vercel.app/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "Azure DevOps MCP Server",
  "version": "3.0.0"
}
```

---

## Test 2: Missing Authentication (Should Fail)

```bash
curl -X POST https://YOUR_DEPLOYMENT_URL.vercel.app/mcp
```

**Expected:**
```json
{
  "error": "Missing X-ADO-PAT or X-ADO-ORG header"
}
```

---

## Test 3: Invalid Org Name (Should Fail)

```bash
curl -X POST https://YOUR_DEPLOYMENT_URL.vercel.app/mcp \
  -H "X-ADO-PAT: test" \
  -H "X-ADO-ORG: invalid@org"
```

**Expected:**
```json
{
  "error": "Invalid organization name"
}
```

---

## Test 4: With Your Real Credentials

**Replace** `YOUR_PAT` and `YOUR_ORG` with your actual values.

```bash
curl -X POST https://YOUR_DEPLOYMENT_URL.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT" \
  -H "X-ADO-ORG: YOUR_ORG" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

**Expected:** Server-Sent Events stream with tool list

---

## Test 5: Call a Specific Tool

```bash
curl -X POST https://YOUR_DEPLOYMENT_URL.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT" \
  -H "X-ADO-ORG: YOUR_ORG" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "core_list_projects",
      "arguments": {}
    }
  }'
```

**Expected:** JSON response with your Azure DevOps projects

---

## Test 6: Feature Requirements Tool

```bash
curl -X POST https://YOUR_DEPLOYMENT_URL.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT" \
  -H "X-ADO-ORG: YOUR_ORG" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "wit_feature_requirements",
      "arguments": {
        "project": "YOUR_PROJECT_NAME",
        "featureId": 357
      }
    }
  }'
```

**Expected:** JSON with feature and user stories

---

## All-in-One Test Script

Save this as `test-my-deployment.sh`:

```bash
#!/bin/bash

# Configuration - EDIT THESE
DEPLOYMENT_URL="https://your-deployment.vercel.app"
PAT="your-pat-token"
ORG="your-org-name"

echo "Testing: $DEPLOYMENT_URL"
echo ""

echo "1. Health Check:"
curl -s "$DEPLOYMENT_URL/health" | python3 -m json.tool
echo ""

echo "2. Missing Auth:"
curl -s -X POST "$DEPLOYMENT_URL/mcp" | python3 -m json.tool
echo ""

echo "3. List Projects:"
curl -s -X POST "$DEPLOYMENT_URL/mcp" \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: $PAT" \
  -H "X-ADO-ORG: $ORG" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"core_list_projects","arguments":{}}}' \
  | head -20
echo ""

echo "Tests complete!"
```

Make it executable and run:
```bash
chmod +x test-my-deployment.sh
./test-my-deployment.sh
```

---

## Deployment Commands

### Deploy to Vercel

```bash
# 1. Build
npm run build

# 2. Deploy
vercel --prod

# 3. You'll get a URL like: https://azure-devops-mcp-abc123.vercel.app
```

### Test Immediately

```bash
# Replace with your actual URL
curl https://azure-devops-mcp-abc123.vercel.app/health
```

---

## Troubleshooting

### "Connection refused"
```bash
# Check if Vercel deployment is live
vercel ls
```

### "Timeout"
```bash
# Increase timeout
curl --max-time 30 https://your-url.vercel.app/health
```

### "Invalid JSON"
```bash
# Prettify with jq or python
curl -s https://your-url.vercel.app/health | jq .
# or
curl -s https://your-url.vercel.app/health | python3 -m json.tool
```

---

## Monitor Live Logs

```bash
# Watch logs in real-time
vercel logs --follow

# Or view recent logs
vercel logs
```

---

## Production URLs

After deploying, Vercel gives you:
- **Production URL**: `https://azure-devops-mcp.vercel.app`
- **Preview URLs**: `https://azure-devops-mcp-git-branch.vercel.app`

Use the production URL for your team!

