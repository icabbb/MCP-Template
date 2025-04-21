import { z } from "zod";

export const schemaGeolocationResult = z.object({
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
  admin4: z.string().optional(),
});

export const schemaGeolocationResponse = z.object({
  results: z.array(schemaGeolocationResult).min(1),
  generationtime_ms: z.number().optional(),
});

export type GeolocationResponseProps = z.infer<
  typeof schemaGeolocationResponse
>;
