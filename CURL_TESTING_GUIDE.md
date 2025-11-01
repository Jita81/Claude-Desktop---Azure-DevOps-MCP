# Curl Testing Guide - Azure DevOps MCP Server

## Testing the Vercel Deployment

### 1. Health Check

Test that the server is running:

```bash
curl https://your-deployment.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Azure DevOps MCP Server",
  "version": "3.0.0",
  "timestamp": "2025-11-01T14:30:00.000Z",
  "environment": "production"
}
```

### 2. MCP Endpoint (Basic Connection)

Test the MCP endpoint without authentication:

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "error": "Missing X-ADO-PAT or X-ADO-ORG header",
  "message": "Please provide X-ADO-PAT and X-ADO-ORG headers in your MCP client configuration"
}
```

### 3. MCP Endpoint (With Authentication)

Test with your actual PAT and organization:

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT_TOKEN" \
  -H "X-ADO-ORG: YOUR_ORG_NAME" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

**Expected Response:**
Server-Sent Events (SSE) stream with MCP tool list.

### 4. Test Specific Tool Call

Test calling the `core_list_projects` tool:

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT_TOKEN" \
  -H "X-ADO-ORG: YOUR_ORG_NAME" \
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

### 5. Test Feature Requirements Tool

Test the new feature requirements tool:

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: YOUR_PAT_TOKEN" \
  -H "X-ADO-ORG: YOUR_ORG_NAME" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "wit_feature_requirements",
      "arguments": {
        "project": "ADOTest",
        "featureId": 357
      }
    }
  }'
```

---

## Testing Locally (Before Vercel Deployment)

### Setup Local Test Environment

1. **Start Local MCP Server**

```bash
# Terminal 1: Start the MCP server
cd /Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp
export ADO_PAT="YOUR_PAT_TOKEN"
node dist/index.js YOUR_ORG_NAME --authentication pat
```

2. **Test with Direct Node API**

Create a test script to simulate the Vercel wrapper:

```bash
# Terminal 2: Test the local server
node test-local-api.js
```

---

## Common Test Scenarios

### Test 1: Invalid Organization Name

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "X-ADO-PAT: test" \
  -H "X-ADO-ORG: invalid@org#name"
```

**Expected:** Error about invalid organization name

### Test 2: Missing PAT

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "X-ADO-ORG: MyOrg"
```

**Expected:** 401 Unauthorized with missing header error

### Test 3: Expired PAT

```bash
curl -X POST https://your-deployment.vercel.app/mcp \
  -H "X-ADO-PAT: expired_token" \
  -H "X-ADO-ORG: MyOrg"
```

**Expected:** Authentication error from Azure DevOps API

### Test 4: CORS Preflight

```bash
curl -X OPTIONS https://your-deployment.vercel.app/mcp \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-ADO-PAT"
```

**Expected:** 200 OK with CORS headers

---

## Debugging Tips

### View Response Headers

```bash
curl -i https://your-deployment.vercel.app/health
```

### Follow SSE Stream

```bash
curl -N https://your-deployment.vercel.app/mcp \
  -H "X-ADO-PAT: YOUR_PAT" \
  -H "X-ADO-ORG: YOUR_ORG"
```

### Test with Verbose Output

```bash
curl -v https://your-deployment.vercel.app/health
```

### Save Response to File

```bash
curl https://your-deployment.vercel.app/mcp \
  -H "X-ADO-PAT: YOUR_PAT" \
  -H "X-ADO-ORG: YOUR_ORG" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  > response.json
```

---

## Quick Test Script

Save this as `test-deployment.sh`:

```bash
#!/bin/bash

DEPLOYMENT_URL="https://your-deployment.vercel.app"
PAT="YOUR_PAT_TOKEN"
ORG="YOUR_ORG_NAME"

echo "Testing Azure DevOps MCP Server Deployment"
echo "==========================================="
echo ""

echo "Test 1: Health Check"
curl -s "$DEPLOYMENT_URL/health" | jq .
echo ""

echo "Test 2: Missing Authentication"
curl -s -X POST "$DEPLOYMENT_URL/mcp" | jq .
echo ""

echo "Test 3: Invalid Org Name"
curl -s -X POST "$DEPLOYMENT_URL/mcp" \
  -H "X-ADO-PAT: test" \
  -H "X-ADO-ORG: invalid@org" | jq .
echo ""

echo "Test 4: List Tools (with auth)"
curl -s -X POST "$DEPLOYMENT_URL/mcp" \
  -H "X-ADO-PAT: $PAT" \
  -H "X-ADO-ORG: $ORG" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  | head -20
echo ""

echo "All tests complete!"
```

Make it executable and run:
```bash
chmod +x test-deployment.sh
./test-deployment.sh
```

---

## Expected Responses Reference

### Healthy Server
```json
{
  "status": "healthy",
  "service": "Azure DevOps MCP Server",
  "version": "3.0.0"
}
```

### Missing Authentication
```json
{
  "error": "Missing X-ADO-PAT or X-ADO-ORG header"
}
```

### Invalid Organization
```json
{
  "error": "Invalid organization name",
  "message": "Organization name can only contain letters, numbers, hyphens, and underscores"
}
```

### Successful Tool List
```
data: {"jsonrpc":"2.0","id":1,"result":{"tools":[...]}}
```

---

## Performance Testing

### Measure Response Time

```bash
curl -w "\nTime: %{time_total}s\n" \
  https://your-deployment.vercel.app/health
```

### Load Test (Simple)

```bash
for i in {1..10}; do
  curl -s https://your-deployment.vercel.app/health &
done
wait
```

---

## Troubleshooting

### "Connection refused"
- Check Vercel deployment is active
- Verify URL is correct

### "Timeout"
- Vercel cold start can take 1-2 seconds
- Try again or increase timeout: `curl --max-time 30`

### "Invalid JSON"
- Check your JSON syntax with `jq`
- Ensure proper escaping of quotes

### "SSE stream closed"
- Normal for short-lived requests
- Use `-N` flag to keep connection open

