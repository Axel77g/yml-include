import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/main.js",
  output: {
    file: "dist/yml-include.min.js",
    format: "module",
  },
  plugins: [json(), terser()],
};
