# Azure DevOps MCP Server - Deployment Guide for Teams

## Overview

This guide shows how to deploy the Azure DevOps MCP Server for a team/consultancy where multiple users need access to their Azure DevOps projects using their own PAT tokens.

**Current Architecture**: Vercel deployment (demonstration/beta)  
**Future Architecture**: AWS deployment (enterprise-ready)  
**Security Level**: Demonstration-ready (good enough for internal team use)

---

## Architecture Options

### Option 1: Local Deployment (Recommended for Security)

Each user runs the MCP server locally on their machine with their own PAT token.

**Pros:**
- ✅ Most secure (PAT never leaves user's machine)
- ✅ Standard MCP pattern
- ✅ No server costs
- ✅ Simple setup

**Cons:**
- ❌ Each user must install Node.js 20+
- ❌ Each user manages their own server

**Use this if:** Security is paramount, users are technical

### Option 2: Shared Vercel Deployment (Team Demo)

Central server on Vercel, users authenticate with their PAT via MCP client config.

**Pros:**
- ✅ Centrally managed
- ✅ No local installation needed
- ✅ Easy updates for everyone
- ✅ Works from anywhere

**Cons:**
- ⚠️ PATs transmitted over network (use HTTPS)
- ⚠️ Server has access to PATs
- ⚠️ Shared resources (rate limits)

**Use this if:** You want a team demo with centralized management

---

## Quick Start: Local Deployment (Most Secure)

### For Each User

#### 1. Prerequisites

```bash
# Check Node.js version (must be 20+)
node --version

# If not 20+, install with nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### 2. Clone and Build

```bash
# Clone the repository
git clone <your-repo-url>
cd azure-devops-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

#### 3. Get Azure DevOps PAT

1. Go to https://dev.azure.com/YOUR_ORG/_usersSettings/tokens
2. Click "New Token"
3. Set permissions:
   - **Work Items**: Read, write, & manage
   - **Project and Team**: Read
4. Set expiration (90 days recommended for demo)
5. Copy the token (save it securely!)

#### 4. Configure Claude Desktop (or your MCP client)

**File**: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)  
**File**: `%APPDATA%/Claude/claude_desktop_config.json` (Windows)

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": [
        "/absolute/path/to/azure-devops-mcp/dist/index.js",
        "YOUR_AZURE_DEVOPS_ORG",
        "--authentication",
        "pat"
      ],
      "env": {
        "ADO_PAT": "YOUR_PAT_TOKEN_HERE"
      }
    }
  }
}
```

**Replace**:
- `/absolute/path/to/azure-devops-mcp` - Full path to your cloned repo
- `YOUR_AZURE_DEVOPS_ORG` - Your Azure DevOps organization name
- `YOUR_PAT_TOKEN_HERE` - Your Personal Access Token

#### 5. Restart Claude Desktop

Restart Claude Desktop, and you should see the Azure DevOps tools available.

**Test it:**
```
"List all projects in my Azure DevOps organization"
```

---

## Team Deployment: Vercel (Demonstration)

For centralized team access with multiple PAT tokens.

### Architecture

```
User's MCP Client (Claude Desktop)
           ↓ HTTPS
    Vercel Edge Function
           ↓
   MCP Server (SSE Transport)
           ↓
    Azure DevOps API
```

### Security Considerations

⚠️ **For Demonstration Use Only**

- PAT tokens are stored as Vercel environment variables
- HTTPS encryption protects tokens in transit
- No token storage/logging in the application
- Rate limiting applies per Vercel instance
- Not suitable for production without additional security

### Step 1: Prepare for Deployment

#### 1.1 Create Vercel Configuration

**File**: `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/mcp/(.*)",
      "dest": "/dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 1.2 Create API Wrapper

**File**: `api/mcp.js`

```javascript
// Vercel serverless function wrapper for MCP server
import { spawn } from 'child_process';
import { resolve } from 'path';

export default async function handler(req, res) {
  // Enable CORS for MCP clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ADO-PAT, X-ADO-ORG');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract PAT and organization from headers
  const pat = req.headers['x-ado-pat'];
  const org = req.headers['x-ado-org'];

  if (!pat || !org) {
    return res.status(401).json({ 
      error: 'Missing X-ADO-PAT or X-ADO-ORG header' 
    });
  }

  // Set up SSE response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Start MCP server
  const serverPath = resolve(__dirname, '../dist/index.js');
  const server = spawn('node', [
    serverPath,
    org,
    '--authentication', 'pat'
  ], {
    env: {
      ...process.env,
      ADO_PAT: pat
    }
  });

  // Pipe server output to SSE
  server.stdout.on('data', (data) => {
    res.write(`data: ${data}\n\n`);
  });

  server.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });

  server.on('close', (code) => {
    res.end();
  });

  // Clean up on client disconnect
  req.on('close', () => {
    server.kill();
  });
}
```

### Step 2: Deploy to Vercel

#### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

#### 2.2 Login to Vercel

```bash
vercel login
```

#### 2.3 Deploy

```bash
# From the azure-devops-mcp directory
vercel --prod
```

#### 2.4 Note Your Deployment URL

Vercel will output a URL like: `https://azure-devops-mcp.vercel.app`

### Step 3: Configure Users

Each user configures their Claude Desktop to connect to your Vercel deployment:

