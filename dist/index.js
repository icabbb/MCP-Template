import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { PdfReader } from 'pdfreader';

// src/index.ts

// src/tools/example.tool.ts
var EXAMPLE_TOOL = {
  name: "example_tool",
  description: "Capture data example tool",
  inputSchema: {
    type: "object",
    properties: {
      data: {
        type: "string",
        description: "Data to capture example"
      }
    },
    required: ["data"]
  }
};

// src/tools/fetch-geolocation.tool.ts
var FETCH_GEOLOCATION_TOOL = {
  name: "fetch-geolocation",
  description: "Tool to fetch geolocation of a city",
  inputSchema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "City to fetch geolocation"
      }
    },
    required: ["city"]
  },
  anotations: {
    // Optional hints about tool behavior
    title: "Fetch Geolocation of a city",
    // Human-readable title for the tool
    readonly: true,
    // If true, the tool does not modify its environment
    destructiveHint: false,
    // If true, the tool may perform destructive updates
    idempotentHint: true,
    // If true, repeated calls with same args have no additional effect
    openWorldHint: true
    // If true, tool interacts with external entities
  }
};

// src/tools/fetch-weather.tool.ts
var FETCH_WEATHER_TOOL = {
  name: "fetch-weather",
  description: "Tool to fetch weather of a geolocation",
  inputSchema: {
    type: "object",
    properties: {
      latitude: {
        type: "string",
        description: "Latitude of the geolocation"
      },
      longitude: {
        type: "string",
        description: "Longitude of the geolocation"
      }
    },
    required: ["latitude", "longitude"]
  },
  anotations: {
    // Optional hints about tool behavior
    title: "Fetch Weather of a geolocation (latitude, longitude) in a city",
    // Human-readable title for the tool
    readonly: true,
    // If true, the tool does not modify its environment
    destructiveHint: false,
    // If true, the tool may perform destructive updates
    idempotentHint: true,
    // If true, repeated calls with same args have no additional effect
    openWorldHint: true
    // If true, tool interacts with external entities
  }
};

// src/resource/log.resource.ts
var LOG_RESOURCE = {
  uri: "log://app_sample",
  name: "Read log example",
  mimeType: "text/plain"
};

// src/resource/pdf.resource.ts
var PDF_RESOURCE = {
  uri: "manual://cobol-es",
  name: "Read pdf example",
  mimeType: "application/pdf"
};

// src/resource/hello-world.resource.ts
var HELLO_WORLD_RESOURCE = {
  uri: "hello://world",
  name: "Hello World Message",
  description: "A simple greeting message",
  mimeType: "text/plain"
};
var schemaGeolocationResult = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
  feature_code: z.string().optional(),
  country_code: z.string().optional(),
  admin1_id: z.number().optional(),
  admin2_id: z.number().optional(),
  admin3_id: z.number().optional(),
  admin4_id: z.number().optional(),
  timezone: z.string().optional(),
  population: z.number().optional(),
  postcodes: z.array(z.string()).optional(),
  country_id: z.number().optional(),
  country: z.string().optional(),
  admin1: z.string().optional(),
  admin2: z.string().optional(),
  admin3: z.string().optional(),
  admin4: z.string().optional()
});
var schemaGeolocationResponse = z.object({
  results: z.array(schemaGeolocationResult).min(1),
  generationtime_ms: z.number().optional()
});

// src/apis/handleGeolocation.api.ts
async function handleGeolocation(city) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.append("name", city);
  url.searchParams.append("count", "1");
  url.searchParams.append("language", "en");
  url.searchParams.append("format", "json");
  const response = await fetch(url.toString());
  const data = await response.json();
  const isValid = schemaGeolocationResponse.safeParse(data);
  if (!isValid.success) {
    return {
      content: [
        {
          type: "text",
          text: `No geolocation found for city: ${city}`
        }
      ],
      isError: true
    };
  }
  const { latitude, longitude } = isValid.data.results[0];
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          latitude,
          longitude
        })
      }
    ]
  };
}

