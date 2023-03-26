import fs from "fs";
import regexConf from "./config/regex.js";
import { Include } from "./Include.js";
import { BuildError } from "./error/BuildError.js";
import { Watcher } from "./Watcher.js";
import { FileCache } from "./File.js";
import { apply } from "./utils/ConsoleColor.js";

export class Builder {
  constructor(entryPath, distPath) {
    this.watcher = new Watcher();
    this.watcher.on("change", this.run.bind(this));

    this.entryPath = entryPath;
    this.distPath = distPath;

    this.files = new FileCache();
  }

  get currentIncludes() {}

  run() {
    //clea console
    const start = performance.now();
    this.files.clear();
    try {
      let include = new Include(
        ["", "", this.entryPath.replace(".yml", "")],
        null,
        this,
        null
      );

      let res = include.include(0, 0);
      res = res.replace(/([ ]{0,})(?<!\")#(.+)/gi, "");
      fs.writeFileSync(this.distPath, res, "utf8");

      const end = performance.now();
      console.log(
        apply(["bg.green", "bright"], " ✔️ Build completed "),
        "✨ YAML file built successfully in " +
          Math.round(100 * (end - start)) / 100 +
          "ms"
      );
    } catch (error) {
      console.log("\n🚨 Error while building the YAML files :\n");
      if (error instanceof BuildError) {
        console.error(error.renderStringError());
      } else console.error(error);
      if (!this.watcher.watching) process.exit(1);
    }
  }
}
