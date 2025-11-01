// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CORE_TOOLS } from "./tools/core.js";
import { WORKITEM_TOOLS } from "./tools/work-items.js";

function configurePrompts(server: McpServer) {
  server.prompt("Projects", "Lists all projects in the Azure DevOps organization.", {}, () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: String.raw`
# Task
Use the '${CORE_TOOLS.list_projects}' tool to retrieve all 'wellFormed' projects in the current Azure DevOps organization.
Present the results in alphabetical order in a table with the following columns: Name and ID.`,
        },
      },
    ],
  }));

  server.prompt("Teams", "Retrieves all teams for a given Azure DevOps project.", { project: z.string() }, ({ project }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: String.raw`
  # Task
  Use the '${CORE_TOOLS.list_project_teams}' tool to retrieve all teams for the project '${project}'.
  Present the results in alphabetical order in a table with the following columns: Name and Id`,
        },
      },
    ],
  }));

  server.prompt(
    "getWorkItem",
    "Retrieves details for a specific Azure DevOps work item by ID.",
    { id: z.string().describe("The ID of the work item to retrieve."), project: z.string().describe("The name or ID of the Azure DevOps project.") },
    ({ id, project }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: String.raw`
  # Task
  Use the '${WORKITEM_TOOLS.get_work_item}' tool to retrieve details for the work item with ID '${id}' in project '${project}'.
  Present the following fields: ID, Title, State, Assigned To, Work Item Type, Description or Repro Steps, and Created Date.`,
          },
        },
      ],
    })
  );

  server.prompt(
    "createBug",
    "Create a new bug work item with title and description.",
    {
      project: z.string().describe("Azure DevOps project name or ID"),
      title: z.string().describe("Bug title"),
      description: z.string().describe("Bug description or reproduction steps"),
    },
    ({ project, title, description }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: String.raw`
  # Task
  Use the '${WORKITEM_TOOLS.create_work_item}' tool to create a new Bug in project '${project}' with:
  - Title: ${title}
  - Description: ${description}
  Set the work item type to 'Bug' and provide appropriate values for required fields.`,
          },
        },
      ],
    })
  );

  server.prompt("myWorkItems", "List all work items assigned to me.", { project: z.string().describe("Azure DevOps project name or ID") }, ({ project }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: String.raw`
  # Task
  Use the '${WORKITEM_TOOLS.my_work_items}' tool to retrieve all work items assigned to me in project '${project}'.
  Display results in a table with columns: ID, Title, Type, State, and Priority.`,
        },
      },
    ],
  }));

  server.prompt(
    "sprintBacklog",
    "Show the current sprint backlog for a team.",
    {
      project: z.string().describe("Azure DevOps project name or ID"),
      team: z.string().describe("Team name or ID"),
    },
    ({ project, team }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: String.raw`
  # Task
  1. Use '${WORKITEM_TOOLS.list_team_iterations}' to get the current iteration for team '${team}' in project '${project}'.
  2. Use '${WORKITEM_TOOLS.get_work_items_for_iteration}' to get all work items in the current iteration.
  3. Display results in a table with columns: ID, Title, Type, State, Assigned To, and Priority.`,
          },
        },
      ],
    })
  );

  server.prompt(
    "updateWorkItemStatus",
    "Update the status/state of a work item.",
    {
      id: z.string().describe("Work item ID"),
      project: z.string().describe("Azure DevOps project name or ID"),
      state: z.string().describe("New state (e.g., 'Active', 'Resolved', 'Closed')"),
    },
    ({ id, project, state }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: String.raw`
  # Task
  Use the '${WORKITEM_TOOLS.update_work_item}' tool to update work item ${id} in project '${project}'.
  Set the 'System.State' field to '${state}'.`,
          },
        },
      ],
    })
  );

  server.prompt("findActiveBugs", "Find all active bugs in a project using WIQL.", { project: z.string().describe("Azure DevOps project name or ID") }, ({ project }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: String.raw`
  # Task
  Use the '${WORKITEM_TOOLS.execute_wiql}' tool to find all active bugs in project '${project}'.
  Execute this WIQL query: "SELECT [System.Id], [System.Title], [System.AssignedTo], [System.Priority] FROM WorkItems WHERE [System.WorkItemType] = 'Bug' AND [System.State] = 'Active' ORDER BY [System.Priority]"
  Display results in a table.`,
        },
      },
    ],
  }));
}

export { configurePrompts };
