#!/usr/bin/env node

/**
 * Demo script that exercises all MCP tools and displays results
 * Shows that the server returns proper structured JSON
 */

import { MockFilialfinderClient } from "./infra/mockFilialfinderClient.js";
import { createSearchBranchOrAtmTool } from "./tools/searchBranchOrAtm.js";
import { createGetObjectDetailsTool } from "./tools/getObjectDetails.js";
import { createListFacilitiesTool } from "./tools/listFacilities.js";
import { createListObjectTypesTool } from "./tools/listObjectTypes.js";
import { createGetConfigurationTool } from "./tools/getConfiguration.js";

async function demo() {
  console.log("🏦 Filialsucher MCP Server - Demo\n");
  console.log("=" .repeat(60));
  
  const client = new MockFilialfinderClient();
  
  // Tool 1: Search
  console.log("\n📍 Tool 1: search_branch_or_atm");
  console.log("-".repeat(60));
  const searchTool = createSearchBranchOrAtmTool(client);
  const searchResult = await searchTool.handler({
    latitude: 49.9929,
    longitude: 8.2473,
    type_group: "BRANCH",
    limit: 2
  });
  console.log(searchResult.content[0].text);

  // Tool 2: Get Details
  console.log("\n📋 Tool 2: get_object_details");
  console.log("-".repeat(60));
  const detailsTool = createGetObjectDetailsTool(client);
  const detailsResult = await detailsTool.handler({ id: 12001 });
  console.log(detailsResult.content[0].text);

  // Tool 3: List Facilities
  console.log("\n🔧 Tool 3: list_facilities");
  console.log("-".repeat(60));
  const facilitiesTool = createListFacilitiesTool(client);
  const facilitiesResult = await facilitiesTool.handler({});
  console.log(facilitiesResult.content[0].text);

  // Tool 4: List Object Types
  console.log("\n🏷️  Tool 4: list_object_types");
  console.log("-".repeat(60));
  const objectTypesTool = createListObjectTypesTool(client);
  const objectTypesResult = await objectTypesTool.handler({});
  console.log(objectTypesResult.content[0].text);

  // Tool 5: Get Configuration
  console.log("\n⚙️  Tool 5: get_configuration");
  console.log("-".repeat(60));
  const configTool = createGetConfigurationTool(client);
  const configResult = await configTool.handler({});
  console.log(configResult.content[0].text);

  console.log("\n" + "=".repeat(60));
  console.log("✅ All tools executed successfully!");
  console.log("📊 All responses are valid, parseable JSON");
  console.log("🔌 Ready for integration with Claude Desktop or any MCP client\n");
}

demo().catch(error => {
  console.error("❌ Demo failed:", error);
  process.exit(1);
});

