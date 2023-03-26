import { Event } from "./utils/Event.js";
import fs from "fs";
import { apply } from "./utils/ConsoleColor.js";

export class Watcher extends Event {
  constructor() {
    super();
    this.watching = process.argv.includes("--watch");
    if (Watcher.instance) {
      return Watcher.instance;
    }
    Watcher.instance = this;
    this.files = new Map();
  }
  watch(filePath) {
    if (!this.watching) return;

    if (this.files.has(filePath)) return;
    let watcher = fs.watch(filePath, (eventType, filePath) => {
      if (eventType === "change") {
        console.clear();

        console.log(
          apply(["bg.yellow", "bright"], " WATCHER ") +
            ` File ${filePath} has just changed, rebuilding...\n`
        );
        this.emit("change");
      }
    });
    this.files.set(filePath, watcher);
  }
}