**File**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "azure-devops-remote": {
      "url": "https://your-deployment.vercel.app/mcp",
      "transport": "sse",
      "headers": {
        "X-ADO-PAT": "USER_PAT_TOKEN_HERE",
        "X-ADO-ORG": "USER_AZURE_DEVOPS_ORG"
      }
    }
  }
}
```

**Each user provides**:
- Their own PAT token
- Their Azure DevOps organization name

### Step 4: Team Management

#### PAT Token Rotation

For team demos, you might want to create a shared service account:

1. Create a shared Azure DevOps user (e.g., `mcp-service@yourcompany.com`)
2. Generate a PAT for this account
3. Share the PAT with your team (securely)
4. All users use the same PAT in their config

⚠️ **Security Note**: This is suitable for demos but not production. Each user should have their own PAT for audit trails.

#### Monitoring

Monitor your Vercel deployment:
```bash
vercel logs --follow
```

---

## Multi-Organization Support

To support multiple Azure DevOps organizations:

### Option A: Multiple Deployments

Deploy separate instances for each organization:
- `yourcompany-org1.vercel.app`
- `yourcompany-org2.vercel.app`

### Option B: Single Deployment with Org Header

Users specify their organization in the config (already supported):

```json
{
  "headers": {
    "X-ADO-ORG": "organization-name"
  }
}
```

---

## Security Best Practices

### ✅ Do This

1. **Use HTTPS**: Vercel provides this automatically
2. **Rotate PATs regularly**: Set 90-day expiration
3. **Minimum permissions**: Only grant required Azure DevOps permissions
4. **Monitor usage**: Check Vercel logs for suspicious activity
5. **Document access**: Keep a list of who has access
6. **Use service accounts**: For shared demos, create dedicated accounts

### ❌ Don't Do This

1. **Don't commit PATs**: Never commit tokens to git
2. **Don't log PATs**: Ensure logging doesn't capture tokens
3. **Don't share PATs publicly**: Keep tokens within your team
4. **Don't use admin PATs**: Grant only work item permissions
5. **Don't skip expiration**: Always set PAT expiration dates

---

## Troubleshooting

### "Cannot connect to MCP server"

**Check**:
1. Vercel deployment is running: `vercel logs`
2. Claude Desktop config is correct (no typos in URL)
3. PAT token is valid (not expired)
4. Headers are set correctly

### "Authentication failed"

**Check**:
1. PAT has correct permissions (Work Items: Read, write, & manage)
2. PAT hasn't expired
3. Organization name is correct
4. `X-ADO-PAT` header is set

### "Work item not found"

**Check**:
1. Work item exists in the correct project
2. User has access to the project
3. Project name is spelled correctly (case-sensitive)

---

## Migration Path to AWS (Future)

When you're ready for enterprise deployment, migrate to AWS:

### Recommended AWS Architecture

```
User's MCP Client
       ↓
   API Gateway (+ WAF)
       ↓
   Lambda Function (MCP Server)
       ↓
   Secrets Manager (PAT storage)
       ↓
   CloudWatch (logging/monitoring)
```

### Migration Steps

1. **Authentication Layer**
   - Add OAuth 2.0 / OIDC
   - Use AWS Cognito for user management
   - Store PATs in AWS Secrets Manager

2. **Infrastructure**
   - Deploy to AWS Lambda
   - Use API Gateway for routing
   - Add CloudFront CDN
   - Set up VPC for isolation

3. **Security Enhancements**
   - Enable AWS WAF
   - Add rate limiting
   - Implement audit logging
   - Add encryption at rest

4. **Monitoring**
   - CloudWatch metrics
   - X-Ray tracing
   - Custom dashboards
   - Alerting

5. **Compliance**
   - GDPR compliance
   - SOC 2 certification
   - Regular security audits

**Estimated effort**: 2-4 weeks for AWS migration

---

## Cost Estimates

### Vercel (Current - Demo)

- **Free Tier**: 100 GB-hours/month
- **Pro**: $20/month (1,000 GB-hours)
- **Expected for 100 users**: ~$20-50/month

### AWS (Future - Enterprise)

- **Lambda**: ~$10-30/month (based on usage)
- **API Gateway**: ~$20-50/month
- **Secrets Manager**: ~$10/month
- **CloudWatch**: ~$10-20/month
- **Total**: ~$50-110/month

---

## Team Onboarding Checklist

For each new team member:

- [ ] Provide access to this documentation
- [ ] Help them create Azure DevOps PAT
- [ ] Share Vercel deployment URL (if centralized)
- [ ] Provide example Claude Desktop config
- [ ] Test their setup with a simple query
- [ ] Add them to the team access list
- [ ] Schedule PAT expiration reminder

---

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review Azure DevOps permissions
3. Check Vercel logs: `vercel logs`
4. Contact your team administrator

---

## Quick Reference

### User Configuration (Local)

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": ["/path/to/dist/index.js", "ORG", "--authentication", "pat"],
      "env": { "ADO_PAT": "token" }
    }
  }
}
```

### User Configuration (Vercel)

```json
{
  "mcpServers": {
    "azure-devops": {
      "url": "https://your-app.vercel.app/mcp",
      "transport": "sse",
      "headers": {
        "X-ADO-PAT": "token",
        "X-ADO-ORG": "org"
      }
    }
  }
}
```

### Test Commands

```
"List all projects"
"Get feature requirements for Feature #123 in ProjectName"
"Create a bug for login issue in ProjectName"
```

---

**Version**: 1.0 (Demonstration)  
**Last Updated**: November 1, 2025  
**Status**: Ready for internal team use

