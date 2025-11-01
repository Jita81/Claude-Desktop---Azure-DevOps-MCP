#!/bin/bash

# Test Azure DevOps MCP Server Deployment
# Usage: ./test-deployment.sh [deployment-url] [pat-token] [org-name]

DEPLOYMENT_URL="${1:-https://azure-devops-mcp.vercel.app}"
PAT="${2:-YOUR_PAT_TOKEN}"
ORG="${3:-YOUR_ORG_NAME}"

echo "================================================================================"
echo "Azure DevOps MCP Server - Deployment Test"
echo "================================================================================"
echo "Deployment URL: $DEPLOYMENT_URL"
echo "Organization: $ORG"
echo "PAT: ${PAT:0:10}...${PAT: -10}"
echo ""

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq not installed - responses won't be prettified"
    echo "   Install with: brew install jq (Mac) or apt-get install jq (Linux)"
    echo ""
    JQ_CMD="cat"
else
    JQ_CMD="jq ."
fi

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
HEALTH_RESPONSE=$(curl -s "$DEPLOYMENT_URL/health")
echo "$HEALTH_RESPONSE" | $JQ_CMD

if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi
echo ""

# Test 2: Missing Authentication
echo "Test 2: Missing Authentication"
echo "-------------------------------"
AUTH_RESPONSE=$(curl -s -X POST "$DEPLOYMENT_URL/mcp" \
  -H "Content-Type: application/json")
echo "$AUTH_RESPONSE" | $JQ_CMD

if echo "$AUTH_RESPONSE" | grep -q "Missing X-ADO-PAT"; then
    echo "✅ Authentication validation working"
else
    echo "❌ Authentication validation failed"
fi
echo ""

# Test 3: Invalid Organization Name
echo "Test 3: Invalid Organization Name"
echo "----------------------------------"
INVALID_ORG_RESPONSE=$(curl -s -X POST "$DEPLOYMENT_URL/mcp" \
  -H "Content-Type: application/json" \
  -H "X-ADO-PAT: test" \
  -H "X-ADO-ORG: invalid@org#name")
echo "$INVALID_ORG_RESPONSE" | $JQ_CMD

if echo "$INVALID_ORG_RESPONSE" | grep -q "Invalid organization"; then
    echo "✅ Organization validation working"
else
    echo "❌ Organization validation failed"
fi
echo ""

# Test 4: CORS Preflight
echo "Test 4: CORS Preflight"
echo "----------------------"
CORS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$DEPLOYMENT_URL/mcp" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST")

if [ "$CORS_STATUS" = "200" ]; then
    echo "✅ CORS preflight working (HTTP $CORS_STATUS)"
else
    echo "❌ CORS preflight failed (HTTP $CORS_STATUS)"
fi
echo ""

# Test 5: Response Time
echo "Test 5: Response Time"
echo "---------------------"
TIME_TOTAL=$(curl -s -o /dev/null -w "%{time_total}" "$DEPLOYMENT_URL/health")
echo "Response time: ${TIME_TOTAL}s"

if (( $(echo "$TIME_TOTAL < 2.0" | bc -l) )); then
    echo "✅ Response time acceptable"
else
    echo "⚠️  Response time slow (might be cold start)"
fi
echo ""

# Test 6: Actual MCP Request (if PAT provided)
if [ "$PAT" != "YOUR_PAT_TOKEN" ] && [ "$ORG" != "YOUR_ORG_NAME" ]; then
    echo "Test 6: Real MCP Request (List Projects)"
    echo "-----------------------------------------"
    
    # Create a temporary file for the request
    REQUEST_FILE=$(mktemp)
    cat > "$REQUEST_FILE" << EOF
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "core_list_projects",
    "arguments": {}
  }
}
EOF

    # Send request and capture first 1000 chars of response
    MCP_RESPONSE=$(curl -s -X POST "$DEPLOYMENT_URL/mcp" \
      -H "Content-Type: application/json" \
      -H "X-ADO-PAT: $PAT" \
      -H "X-ADO-ORG: $ORG" \
      -d @"$REQUEST_FILE" | head -c 1000)
    
    echo "Response preview:"
    echo "$MCP_RESPONSE"
    
    if echo "$MCP_RESPONSE" | grep -q "jsonrpc\|data:"; then
        echo "✅ MCP request working"
    else
        echo "❌ MCP request failed"
    fi
    
    rm "$REQUEST_FILE"
    echo ""
else
    echo "Test 6: Skipped (provide PAT and ORG to test)"
    echo "---------------------------------------------"
    echo "Usage: ./test-deployment.sh URL PAT ORG"
    echo ""
fi

# Summary
echo "================================================================================"
echo "Test Summary"
echo "================================================================================"
echo ""
echo "✅ = Test Passed"
echo "❌ = Test Failed"
echo "⚠️  = Warning"
echo ""

if [ "$PAT" = "YOUR_PAT_TOKEN" ]; then
    echo "To test with real credentials, run:"
    echo "  ./test-deployment.sh $DEPLOYMENT_URL YOUR_PAT YOUR_ORG"
    echo ""
fi

echo "Next steps:"
echo "  1. Review test results above"
echo "  2. If all passed, share TEAM_SETUP.md with your team"
echo "  3. Have team members configure Claude Desktop"
echo "  4. Monitor usage: vercel logs --follow"
echo ""
echo "================================================================================"

