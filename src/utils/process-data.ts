import fs from "node:fs";
import { fileURLToPath } from "url";
import path, { join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = join(__dirname, "..");

const raw = fs.readFileSync(`${rootDir}/data/GLUON_PROPERTIES.json`, "utf-8");
const json = JSON.parse(raw);

type JsonValue = string | number | boolean;
interface JsonObject {
  [key: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> {}

const TARGET_KEYS = ["type", "format", "description", "example"];

function extractValidProps(obj: any): any {
  if (typeof obj !== "object" || obj === null) return undefined;

  const result: any = {};

  for (const key in obj) {
    const value = obj[key];

    // Si contiene $ref lo ignoramos también
    if (typeof value === "object" && value !== null && "$ref" in value)
      continue;

    // Si es un objeto con "type": "object", lo ignoramos
    if (typeof value === "object" && value?.type === "object") continue;

    // Si es un objeto y tiene al menos una key de interés (y no es "object")
    if (typeof value === "object") {
      const hasTarget = TARGET_KEYS.some((k) => k in value);
      if (hasTarget && value.type !== "object") {
        result[key] = {};
        for (const k of TARGET_KEYS) {
          if (k in value) result[key][k] = value[k];
        }
      } else {
        const nested = extractValidProps(value);
        if (nested && Object.keys(nested).length > 0) {
          result[key] = nested;
        }
      }
    }
  }

  return result;
}

const inputPath = `${rootDir}/data/GLUON_PROPERTIES.json`;
const outputPath = `${rootDir}/data/properties.json`;

function main() {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const json = JSON.parse(raw);
  const filtered = extractValidProps(json);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2));
  console.log("✅ Filtrado generado en:", outputPath);
}

main();
