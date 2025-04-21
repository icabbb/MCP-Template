import { schemaGeolocationResponse } from "../types/geolocation-response.type.js";

export async function handleGeolocation(city: string) {
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
          text: `No geolocation found for city: ${city}`,
        },
      ],
      isError: true,
    };
  }
  const { latitude, longitude } = isValid.data.results[0];

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          latitude,
          longitude,
        }),
      },
    ],
  };
}
