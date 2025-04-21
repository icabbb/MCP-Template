import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  target: "esnext",
  bundle: true,
  minify: false,
  splitting: false, // << previene IIFE incorrectos
  sourcemap: false,
  clean: true,
  treeshake: true,
  shims: false,
  dts: false,
  external: ["src/utils/*/**"], // ❌ ignora estos archivos
});
