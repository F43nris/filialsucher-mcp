/**
 * Tool for retrieving detailed information about a specific facility
 * Returns structured JSON for machine-readable consumption
 */

import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { FilialfinderPort } from "../infra/filialfinderClient.js";
import { mapFiFiObjectToDetail } from "../domain/mappers.js";

export function createGetObjectDetailsTool(client: FilialfinderPort) {
  return {
    name: "get_object_details",
    description:
      "Liefert Detailinformationen zu einer bestimmten Filiale oder einem Geldautomaten anhand der ID. Gibt strukturiertes JSON zurück.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "integer",
          description: "Die eindeutige ID des Standorts"
        }
      }
    },
    handler: async (args: any) => {
      const { id } = args;

      if (typeof id !== "number") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "invalid_arguments",
                message: "id muss eine Zahl sein."
              }, null, 2)
            } as TextContent
          ],
          isError: true
        };
      }

      const obj = await client.getObjectById(id);

      if (!obj) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "not_found",
                message: `Kein Standort mit ID ${id} gefunden.`
              }, null, 2)
            } as TextContent
          ],
          isError: true
        };
      }

      const detail = mapFiFiObjectToDetail(obj);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(detail, null, 2)
          } as TextContent
        ]
      };
    }
  };
}

