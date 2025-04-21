import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { handleGeolocation, handleWeather } from "../apis/index";

export async function toolDispatcher(
  request: typeof CallToolRequestSchema._type
) {
  try {
    switch (request.params.name) {
      case "fetch-geolocation": {
        const { city } = request.params.arguments as { city: string };
        return await handleGeolocation(city);
      }
      case "fetch-weather": {
        const { latitude, longitude } = request.params.arguments as {
          latitude: string;
          longitude: string;
        };
        return await handleWeather(latitude, longitude);
      }
      case "example_tool": {
        const { data } = request.params.arguments as { data: string };
        return {
          content: [
            {
              type: "text",
              text: `Example tool called with data: ${data}`,
            },
          ],
        };
      }
      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${request.params.name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
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
