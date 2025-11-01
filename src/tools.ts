// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebApi } from "azure-devops-node-api";

import { configureCoreTools } from "./tools/core.js";
import { configureWorkItemTools } from "./tools/work-items.js";

/**
 * Configure all tools for the Azure DevOps Work Item MCP Server
 * @param server - MCP Server instance
 * @param tokenProvider - Function to get authentication token
 * @param connectionProvider - Function to get Azure DevOps API connection
 * @param userAgentProvider - Function to get user agent string
 */
function configureAllTools(
  server: McpServer,
  tokenProvider: () => Promise<string>,
  connectionProvider: () => Promise<WebApi>,
  userAgentProvider: () => string
) {
  // Configure core tools (projects, teams)
  configureCoreTools(server, tokenProvider, connectionProvider, userAgentProvider);
  
  // Configure work item tools (CRUD, comments, links, queries, iterations, backlogs)
  configureWorkItemTools(server, tokenProvider, connectionProvider, userAgentProvider);
}

export { configureAllTools };
