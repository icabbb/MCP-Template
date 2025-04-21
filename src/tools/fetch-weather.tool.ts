import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const FETCH_WEATHER_TOOL: Tool = {
  name: "fetch-weather",
  description: "Tool to fetch weather of a geolocation",
  inputSchema: {
    type: "object",
    properties: {
      latitude: {
        type: "string",
        description: "Latitude of the geolocation",
      },
      longitude: {
        type: "string",
        description: "Longitude of the geolocation",
      },
    },
    required: ["latitude", "longitude"],
  },
  anotations: {
    // Optional hints about tool behavior
    title: "Fetch Weather of a geolocation (latitude, longitude) in a city", // Human-readable title for the tool
    readonly: true, // If true, the tool does not modify its environment
    destructiveHint: false, // If true, the tool may perform destructive updates
    idempotentHint: true, // If true, repeated calls with same args have no additional effect
    openWorldHint: true, // If true, tool interacts with external entities
  },
};
