/**
 * Tool for searching branches and ATMs by location
 * Returns structured JSON for machine-readable consumption
 */

import { TextContent } from "@modelcontextprotocol/sdk/types.js";
import { FilialfinderPort } from "../infra/filialfinderClient.js";
import { mapFiFiObjectToSummary } from "../domain/mappers.js";

export function createSearchBranchOrAtmTool(client: FilialfinderPort) {
  return {
    name: "search_branch_or_atm",
    description:
      "Sucht nach Sparkasse-Filialen, Geldautomaten oder SB-Filialen im Umkreis eines Standorts. Gibt strukturiertes JSON zurück.",
    inputSchema: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: {
        latitude: {
          type: "number",
          description: "Breitengrad des Suchzentrums"
        },
        longitude: {
          type: "number",
          description: "Längengrad des Suchzentrums"
        },
        radius_km: {
          type: "number",
          minimum: 0.1,
          maximum: 50,
          description: "Optional: Suchradius in Kilometern (Standard: 5km)"
        },
        type_group: {
          type: "string",
          enum: ["ATM", "BRANCH", "SELF_SERVICE"],
          description:
            "Optional: Filterung nach Typ (ATM=Geldautomat, BRANCH=Filiale, SELF_SERVICE=SB-Filiale)"
        },
        open_now: {
          type: "boolean",
          description: "Optional: Nur aktuell geöffnete Standorte anzeigen"
        },
        facilities: {
          type: "array",
          items: { type: "integer" },
          description: "Optional: Filter nach Ausstattungs-IDs (z.B. [2, 3] für Geldautomat + Kontoauszugsdrucker)"
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 50,
          description: "Optional: Maximale Anzahl der Ergebnisse (Standard: 10)"
        },
        page: {
          type: "integer",
          minimum: 1,
          description: "Optional: Seitennummer für Paginierung (Standard: 1)"
        }
      }
    },
    handler: async (args: any) => {
      const {
        latitude,
        longitude,
        radius_km = 5,
        type_group,
        open_now = false,
        facilities,
        limit = 10,
        page = 1
      } = args;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "invalid_arguments",
                message: "latitude und longitude müssen Zahlen sein."
              }, null, 2)
            } as TextContent
          ],
          isError: true
        };
      }

      // Map API enum (ATM, BRANCH, SELF_SERVICE) to backend enum (GELDAUTOMAT, FILIALE, SB_FILIALE)
      let backendTypeGroup: string | undefined;
      if (type_group) {
        const typeMapping: Record<string, string> = {
          ATM: "GELDAUTOMAT",
          BRANCH: "FILIALE",
          SELF_SERVICE: "SB_FILIALE"
        };
        backendTypeGroup = typeMapping[type_group];
      }

      const objects = await client.searchObjectsByCoordinates({
        latitude,
        longitude,
        radiusKm: radius_km,
        typeGroup: backendTypeGroup,
        nowOpen: open_now,
        facilities,
        objectsPerPage: limit,
        pageNo: page
      });

      const results = objects.map(mapFiFiObjectToSummary);

      const response = {
        results,
        total_results: results.length,
        page,
        page_size: limit,
        search_center: {
          latitude,
          longitude
        },
        filters: {
          radius_km,
          type_group: type_group || null,
          open_now,
          facilities: facilities || null
        }
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

