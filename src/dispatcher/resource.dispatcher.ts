import { ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { readLogFile } from "../functions/readLogFile.fn";
import { readPdf } from "../functions/readPdf.fn";

export async function resourceDispatcher(
  request: typeof ReadResourceRequestSchema._type
) {
  const uri = request.params.uri;

  try {
    switch (uri) {
      case "hello://world": {
        return {
          contents: [
            {
              uri: "hello://world",
              text: "Hello, World! This is my first MCP resource.",
            },
          ],
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
              text: `Unknown resource: ${uri}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      contents: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}
