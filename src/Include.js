import regexConf from "./config/regex.js";
import fs from "fs";
import path from "path";
import { BuildError } from "./error/BuildError.js";
import { apply } from "./utils/ConsoleColor.js";

export class Include {
  constructor([_, leadingSpace, path], index, builder, parent = null) {
    this._ = _;
    this.leadingSpace = leadingSpace;

    let temp = path.split("--");
    this.path = temp[0];

    this.subInclude = [];
    this.parent = parent;

    this.index = index;

    this.slots = [];
    this.builder = builder;

    this.resolveSlots();
    this.resolveSubIncludes();
    this.findWarningSyntax();
  }

  get dirPath() {
    return path.resolve(this.filePath, "..");
  }
  get filePath() {
    if (this.path.startsWith("/")) return path.join(this.path + ".yml");
    return path.join(
      path.resolve(this.builder.entryPath, ".."),
      this.path + ".yml"
    );
  }

  get includeFile() {
    return this.builder.files.get(this.filePath).content;
  }

  get cleanIncludeFile() {
    let regex = regexConf.supportedSyntax;
    let cleanIncludeFile = this.includeFile.replace(regex, "");
    return cleanIncludeFile;
  }

  get isPathExist() {
    return fs.existsSync(this.filePath);
  }

  resolveSlots() {
    if (!this.parent) return;
    const dataFromIndex = this.parent.includeFile.substring(this.index);
    const [include, ...linesAfter] = dataFromIndex.split("\n");

    const regex = regexConf.slotRegex;
    let match;

    for (let i = 0; i < linesAfter.length; i++) {
      match = regex.exec(linesAfter[i]);

      if (match) this.slots.push(new Slot(match, match.index));
      else break;
    }
  }

  resolveSubIncludes() {
    let regex = new RegExp(regexConf.includeRegex);
    let match;

    while ((match = regex.exec(this.includeFile))) {
      let [fullMatch, leadingSpace, relativePath] = match;
      let newRelativePath = path.resolve(this.dirPath, relativePath);

      if (!fs.existsSync(newRelativePath + ".yml"))
        throw new BuildError(
          "INCLUDED_NOT_FOUND",
          this.includeFile,
          match.index,
          this.filePath
        );

      this.subInclude.push(
        new Include(
          [fullMatch, leadingSpace, newRelativePath],
          match.index,
          this.builder,
          this
        )
      );
    }
  }

  findWarningSyntax() {
    const regex = regexConf.warningSyntax;
    let match;
    while ((match = regex.exec(this.cleanIncludeFile))) {
      console.log(
        apply(["bg.yellow", "bright"], " WARNING ") +
          ` Syntax ${match[0]} is not supported in ${this.filePath}`
      );
    }
  }

  include() {
    let resStr = this.includeFile;
    this.builder.watcher.watch(this.filePath);

    this.subInclude.forEach((include) => {
      let res = include.include();
      let r = new RegExp(`^${include._}$(\n[ ]{0,}#@slot.*)*`, "m");
      resStr = resStr.replace(r, res);
    });

    this.slots.forEach((slot) => (resStr = slot.exec(resStr)));
    resStr = resStr.replace(/\n/g, `\n${this.leadingSpace}`);

    return (this.leadingSpace + resStr).trimEnd();
  }
}

export class Slot {
  constructor([_, leadingSpace, slotIdentifier, value], index) {
    this._ = _;
    this.index = index;
    this.identifier = slotIdentifier;
    this.value = value;
    this.leadingSpace = leadingSpace;
    this.slots = [];
  }

  exec(data) {
    data = data.replace(this.identifier, this.value);
    return data;
  }
}
