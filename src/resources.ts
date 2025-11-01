// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebApi } from "azure-devops-node-api";
import { WorkItemExpand } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces.js";

/**
 * Configure MCP resources for Azure DevOps Work Items
 * Resources provide read-only access to work item data via URI schemes
 * 
 * Supported URI patterns:
 * - workitem://{project}/{id} - Individual work item
 * - workitems://{project}/queries/{queryId} - Query results
 * - workitems://{project}/iterations/{iterationPath} - Iteration work items
 * - workitems://{project}/my - User's assigned work items
 */
export function configureResources(
  server: McpServer,
  connectionProvider: () => Promise<WebApi>
) {
  // Register resource templates
  server.server.setRequestHandler("resources/templates/list" as any, async () => {
    return {
      resourceTemplates: [
        {
          uriTemplate: "workitem://{project}/{id}",
          name: "Work Item",
          description: "Read a single work item by ID from a specific project",
          mimeType: "application/json",
        },
        {
          uriTemplate: "workitems://{project}/my",
          name: "My Work Items",
          description: "Read work items assigned to the authenticated user",
          mimeType: "application/json",
        },
        {
          uriTemplate: "workitems://{project}/queries/{queryId}",
          name: "Query Results",
          description: "Read work items from a saved query",
          mimeType: "application/json",
        },
        {
          uriTemplate: "workitems://{project}/iterations/{team}/{iterationPath}",
          name: "Iteration Work Items",
          description: "Read work items for a specific iteration",
          mimeType: "application/json",
        },
      ],
    };
  });

  // Register resource list handler
  server.server.setRequestHandler("resources/list" as any, async () => {
    return {
      resources: [
        {
          uri: "workitems://help",
          name: "Work Item Resources Help",
          description: "Documentation for available work item resource URIs",
          mimeType: "text/markdown",
        },
      ],
    };
  });

  // Register resource read handler
  server.server.setRequestHandler("resources/read" as any, async (request: any) => {
    const uri = request.params.uri as string;

    // Help resource
    if (uri === "workitems://help") {
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: `# Azure DevOps Work Item Resources

Available resource URI patterns:

## Individual Work Item
\`workitem://{project}/{id}\`

Read a single work item by ID from a specific project.

Example: \`workitem://MyProject/123\`

## My Work Items
\`workitems://{project}/my\`

Read work items assigned to the authenticated user.

Example: \`workitems://MyProject/my\`

## Query Results
\`workitems://{project}/queries/{queryId}\`

Read work items from a saved query.

Example: \`workitems://MyProject/queries/12345678-1234-1234-1234-123456789abc\`

## Iteration Work Items
\`workitems://{project}/iterations/{team}/{iterationPath}\`

Read work items for a specific team iteration.

Example: \`workitems://MyProject/iterations/TeamName/Sprint%201\`
`,
          },
        ],
      };
    }

    // Parse work item resource URIs
    const workitemMatch = uri.match(/^workitem:\/\/([^\/]+)\/(\d+)$/);
    if (workitemMatch) {
      const [, project, idStr] = workitemMatch;
      const id = parseInt(idStr, 10);

      try {
        const connection = await connectionProvider();
        const workItemApi = await connection.getWorkItemTrackingApi();
        const workItem = await workItemApi.getWorkItem(
          id,
          undefined,
          undefined,
          WorkItemExpand.All,
          project
        );

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(workItem, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(
          `Failed to read work item ${id} from project ${project}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Parse my work items resource URI
    const myWorkItemsMatch = uri.match(/^workitems:\/\/([^\/]+)\/my$/);
    if (myWorkItemsMatch) {
      const [, project] = myWorkItemsMatch;

      try {
        const connection = await connectionProvider();
        const workApi = await connection.getWorkApi();
        const workItems = await workApi.getPredefinedQueryResults(
          project,
          "assignedtome",
          50,
          false
        );

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(workItems, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(
          `Failed to read my work items from project ${project}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Parse query results resource URI
    const queryMatch = uri.match(/^workitems:\/\/([^\/]+)\/queries\/([^\/]+)$/);
    if (queryMatch) {
      const [, project, queryId] = queryMatch;

      try {
        const connection = await connectionProvider();
        const workItemApi = await connection.getWorkItemTrackingApi();
        const queryResults = await workItemApi.queryById(queryId, {
          project,
          projectId: "",
        });

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(queryResults, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(
          `Failed to read query ${queryId} from project ${project}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Parse iteration work items resource URI
    const iterationMatch = uri.match(
      /^workitems:\/\/([^\/]+)\/iterations\/([^\/]+)\/(.+)$/
    );
    if (iterationMatch) {
      const [, project, team, iterationPath] = iterationMatch;
      const decodedPath = decodeURIComponent(iterationPath);

      try {
        const connection = await connectionProvider();
        const workApi = await connection.getWorkApi();
        const teamContext = { project, team };

        // Get iteration work items
        const workItems = await workApi.getIterationWorkItems(
          teamContext,
          decodedPath
        );

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(workItems, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new Error(
          `Failed to read iteration work items for ${decodedPath} in team ${team}, project ${project}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    throw new Error(`Unknown resource URI: ${uri}`);
  });
}

