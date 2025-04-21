import { z } from "zod";

const schemaCurrentUnits = z.object({
  time: z.string(),
  interval: z.string(),
  temperature_2m: z.string(),
  precipitation: z.string(),
  rain: z.string(),
  is_day: z.string(),
});

const schemaCurrent = z.object({
  time: z.string(),
  interval: z.number(),
  temperature_2m: z.number(),
  precipitation: z.number(),
  rain: z.number(),
  is_day: z.number(),
});

export const schemaWeatherResponse = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  current_units: schemaCurrentUnits,
  current: schemaCurrent,
});

export type WeatherResponseProps = z.infer<typeof schemaWeatherResponse>;

/*
{
"latitude": -33.5,
"longitude": -70.625,
"generationtime_ms": 0.030755996704101562,
"utc_offset_seconds": 0,
"timezone": "GMT",
"timezone_abbreviation": "GMT",
"elevation": 549,
"current_units": {
"time": "iso8601",
"interval": "seconds",
"temperature_2m": "°C",
"precipitation": "mm",
"rain": "mm",
"is_day": ""
},
"current": {
"time": "2025-04-19T17:00",
"interval": 900,
"temperature_2m": 25,
"precipitation": 0,
"rain": 0,
"is_day": 1
}
}

*/
