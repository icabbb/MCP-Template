import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const FETCH_SII_TOOL: Tool = {
  name: "fetch-sii",
  description: "Tool to fetch data from SII",
  inputSchema: {
    type: "object",
    properties: {
      rut: {
        type: "string",
        description: "Rut of the SII",
      },
    },
    required: ["rut"]
  },
  anotations: {
    // Optional hints about tool behavior
    title: "Fetch Data from SII", // Human-readable title for the tool
    readonly: true, // If true, the tool does not modify its environment
    destructiveHint: false, // If true, the tool may perform destructive updates
    idempotentHint: true, // If true, repeated calls with same args have no additional effect
    openWorldHint: true, // If true, tool interacts with external entities
  },
};