// src/apis/handleWeather.api.ts
async function handleWeather(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.append("latitude", latitude);
  url.searchParams.append("longitude", longitude);
  url.searchParams.append("hourly", "temperature_2m");
  url.searchParams.append(
    "current",
    "temperature_2m,precipitation,rain,is_day"
  );
  url.searchParams.append("forecast_days", "1");
  const response = await fetch(url.toString());
  const data = await response.json();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data)
      }
    ]
  };
}

// src/dispatcher/tool.dispatcher.ts
async function toolDispatcher(request) {
  try {
    switch (request.params.name) {
      case "fetch-geolocation": {
        const { city } = request.params.arguments;
        return await handleGeolocation(city);
      }
      case "fetch-weather": {
        const { latitude, longitude } = request.params.arguments;
        return await handleWeather(latitude, longitude);
      }
      case "example_tool": {
        const { data } = request.params.arguments;
        return {
          content: [
            {
              type: "text",
              text: `Example tool called with data: ${data}`
            }
          ]
        };
      }
      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${request.params.name}`
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}
var logFilePath = "/Volumes/SSD_EVO/sample_data/app_sample.log";
async function readLogFile() {
  try {
    const logContents = await readFile(logFilePath, "utf-8");
    return {
      contents: [
        {
          uri: "log://app_sample",
          mimeType: "text/plain",
          text: logContents
        }
      ]
    };
  } catch (error) {
    return {
      contents: [
        {
          uri: "log://app_sample",
          mimeType: "text/plain",
          text: "Error reading log file"
        }
      ],
      isError: true
    };
  }
}
var pdfFilePath = "file:///Volumes/SSD_EVO/sample_data/cobol-es.pdf";
function parsePdf(pdfFilePath2) {
  return new Promise((resolve, reject) => {
    const lines = [];
    new PdfReader().parseFileItems(pdfFilePath2, (err, item) => {
      if (err) {
        return reject(err);
      }
      if (!item) {
        return resolve(lines.join(" "));
      }
      if (item.text) {
        lines.push(item.text);
      }
    });
  });
}
async function readPdf(uri) {
  try {
    const filePath = fileURLToPath(pdfFilePath);
    console.error(filePath);
    const data = await parsePdf(filePath);
    console.error(data);
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: data
          //buffer.toString("base64"),
        }
      ]
    };
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "Error reading Pdf file"
        }
      ],
      isError: true
    };
  }
}

// src/dispatcher/resource.dispatcher.ts
async function resourceDispatcher(request) {
  const uri = request.params.uri;
  try {
    switch (uri) {
      case "hello://world": {
        return {
          contents: [
            {
              uri: "hello://world",
              text: "Hello, World! This is my first MCP resource."
            }
          ]
        };
      }
      case "log://app_sample":
        return await readLogFile();
      case "manual://cobol-es":
        return await readPdf(uri);
      default:
        return {
          contents: [
            {
              type: "text",
              text: `Unknown resource: ${uri}`
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    return {
      contents: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
}

// src/index.ts
dotenv.config();
var MCP_TOOLS = [
  EXAMPLE_TOOL,
  FETCH_GEOLOCATION_TOOL,
  FETCH_WEATHER_TOOL
];
var MCP_RESOURCES = [
  LOG_RESOURCE,
  PDF_RESOURCE,
  HELLO_WORLD_RESOURCE
];
var server = new Server(
  {
    name: process.env.NAME || "MCP Server",
    version: process.env.VERSION || "1.0.0",
    description: process.env.DESCRIPTION || "MCP Server"
  },
  {
    capabilities: {
      resources: {},
      tools: {}
    }
  }
);
server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  return {
    tools: MCP_TOOLS
  };
});
server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  return {
    resources: MCP_RESOURCES
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
runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
