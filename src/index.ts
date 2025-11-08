#!/usr/bin/env node

/**
 * Filialsucher MCP Server Entry Point
 * 
 * Provides Model Context Protocol server for Sparkasse branch and ATM finder.
 * Uses mock data for demonstration purposes.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { MockFilialfinderClient } from "./infra/mockFilialfinderClient.js";
import { McpServer } from "./mcpServer.js";
import { createSearchBranchOrAtmTool } from "./tools/searchBranchOrAtm.js";
import { createGetObjectDetailsTool } from "./tools/getObjectDetails.js";
import { createListFacilitiesTool } from "./tools/listFacilities.js";
import { createListObjectTypesTool } from "./tools/listObjectTypes.js";
import { createGetConfigurationTool } from "./tools/getConfiguration.js";

async function main() {
  // Load configuration (defaults used for mock mode)
  const config = loadConfig();

  // Initialize client - using mock implementation since API endpoint returns 404
  // In production, replace with real FilialfinderClient once API is accessible
  const client = new MockFilialfinderClient();

  // Initialize MCP server
  const mcpServer = new McpServer();

  // Register tools
  mcpServer.registerTool(createSearchBranchOrAtmTool(client));
  mcpServer.registerTool(createGetObjectDetailsTool(client));
  mcpServer.registerTool(createListFacilitiesTool(client));
  mcpServer.registerTool(createListObjectTypesTool(client));
  mcpServer.registerTool(createGetConfigurationTool(client));

  // Connect to stdio transport for MCP communication
  const transport = new StdioServerTransport();
  await mcpServer.getServer().connect(transport);

  console.error("Filialsucher MCP Server gestartet");
  console.error(`Version: 0.1.0`);
  console.error(`Modus: Mock-Daten (Prototyp)`);
  console.error(`Verfügbare Tools: ${Array.from([
    "search_branch_or_atm",
    "get_object_details",
    "list_facilities",
    "list_object_types",
    "get_configuration"
  ]).join(", ")}`);
}

main().catch(error => {
  console.error("Fataler Fehler beim Start:", error);
  process.exit(1);
});

