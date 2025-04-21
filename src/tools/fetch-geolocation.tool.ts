import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const FETCH_GEOLOCATION_TOOL: Tool = {
  name: "fetch-geolocation",
  description: "Tool to fetch geolocation of a city",
  inputSchema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "City to fetch geolocation",
      },
    },
    required: ["city"],
  },
  anotations: {
    // Optional hints about tool behavior
    title: "Fetch Geolocation of a city", // Human-readable title for the tool
    readonly: true, // If true, the tool does not modify its environment
    destructiveHint: false, // If true, the tool may perform destructive updates
    idempotentHint: true, // If true, repeated calls with same args have no additional effect
    openWorldHint: true, // If true, tool interacts with external entities
  },
};
