# Team Setup Guide - Quick Start

## For Team Administrators

### Initial Setup (One Time)

1. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from the project directory
cd azure-devops-mcp
npm install
npm run build
vercel --prod
```

2. **Note Your Deployment URL**

Vercel will give you a URL like: `https://azure-devops-mcp-abc123.vercel.app`

3. **Share with Team**

Send your team:
- The deployment URL
- Link to this guide
- Instructions for creating their PAT

---

## For Team Members

### Quick Setup (5 Minutes)

#### Step 1: Get Your Azure DevOps PAT

1. Go to: https://dev.azure.com/YOUR_ORG/_usersSettings/tokens
2. Click "**New Token**"
3. Give it a name: "MCP Server Access"
4. Set expiration: 90 days
5. Select scopes:
   - ✅ **Work Items** → Read, write, & manage
   - ✅ **Project and Team** → Read
6. Click "**Create**"
7. **COPY THE TOKEN** (you won't see it again!)

#### Step 2: Configure Claude Desktop

**Mac**: Open `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: Open `%APPDATA%/Claude/claude_desktop_config.json`

Add this (replace the placeholders):

```json
{
  "mcpServers": {
    "azure-devops": {
      "url": "https://YOUR_TEAM_DEPLOYMENT.vercel.app/mcp",
      "transport": "sse",
      "headers": {
        "X-ADO-PAT": "YOUR_PAT_TOKEN_HERE",
        "X-ADO-ORG": "YOUR_AZURE_DEVOPS_ORG"
      }
    }
  }
}
```

**Replace**:
- `YOUR_TEAM_DEPLOYMENT.vercel.app` → Your team's Vercel URL
- `YOUR_PAT_TOKEN_HERE` → The PAT you just created
- `YOUR_AZURE_DEVOPS_ORG` → Your Azure DevOps organization name

#### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop.

#### Step 4: Test It

In Claude, try:
```
"List all projects in my Azure DevOps organization"
```

You should see your projects! 🎉

---

## Troubleshooting

### "Cannot connect to server"
- Check the Vercel URL is correct (no typos)
- Verify the URL ends with `/mcp`
- Check your internet connection

### "Authentication failed"
- Verify your PAT hasn't expired
- Check you selected the right permissions when creating PAT
- Ensure organization name is correct (case-sensitive)

### "Work item not found"
- Verify you have access to the project
- Check the project name spelling (case-sensitive)
- Ensure the work item ID exists

---

## Security Reminders

- 🔒 **Never share your PAT** with others
- 🔒 **Don't commit PATs to git**
- 🔒 **Set PAT expiration** (90 days recommended)
- 🔒 **Rotate PATs regularly**
- 🔒 **Use minimum required permissions**

---

## What You Can Do

### Create Work Items
```
"Create a bug titled 'Login page timeout' with high priority in MyProject"
```

### Query Work Items
```
"Show me all active bugs in MyProject"
"Get feature requirements for Feature #123 in MyProject"
```

### Update Work Items
```
"Update work item #456 to state 'Resolved'"
"Add a comment to work item #789: 'Fixed in latest release'"
```

### Feature Planning
```
"Get the feature requirements for Feature #357 including all user stories"
```

---

## Need Help?

Contact your team administrator or check the full documentation:
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [README.md](README.md) - Full tool documentation
- [QUICKSTART.md](QUICKSTART.md) - Usage examples

---

## PAT Expiration Reminder

Set a calendar reminder for **7 days before** your PAT expires to create a new one!

When you create a new PAT:
1. Create the new PAT
2. Update your `claude_desktop_config.json`
3. Restart Claude Desktop
4. Delete the old PAT in Azure DevOps

