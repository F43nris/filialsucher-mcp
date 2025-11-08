/**
 * Tool for retrieving Filialfinder configuration
 * Returns structured JSON for machine-readable consumption
 */

import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { FilialfinderPort } from "../infra/filialfinderClient.js";

export function createGetConfigurationTool(client: FilialfinderPort) {
  return {
    name: "get_configuration",
    description:
      "Liefert die aktuelle Filialfinder-Konfiguration (BLZ, unterstützte Objekttypen). Gibt strukturiertes JSON zurück.",
    inputSchema: {
      type: "object",
      properties: {}
    },
    handler: async (_args: any) => {
      const config = await client.getConfiguration();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(config, null, 2)
          } as TextContent
        ]
      };
    }
  };
}

