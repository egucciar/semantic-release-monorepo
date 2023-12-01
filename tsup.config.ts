import { defineConfig } from "tsup";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ["./index.js"],
  minify: false,
  splitting: false,
  format: ["cjs", "esm"],
  external: ["debug", "execa", "p-limit", "pkg-up", "ramda", "read-pkg"],
});
