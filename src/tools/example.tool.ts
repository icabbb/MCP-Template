import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const EXAMPLE_TOOL: Tool = {
  name: "example_tool",
  description: "Capture data example tool",
  inputSchema: {
    type: "object",
    properties: {
      data: {
        type: "string",
        description: "Data to capture example",
      },
    },
    required: ["data"],
  },
};
