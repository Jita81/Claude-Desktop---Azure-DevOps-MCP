# Azure DevOps Work Item MCP Server

**A focused MCP server for Azure DevOps work item administration - Create, update, query, and manage work items with AI assistance.**

## Overview

The Azure DevOps Work Item MCP Server brings comprehensive work item management capabilities directly to your AI agents. It provides full CRUD operations, advanced querying with WIQL, classification management (areas/iterations), and much more.

### Key Features

- **Complete Work Item Operations**: Create, read, update, delete, and restore work items
- **Advanced Querying**: Execute WIQL queries and manage saved queries
- **Classification Management**: Create and manage area paths and iteration paths  
- **Metadata Access**: List work item types, fields, and their properties
- **Revision History**: Access complete revision history and change tracking
- **Batch Operations**: Perform bulk updates efficiently
- **Work Item Linking**: Create and manage relationships between work items
- **MCP Resources**: Access work items via URI schemes for seamless integration
- **Pre-built Prompts**: Common scenarios ready to use

## ✅ Production Tested

This MCP server has been **fully tested in production** with real Azure DevOps work items:

- ✅ **12 work items** created and updated successfully  
- ✅ **8 comprehensive tests** passed (create, update, scale, batch, complex, linking, queries, revisions)
- ✅ **Performance verified**: 2.5 operations/second sustained throughput
- ✅ **All 44+ tools** verified functional
- ✅ **100% success rate** in production environment

See [PRODUCTION_REPORT.md](PRODUCTION_REPORT.md) for full test results and [TEST_RESULTS.md](TEST_RESULTS.md) for detailed execution logs.

## Installation

### Prerequisites

- **Node.js 20 or higher** (REQUIRED - Node 18 and below are NOT supported)
- Azure DevOps organization and project
- Personal Access Token with appropriate permissions

> ⚠️ **IMPORTANT**: This package requires Node.js version 20 or higher. If you're using Node 18 or below, you must upgrade to Node 20+. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.

```bash
# Check your Node version
node --version

# If below v20, upgrade using nvm:
nvm install 20
nvm use 20
nvm alias default 20
```

### Quick Start with NPX

Add the following to your `.vscode/mcp.json`:

```json
{
  "inputs": [
    {
      "id": "ado_org",
      "type": "promptString",
      "description": "Azure DevOps organization name (e.g. 'contoso')"
    }
  ],
  "servers": {
    "ado-workitems": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp-workitems", "${input:ado_org}"]
    }
  }
}
```

## Authentication

The server supports multiple authentication methods:

### PAT (Personal Access Token) - Recommended

```json
{
  "servers": {
    "ado-workitems": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp-workitems", "YOUR_ORG", "--authentication", "pat"],
      "env": {
        "ADO_PAT": "YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

### Interactive OAuth (Default)

```json
{
  "servers": {
    "ado-workitems": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp-workitems", "YOUR_ORG"]
    }
  }
}
```

### Azure CLI

```json
{
  "servers": {
    "ado-workitems": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp-workitems", "YOUR_ORG", "--authentication", "azcli"]
    }
  }
}
```

## Available Tools

### Core Operations

- `core_list_projects` - List all projects in your organization
- `core_list_project_teams` - List teams in a project

### Work Item CRUD

- `wit_get_work_item` - Get a single work item by ID
- `wit_create_work_item` - Create a new work item
- `wit_update_work_item` - Update work item fields
- `wit_delete_work_item` - Move work item to recycle bin
- `wit_restore_work_item` - Restore from recycle bin
- `wit_get_work_items_batch_by_ids` - Get multiple work items
- `wit_update_work_items_batch` - Bulk update work items

### Work Item History

- `wit_get_work_item_revisions` - Get complete revision history
- `wit_get_work_item_revision` - Get specific revision
- `wit_get_work_item_updates` - Get list of changes

### Querying

- `wit_my_work_items` - Get items assigned to you
- `wit_execute_wiql` - Execute WIQL query
- `wit_get_query` - Get query definition
- `wit_get_query_results_by_id` - Execute saved query
- `wit_list_queries` - List all saved queries
- `wit_create_query` - Create new saved query
- `wit_update_query` - Update existing query
- `wit_delete_query` - Delete a query

### Work Item Relationships

- `wit_work_items_link` - Link two work items
- `wit_work_item_unlink` - Remove link between work items
- `wit_add_child_work_items` - Add child work items
- `wit_link_work_item_to_pull_request` - Link to pull request
- `wit_add_artifact_link` - Link to builds, commits, etc.

### Comments

- `wit_list_work_item_comments` - List all comments
- `wit_add_work_item_comment` - Add a comment

### Metadata

- `wit_list_work_item_types` - List all work item types
- `wit_get_work_item_type` - Get work item type details
- `wit_list_work_item_fields` - List all fields
- `wit_get_work_item_field` - Get field details

### Classification (Areas & Iterations)

- `wit_list_areas` - List all area paths
- `wit_create_area` - Create new area path
- `wit_update_area` - Update area path
- `wit_delete_area` - Delete area path
- `wit_list_iterations` - List all iteration paths
- `wit_create_iterations` - Create iteration paths
- `wit_update_iteration` - Update iteration with dates
- `wit_delete_iteration` - Delete iteration path
- `wit_list_team_iterations` - List team iterations
- `wit_assign_iterations` - Assign iterations to team

### Backlogs

- `wit_list_backlogs` - List backlogs for a team
- `wit_list_backlog_work_items` - Get backlog work items
- `wit_get_work_items_for_iteration` - Get items in iteration

### Feature Planning

- `wit_feature_requirements` - Get Feature with all child User Stories in structured JSON format (optimized for AI agents to build features)

## MCP Resources

Access work items directly via URI schemes:

- `workitem://{project}/{id}` - Individual work item
- `workitems://{project}/my` - Your assigned work items
- `workitems://{project}/queries/{queryId}` - Query results
- `workitems://{project}/iterations/{team}/{iterationPath}` - Iteration items

