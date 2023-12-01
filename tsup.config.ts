import { defineConfig } from "tsup";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ["./src/*.js", "!./src/*.spec.js"],
  minify: false,
  splitting: false,
  bundle: false,
  format: ["cjs", "esm"],
});
