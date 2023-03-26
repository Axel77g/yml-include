#!/usr/bin/env node
import path from "path";
import { Builder } from "./Builder.js";

const rootPath = process.cwd();

(async () => {
  let entry = process.argv[2] || null;
  let dist = process.argv[3] || null;

  if (!entry) throw new Error("No entry path provided");
  if (!dist) throw new Error("No dist path provided");

  entry = path.join(rootPath, entry);
  dist = path.join(rootPath, dist);

  let builder = new Builder(entry, dist);
  builder.run();
})();
