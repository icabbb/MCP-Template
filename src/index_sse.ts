import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

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

import { toolDispatcher } from "./dispatcher/tool.dispatcher.js";
import { resourceDispatcher } from "./dispatcher/resource.dispatcher.js";

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

const app = express();
app.use(express.json());
const transports: Record<string, SSEServerTransport> = {};

app.get("/mcp", async (req: Request, res: Response) => {
  try {
    const transport = new SSEServerTransport("/messages", res);
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;
    transport.onclose = () => {
      console.log(`SSE transport closed for session ${sessionId}`);
      delete transports[sessionId];
    };
    await server.connect(transport);

    console.log(`Established SSE stream with session ID: ${sessionId}`);
  } catch (error) {
    console.error("Error establishing SSE stream:", error);
    if (!res.headersSent) {
      res.status(500).send("Error establishing SSE stream");
    }
  }
});

// Messages endpoint for receiving client JSON-RPC requests
app.post("/messages", async (req: Request, res: Response) => {
  console.log("Received POST request to /messages");

  // Extract session ID from URL query parameter
  // In the SSE protocol, this is added by the client based on the endpoint event
  const sessionId = req.query.sessionId as string | undefined;

  if (!sessionId) {
    console.error("No session ID provided in request URL");
    res.status(400).send("Missing sessionId parameter");
    return;
  }

  const transport = transports[sessionId];
  if (!transport) {
    console.error(`No active transport found for session ID: ${sessionId}`);
    res.status(404).send("Session not found");
    return;
  }

  try {
    // Handle the POST message with the transport
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error("Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).send("Error handling request");
    }
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Simple SSE Server (deprecated protocol version 2024-11-05) listening on port ${PORT}`
  );
});

// Handle server shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  // Close all active transports to properly clean up resources
  for (const sessionId in transports) {
    try {
      console.log(`Closing transport for session ${sessionId}`);
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
  console.log("Server shutdown complete");
  process.exit(0);
});
