import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";

import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";

import {
  FETCH_SII_TOOL,
} from "./tools/index.js";

import { toolDispatcher } from "./dispatcher/tool.dispatcher";

dotenv.config();

const MCP_TOOLS: Tool[] = [
  FETCH_SII_TOOL,
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

server.setRequestHandler(CallToolRequestSchema, toolDispatcher);

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info(
    '{"jsonrpc": "2.0", "method": "log", "params": { "message": "Server running..." }}'
  );
}



runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
