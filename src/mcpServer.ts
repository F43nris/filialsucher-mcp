/**
 * MCP Server wrapper using official Model Context Protocol SDK
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

export class McpServer {
  private tools = new Map<string, ToolDefinition>();
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "filialsucher-mcp-server",
        version: "0.1.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // Handler for listing available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(this.tools.values()).map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    });

    // Handler for executing tools
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;
      const tool = this.tools.get(name);

      if (!tool) {
        return {
          content: [
            {
              type: "text",
              text: `Unbekanntes Tool: ${name}`
            }
          ],
          isError: true
        };
      }

      try {
        return await tool.handler(args);
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Fehler bei Ausführung von ${name}: ${
                error instanceof Error ? error.message : String(error)
              }`
            }
          ],
          isError: true
        };
      }
    });
  }

  registerTool(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  getServer(): Server {
    return this.server;
  }
}

