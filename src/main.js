#!/usr/bin/env node
import path from "path";
import { Builder } from "./Builder.js";

Object.nestedKey = (obj, key) => {
  const keys = key.split(".");
  const firstKey = keys[0];
  const remainingKeys = keys.slice(1);

  if (remainingKeys.length === 0) {
    return obj[firstKey];
  }

  if (obj[firstKey] === undefined) {
    return undefined;
  }

  return Object.nestedKey(obj[firstKey], remainingKeys.join("."));
};

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
