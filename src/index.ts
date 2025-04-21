import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";

import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  Resource,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

import {
  EXAMPLE_TOOL,
  FETCH_GEOLOCATION_TOOL,
  FETCH_WEATHER_TOOL,
} from "./tools/index.js";

import {
  LOG_RESOURCE,
  PDF_RESOURCE,
  HELLO_WORLD_RESOURCE,
} from "./resource/index";

import { toolDispatcher } from "./dispatcher/tool.dispatcher";
import { resourceDispatcher } from "./dispatcher/resource.dispatcher";

dotenv.config();

const MCP_TOOLS: Tool[] = [
  EXAMPLE_TOOL,
  FETCH_GEOLOCATION_TOOL,
  FETCH_WEATHER_TOOL,
];

const MCP_RESOURCES: Resource[] = [
  LOG_RESOURCE,
  PDF_RESOURCE,
  HELLO_WORLD_RESOURCE,
];

const server = new Server(
  {
    name: process.env.NAME || "MCP Server",
    version: process.env.VERSION || "1.0.0",
    description: process.env.DESCRIPTION || "MCP Server",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  return {
    tools: MCP_TOOLS,
  };
});

server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  return {
    resources: MCP_RESOURCES,
  };
});

server.setRequestHandler(ReadResourceRequestSchema, resourceDispatcher);
server.setRequestHandler(CallToolRequestSchema, toolDispatcher);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info(
    '{"jsonrpc": "2.0", "method": "log", "params": { "message": "Server running..." }}'
  );
}

/*server.sendLoggingMessage({
  level: "info",
  data: "Server started successfully",
});*/

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
