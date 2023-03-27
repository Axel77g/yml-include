import json from "@rollup/plugin-json";

export default {
  input: "src/main.js",
  output: {
    file: "dist/yml-include.min.js",
    format: "module",
  },
  plugins: [json()],
};