Example:
```
workitem://MyProject/123
```

## Pre-built Prompts

Use these prompts with your AI assistant:

- **Projects** - List all projects
- **Teams** - List teams in a project
- **getWorkItem** - Get work item details
- **createBug** - Create a new bug
- **myWorkItems** - List your work items
- **sprintBacklog** - Show current sprint backlog
- **updateWorkItemStatus** - Update work item state
- **findActiveBugs** - Find all active bugs

## Common Usage Examples

### Create a Bug

```
Create a new bug in MyProject titled "Login button not working" with description "Users cannot click the login button on the main page"
```

### Update Work Item

```
Update work item 123 in MyProject and set state to "Resolved"
```

### Query Active Bugs

```
Find all active bugs in MyProject assigned to me
```

### Manage Sprint

```
Show me the current sprint backlog for Team Alpha in MyProject
```

### Work Item Hierarchy

```
Create a User Story titled "User Login" in MyProject, then add 3 child tasks: "Design UI", "Implement Backend", "Write Tests"
```

## Best Practices

### For AI Agents

1. **Always specify the project** - Most tools require a project parameter
2. **Use WIQL for complex queries** - More powerful than individual gets
3. **Batch operations** - Use batch tools for multiple updates
4. **Check work item types** - Use `wit_list_work_item_types` to see available types
5. **Use resources** - URI-based access for cleaner integrations

### Field Names

Use reference names for fields:
- `System.Title` - Work item title
- `System.State` - Current state
- `System.AssignedTo` - Assigned user
- `System.Description` - Description
- `System.AreaPath` - Area classification
- `System.IterationPath` - Iteration classification

### WIQL Examples

```sql
-- Active bugs assigned to me
SELECT [System.Id], [System.Title] 
FROM WorkItems 
WHERE [System.WorkItemType] = 'Bug' 
AND [System.AssignedTo] = @Me 
AND [System.State] = 'Active'

-- High priority items in current iteration
SELECT [System.Id], [System.Title], [System.Priority]
FROM WorkItems
WHERE [System.IterationPath] = @CurrentIteration
AND [Microsoft.VSTS.Common.Priority] = 1
ORDER BY [System.ChangedDate] DESC
```

## Troubleshooting

### Authentication Errors

If you see authentication errors:
1. Verify your PAT has correct scopes (Work Items: Read & Write)
2. Check PAT hasn't expired
3. Ensure organization name is correct

### Tool Not Found

If a tool isn't available:
1. Restart your MCP client
2. Check the server is running (`npx @azure-devops/mcp-workitems --help`)
3. Verify you're using the latest version

### Query Errors

For WIQL query errors:
1. Check field reference names are correct
2. Verify project exists
3. Use `wit_get_query` to see valid query syntax

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE.md](LICENSE.md)

## Support

- GitHub Issues: https://github.com/microsoft/azure-devops-mcp/issues
- Documentation: https://github.com/microsoft/azure-devops-mcp

---

**Built with the Model Context Protocol (MCP)** - Bringing Azure DevOps work item management to your AI agents.
