# Azure DevOps Work Item MCP Server - Quick Start Guide

## 🚀 You're Production Ready!

Your MCP server has been tested and verified with **12 real work items** in Azure DevOps. Here's how to start using it immediately.

---

## View Your Test Data

All test work items are live in your Azure DevOps project:

🔗 **https://dev.azure.com/GenerativeAILab/ADOTest/_workitems/**

Filter by tag: `[System.Tags] CONTAINS 'ProductionTest'`

**Created Work Items**: 345-356 (12 total)
- **Bug #345**: Updated 6 times, linked to User Story, Priority 1, Active state
- **Tasks #346-355**: 10 tasks created, 5 batch-updated to Closed
- **User Story #356**: Complex with rich HTML, acceptance criteria, parent of Bug #345

---

## Using the MCP Server

### Option 1: Claude Desktop

1. **Ensure Node.js 20+**:
   ```bash
   node --version  # Must be v20.0.0 or higher
   # If not, upgrade with nvm:
   nvm install 20
   nvm use 20
   ```

2. **Add to Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "azure-devops-workitems": {
         "command": "node",
         "args": [
           "/Users/paul.glover/Documents/Repos/ADOMCP4/azure-devops-mcp/dist/index.js",
           "GenerativeAILab",
           "--authentication",
           "pat"
         ],
         "env": {
           "ADO_PAT": "your-pat-token"
         }
       }
     }
   }
   ```

3. **Restart Claude Desktop**

4. **Test with a prompt**:
   > "List all work items with the tag 'ProductionTest' in the ADOTest project"

### Option 2: VS Code with Cursor

1. **Install the MCP extension** in VS Code/Cursor

2. **Configure the server** (same config as above)

3. **Start using AI-powered work item management**

### Option 3: Any MCP Client

Use the standard MCP configuration format with:
- **Command**: `node`
- **Args**: `["/path/to/dist/index.js", "GenerativeAILab", "--authentication", "pat"]`
- **Env**: `{ "ADO_PAT": "your-token" }`

---

## Example Prompts

Once configured, try these prompts with your AI agent:

### Creating Work Items
```
Create a bug titled "Login page timeout" with high priority in ADOTest project
```

```
Create a user story: "As a user, I want to reset my password" with acceptance criteria in ADOTest
```

### Updating Work Items
```
Update work item #345 to state "Resolved"
```

```
Add a comment to work item #356: "Reviewed and approved"
```

### Querying Work Items
```
Show me all active bugs in ADOTest
```

```
List all work items in the current sprint
```

```
Find all high priority tasks assigned to me
```

### Advanced Operations
```
Link work item #100 as a child of #200
```

```
Show me the revision history of work item #345
```

```
Create 5 tasks for testing the new feature
```

### Feature Planning
```
Get the feature requirements for Feature #357 including all child user stories
```

```
Show me Feature #357 with all its user stories in a structured format for code generation
```

---

## Available Tools (45+)

The server provides comprehensive work item administration:

### Core Operations
- `core_list_projects` - List all projects
- `core_list_project_teams` - List teams in a project

### CRUD Operations (7 tools)
- Create, read, update, delete, restore work items
- Batch operations for efficiency

### History & Audit (3 tools)
- Get revisions, view specific revision, list updates

### Querying (7 tools)
- Execute WIQL queries
- Manage saved queries
- Get query results

### Relationships (3 tools)
- Link work items
- Unlink work items
- Add artifact links

### Metadata (4 tools)
- List work item types
- List fields
- Get field details
- Get work item type details

### Classification (7 tools)
- Manage area paths (list, create, update, delete)
- Manage iteration paths (list, update, delete)

### Backlogs & Sprints (6 tools)
- List backlogs
- Get backlog work items
- Manage team iterations
- Get sprint work items

### Comments (2 tools)
- List comments
- Add comments

---

## MCP Resources

Access work items directly via URI schemes:

### Individual Work Item
```
workitem://ADOTest/345
```

### My Work Items
```
workitems://ADOTest/my
```

### Query Results
```
workitems://ADOTest/queries/{queryId}
```

### Sprint Work Items
```
workitems://ADOTest/iterations/MyTeam/Sprint%201
```

---

## Pre-built Prompts

The server includes ready-to-use prompts for common scenarios:

- **Projects**: List available projects
- **Teams**: List teams in a project
- **getWorkItem**: Retrieve a specific work item
- **createBug**: Create a new bug
- **myWorkItems**: List your assigned work items
- **sprintBacklog**: Show current sprint backlog
- **updateWorkItemStatus**: Update work item state
- **findActiveBugs**: Find active bugs with WIQL

---

## Performance Expectations

Based on production testing:

| Operation | Performance | Notes |
|-----------|-------------|-------|
| Create single item | ~400ms | Typical API latency |
| Create 10 items | ~4s | 2.5 items/second |
| Update single item | ~400ms | Any field update |
| Batch update 5 items | ~2s | 2.5 updates/second |
| WIQL query | < 1s | For typical result sets |
| Link work items | ~400ms | Any relationship type |

---

## Troubleshooting

### "Node version error"
**Problem**: `yargs parser supports a minimum Node.js version of 20`

**Solution**:
```bash
nvm install 20
nvm use 20
node --version  # Verify it's 20+
```

### "Authentication failed"
**Problem**: PAT token not working

**Solution**:
1. Check PAT expiration in Azure DevOps
2. Verify PAT has "Work Items (Read, write, & manage)" permissions
3. Ensure `ADO_PAT` environment variable is set correctly

### "Project not found"
**Problem**: Cannot access project

**Solution**:
1. Verify project name is correct (case-sensitive)
2. Ensure PAT has access to the project
3. Check organization name in configuration

---

## Next Steps

### For Development
- Run tests: `npm test`
- Build: `npm run build`
- Validate: `node validate-build.js`
- Production test: `./production-test.sh`

### For Production Use
1. ✅ Server is ready to use (already tested)
2. Configure your AI client (Claude Desktop, VS Code, etc.)
3. Start managing work items with AI assistance
4. Monitor performance and adjust as needed

### Clean Up Test Data (Optional)

If you want to remove the 12 test work items:

1. Go to: https://dev.azure.com/GenerativeAILab/ADOTest/_workitems/
2. Query: `[System.Tags] CONTAINS 'ProductionTest'`
3. Select all and delete (or keep for reference)

---

## Support

- **Production Report**: See `PRODUCTION_REPORT.md` for detailed test results
- **Test Results**: See `TEST_RESULTS.md` for execution logs
- **Testing Guide**: See `TESTING_GUIDE.md` for manual test procedures
- **Documentation**: See `docs/` folder for detailed guides

---

**🎯 Your MCP server is production-ready and has been verified with 12 real work items in Azure DevOps!**

Start using it now by configuring your AI client and trying the example prompts above.

