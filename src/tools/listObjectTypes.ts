/**
 * Tool for listing all available object types
 * Returns structured JSON for machine-readable consumption
 */

import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { FilialfinderPort } from "../infra/filialfinderClient.js";

export function createListObjectTypesTool(client: FilialfinderPort) {
  return {
    name: "list_object_types",
    description:
      "Liefert eine Liste aller verfügbaren Objekttypen (FILIALE, GELDAUTOMAT, SB_FILIALE). Gibt strukturiertes JSON zurück.",
    inputSchema: {
      type: "object",
      properties: {}
    },
    handler: async (_args: any) => {
      const objectTypes = await client.listObjectTypes();

      const response = {
        object_types: objectTypes,
        total: objectTypes.length
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2)
          } as TextContent
        ]
      };
    }
  };
}

