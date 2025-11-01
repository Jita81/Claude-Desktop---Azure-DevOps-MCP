# Feature Requirements Tool

## Overview

The `wit_feature_requirements` tool retrieves a Feature work item and all its child User Stories in a structured JSON format, specifically designed for passing to AI agents to build features and their stories.

## Tool Name

`wit_feature_requirements`

## Purpose

This tool is optimized for AI-powered development workflows where you need to extract complete feature requirements including:
- Feature details (title, description, state, tags, etc.)
- All child User Stories with their acceptance criteria
- Structured format ready for code generation

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | The name or ID of the Azure DevOps project |
| `featureId` | number | Yes | The ID of the Feature work item |

## Output Structure

The tool returns a JSON object with the following structure:

```json
{
  "feature": {
    "id": 357,
    "title": "Test Feature - AI-Powered Dashboard",
    "description": "A comprehensive dashboard for monitoring AI model performance",
    "state": "New",
    "tags": "AI;Dashboard;FeatureTest",
    "areaPath": "ADOTest",
    "iterationPath": "ADOTest",
    "priority": 1,
    "assignedTo": "Paul Glover <paul.glover@example.com>"
  },
  "stories": [
    {
      "id": 358,
      "title": "User Story: Create Dashboard Layout",
      "description": "As a user, I want to see a responsive dashboard layout...",
      "acceptanceCriteria": "Given I am on the dashboard\nWhen the page loads\nThen I should see:\n- Header with navigation\n- 4 metric widgets...",
      "state": "New",
      "tags": "UserStory;Dashboard;UI",
      "areaPath": "ADOTest",
      "iterationPath": "ADOTest",
      "priority": 2,
      "assignedTo": ""
    },
    {
      "id": 359,
      "title": "User Story: Integrate Real-time Data API",
      "description": "As a user, I want to see real-time data updates...",
      "acceptanceCriteria": "Given I am viewing the dashboard\nWhen new data is available\nThen:\n- Widgets update automatically...",
      "state": "New",
      "tags": "UserStory;API;RealTime",
      "areaPath": "ADOTest",
      "iterationPath": "ADOTest",
      "priority": 1,
      "assignedTo": ""
    }
  ],
  "summary": {
    "featureId": 357,
    "totalChildWorkItems": 3,
    "userStoriesCount": 2,
    "otherChildWorkItemsCount": 1
  }
}
```

## Fields Included

### Feature Fields
- `id` - Work item ID
- `title` - Feature title
- `description` - Feature description (HTML formatted)
- `state` - Current state (New, Active, Resolved, etc.)
- `tags` - Semicolon-separated tags
- `areaPath` - Area path in the project
- `iterationPath` - Iteration/Sprint path
- `priority` - Priority value (1-4, or null)
- `assignedTo` - Assigned user in format "Name <email>"

### User Story Fields
- `id` - Work item ID
- `title` - Story title
- `description` - Story description (HTML formatted)
- `acceptanceCriteria` - Detailed acceptance criteria (HTML formatted)
- `state` - Current state
- `tags` - Semicolon-separated tags
- `areaPath` - Area path in the project
- `iterationPath` - Iteration/Sprint path
- `priority` - Priority value (1-4, or null)
- `assignedTo` - Assigned user in format "Name <email>"

### Summary Fields
- `featureId` - The Feature ID that was queried
- `totalChildWorkItems` - Total number of child work items (all types)
- `userStoriesCount` - Number of User Stories found
- `otherChildWorkItemsCount` - Number of non-User-Story child items (Bugs, Tasks, etc.)

## Behavior

1. **Retrieves the Feature** - Gets the Feature work item with all its relations
2. **Validates Work Item Type** - Ensures the work item is actually a Feature
3. **Filters Child Items** - Extracts only User Stories from all child work items
4. **Batch Retrieval** - Efficiently retrieves all child User Stories in a single API call
5. **Formats Output** - Structures the data for easy consumption by AI agents

## Error Handling

The tool handles several error conditions:

- **Feature Not Found**: Returns error if the Feature ID doesn't exist
- **Not a Feature**: Returns error if the work item is not a Feature type
- **No User Stories**: Returns empty stories array if no User Stories are linked
- **API Errors**: Returns descriptive error messages for any API failures

## Example Usage

### In Claude Desktop or MCP Client

```
"Get the feature requirements for Feature #357 in the ADOTest project"
```

### Direct Tool Call

```json
{
  "tool": "wit_feature_requirements",
  "arguments": {
    "project": "ADOTest",
    "featureId": 357
  }
}
```

## Use Cases

### 1. AI-Powered Code Generation
Pass the structured requirements to an AI agent to generate:
- Code scaffolding based on acceptance criteria
- Unit tests for each story
- API endpoints for the feature
- UI components matching the descriptions

### 2. Feature Documentation
Generate comprehensive documentation including:
- Feature overview from the Feature description
- Detailed user stories with acceptance criteria
- Requirements traceability matrix

### 3. Sprint Planning
Analyze feature complexity by examining:
- Number of user stories
- Story descriptions and acceptance criteria
- Priority and assignment information

### 4. Automated Testing
Create test suites based on:
- Acceptance criteria from each story
- Feature-level requirements
- State and validation rules

## Test Data

The tool has been tested with the following test data in the ADOTest project:

- **Feature #357**: "Test Feature - AI-Powered Dashboard"
  - **User Story #358**: "Create Dashboard Layout"
  - **User Story #359**: "Integrate Real-time Data API"
  - **User Story #360**: "Add Interactive Charts"

View in Azure DevOps: https://dev.azure.com/GenerativeAILab/ADOTest/_workitems/edit/357

## Performance

- **Single API Call** for Feature retrieval
- **Single Batch API Call** for all User Stories
- **Typical response time**: < 1 second for Features with 10-20 stories
- **No rate limiting concerns** - Uses efficient batch APIs

## Limitations

1. **User Stories Only**: The tool filters out other child work item types (Tasks, Bugs, etc.). If you need all children, use `wit_get_work_item` with `expand=relations`.

2. **Direct Children Only**: The tool retrieves only direct child User Stories. It does not traverse multiple levels of hierarchy (e.g., Tasks under User Stories).

3. **HTML Content**: Description and Acceptance Criteria fields contain HTML formatting. You may need to strip HTML tags if plain text is required.

## Related Tools

- `wit_get_work_item` - Get any work item with full details
- `wit_get_work_items_batch_by_ids` - Get multiple work items by IDs
- `wit_add_child_work_items` - Add new child work items to a parent
- `wit_work_items_link` - Link work items together

## Version

- **Added**: v3.0.0
- **Last Updated**: November 1, 2025

