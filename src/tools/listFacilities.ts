/**
 * Tool for listing all available facility types/amenities
 * Returns structured JSON for machine-readable consumption
 */

import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { FilialfinderPort } from "../infra/filialfinderClient.js";

export function createListFacilitiesTool(client: FilialfinderPort) {
  return {
    name: "list_facilities",
    description:
      "Liefert eine Liste aller verfügbaren Ausstattungsmerkmale (z.B. Geldautomat, Beratung, Kontoauszugsdrucker). Gibt strukturiertes JSON zurück.",
    inputSchema: {
      type: "object",
      properties: {}
    },
    handler: async (_args: any) => {
      const facilities = await client.listFacilities();

      const response = {
        facilities,
        total: facilities.length
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

