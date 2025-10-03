# Azure DevOps MCP Server with PAT Authentication

**A fork of the official Microsoft Azure DevOps MCP Server with added Personal Access Token (PAT) authentication support - NO browser popups!**

> 🎉 This fork adds PAT authentication to the [official Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp), eliminating the need for browser-based OAuth authentication.

## 🚀 Quick Start

### Why This Fork?

The official Azure DevOps MCP Server only supports OAuth authentication, which opens a browser window every time you use it. This fork adds **PAT (Personal Access Token) authentication** for a seamless, browser-free experience.

**Perfect for:**
- 🔒 Users who want direct API authentication without browser popups
- 🚫 Environments where browser authentication isn't practical
- ⚡ Faster, more streamlined workflows

---

## 📦 Installation for Claude Desktop

### Prerequisites

- **Node.js 20+** (required by Azure DevOps MCP)
- **Claude Desktop** (macOS or Windows)
- **Azure DevOps Personal Access Token** ([Create one here](https://dev.azure.com))

### Step 1: Create a Personal Access Token

1. Go to your Azure DevOps organization: `https://dev.azure.com/{your-org}`
2. Click on **User Settings** (gear icon) → **Personal Access Tokens**
3. Click **"New Token"**
4. Give it a name (e.g., "Claude Desktop MCP")
5. Select the scopes you need (recommended: **Full access** for testing, or specific scopes for production)
6. Click **"Create"**
7. **Copy the token** - you won't see it again!

### Step 2: Configure Claude Desktop

1. **Open Claude Desktop Settings**:
   - macOS: `Claude` menu → `Settings...` → `Developer` tab → `Edit Config`
   - Windows: `Settings` → `Developer` → `Edit Config`

2. **Add this configuration** to your `claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "azure-devops": {
         "command": "npx",
         "args": [
           "-y",
           "@azure-devops/mcp@latest",
           "YOUR_ORGANIZATION_NAME",
           "--authentication",
           "pat"
         ],
         "env": {
           "ADO_PAT": "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
         }
       }
     }
   }
   ```

3. **Replace these values**:
   - `YOUR_ORGANIZATION_NAME`: Your Azure DevOps organization (e.g., if your URL is `https://dev.azure.com/contoso`, use `contoso`)
   - `YOUR_PERSONAL_ACCESS_TOKEN_HERE`: The PAT you created in Step 1

4. **Save the file** and **restart Claude Desktop**

### Step 3: Verify It Works

After restarting Claude Desktop:

1. Look for the **🔨 hammer icon** in the chat input box
2. Click it to see available Azure DevOps tools
3. Try a prompt: **"List my Azure DevOps projects"**

**No browser popups!** 🎉

---

## 🛠️ Installation for Development (From Source)

If you want to contribute or use the latest development version:

### 1. Clone the Repository

```bash
git clone https://github.com/Jita81/Claude-Desktop---Azure-DevOps-MCP.git
cd Claude-Desktop---Azure-DevOps-MCP
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Configure Claude Desktop (Local Build)

**Option A: Using a Safe Location (Recommended)**

```bash
# Copy to a location Claude Desktop can access
mkdir -p ~/.local/mcp-servers/azure-devops
cp -r dist/* ~/.local/mcp-servers/azure-devops/
cp -r node_modules ~/.local/mcp-servers/azure-devops/
```

Then configure `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/.local/mcp-servers/azure-devops/index.js",
        "YOUR_ORGANIZATION",
        "--authentication",
        "pat"
      ],
      "env": {
        "ADO_PAT": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

**Option B: Using Full Node.js Path**

If you have multiple Node versions (e.g., via NVM):

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "/path/to/node",
      "args": [
        "/Users/YOUR_USERNAME/.local/mcp-servers/azure-devops/index.js",
        "YOUR_ORGANIZATION",
        "--authentication",
        "pat"
      ],
      "env": {
        "ADO_PAT": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

---

## 🔑 Authentication Options

This fork supports **all authentication methods** from the official server, plus PAT:

| Method | Description | Browser Required? | Use Case |
|--------|-------------|-------------------|----------|
| `pat` | Personal Access Token | ❌ No | **Recommended** - Direct API access |
| `interactive` | OAuth browser flow | ✅ Yes | Default method (original behavior) |
| `azcli` | Azure CLI credentials | ❌ No | If you have Azure CLI configured |
| `env` | Environment variables | ❌ No | Azure DefaultCredential |

### Using PAT Authentication (This Fork)

```json
{
  "args": ["YOUR_ORG", "--authentication", "pat"],
  "env": { "ADO_PAT": "your-token" }
}
```

### Using OAuth (Original Behavior)

```json
{
  "args": ["YOUR_ORG", "--authentication", "interactive"]
}
```

---

## 📋 Available Tools

Once configured, you'll have access to 100+ Azure DevOps tools:

### Core
- `core_list_projects` - List all projects
- `core_list_project_teams` - List teams in a project
- `core_get_identity_ids` - Get identity information

### Work Items
- `wit_my_work_items` - Get your work items
- `wit_create_work_item` - Create new work items
- `wit_update_work_item` - Update work items
- `wit_get_work_item` - Get work item details
- And 20+ more work item tools...

### Repositories
- `repo_list_repos_by_project` - List repositories
- `repo_create_pull_request` - Create pull requests
- `repo_list_pull_requests_by_project` - List PRs
- `repo_create_branch` - Create branches
- And 15+ more repository tools...

### Pipelines
- `pipelines_get_builds` - List builds
- `pipelines_run_pipeline` - Run pipelines
- `pipelines_get_build_log` - Get build logs
- And 10+ more pipeline tools...

### Wiki
- `wiki_list_wikis` - List wikis
- `wiki_get_page_content` - Get wiki content
- `wiki_create_or_update_page` - Create/update pages

### Search
- `search_code` - Search code repositories
- `search_workitem` - Search work items
- `search_wiki` - Search wiki pages

### Test Plans
- `testplan_list_test_plans` - List test plans
- `testplan_create_test_case` - Create test cases
- And more...

See the [full list of tools](https://github.com/microsoft/azure-devops-mcp#%EF%B8%8F-supported-tools) in the official documentation.

---

## 💡 Example Prompts

Try these prompts in Claude Desktop after setup:

```
List all my Azure DevOps projects

Show me my work items in the {project-name} project

Create a new bug in {project-name} with title "Login button not working"

List all pull requests in {project-name}

Show me build logs for the latest build in {project-name}

List all repositories in {project-name}

Create a wiki page in {project-name} with content about our API design

Search for code containing "authentication" in {project-name}
```

---

## 🐛 Troubleshooting

### Server Not Loading

1. **Check Claude Desktop Logs**:
   - macOS: `~/Library/Logs/Claude/mcp.log`
   - Windows: `%APPDATA%\Claude\logs\mcp.log`

2. **Verify Node.js Version**:
   ```bash
   node --version  # Must be 20+
   ```

3. **Test the Server Manually**:
   ```bash
   ADO_PAT="your-token" node ~/.local/mcp-servers/azure-devops/index.js YOUR_ORG --authentication pat --help
   ```

### Permission Errors (macOS)

If you see `EPERM: operation not permitted`:

- **Don't** use files from `~/Documents` (macOS blocks Claude Desktop access)
- **Do** copy to `~/.local/mcp-servers/` as shown in the installation steps

### Tools Not Appearing

1. Restart Claude Desktop completely (Quit, then reopen)
2. Check for the 🔨 hammer icon in the chat input
3. Click the hammer and verify tools are listed

### Authentication Errors

- **PAT Invalid**: Verify your PAT hasn't expired and has the correct scopes
- **Organization Not Found**: Check your organization name (it's the part after `dev.azure.com/` in your URL)

### Still Having Issues?

Check the [official troubleshooting guide](https://github.com/microsoft/azure-devops-mcp#-troubleshooting) or [open an issue](https://github.com/Jita81/Claude-Desktop---Azure-DevOps-MCP/issues).

---

## 🔄 What's Different From the Official Server?

This fork adds:

1. ✅ **PAT Authentication Support** - No more browser popups!
2. ✅ **Updated Documentation** - Focused on PAT usage
3. ✅ **Improved Accessibility** - Works from locations Claude Desktop can access

All other features remain the same as the [official Microsoft Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp).

---

## 📜 Credits

- **Original Project**: [Microsoft Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp)
- **PAT Authentication**: Added by this fork
- **License**: MIT (same as original)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Same as the [original project](https://github.com/microsoft/azure-devops-mcp)

Copyright (c) Microsoft Corporation (Original)
Copyright (c) 2024 (PAT Authentication Fork)

---

## ⚠️ Security Notes

**NEVER commit your Personal Access Token to Git!**

- ✅ Store PAT in Claude Desktop config (not tracked by Git)
- ✅ Use environment variables
- ❌ Don't hardcode tokens in source code
- ❌ Don't commit `claude_desktop_config.json` if it contains tokens

---

## 🙏 Support

- **Official Server Issues**: [Microsoft Azure DevOps MCP Issues](https://github.com/microsoft/azure-devops-mcp/issues)
- **PAT Authentication Issues**: [This Fork's Issues](https://github.com/Jita81/Claude-Desktop---Azure-DevOps-MCP/issues)
- **General MCP Questions**: [MCP Documentation](https://modelcontextprotocol.io/)

---

**Happy coding! 🚀**
