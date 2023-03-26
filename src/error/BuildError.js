import { apply } from "../utils/ConsoleColor.js";
import Errors from "./en.json" assert { type: "json" };

export class BuildError extends Error {
  constructor(ERROR_CODE, stringError, index, from) {
    super(Errors[ERROR_CODE].message || "Unknown error");
    this.name = ERROR_CODE;
    this.stringError = stringError;
    this.index = index;
    this.from = from;
  }

  get lineNumber() {
    return this.resolveLineNumber(this.stringError, this.index);
  }
  resolveLineNumber(data, index) {
    var perLine = data.split("\n");
    var total_length = 0;
    for (let i = 0; i < perLine.length; i++) {
      total_length += perLine[i].length;
      if (total_length >= index) return i + 1;
    }
  }

  renderStringError() {
    let beforeIndex = this.stringError.substring(
      this.index - 200 > 0 ? this.index - 200 : 0,
      this.index
    );
    let afterIndex = this.stringError.substring(
      this.index,
      this.index + 300 < this.stringError.length
        ? this.index + 300
        : this.stringError.length
    );

    let [before, ...after] = afterIndex.split("\n");
    let str = `${apply(["bg.red", "bright"], " BUILD ERROR ")} ${
      this.message
    } on line ${apply("fg.yellow", this.lineNumber)} from ${this.from}
===============================================

${apply("dim", beforeIndex)}${apply(
      ["fg.red", "bright"],
      ">>> " + before.trim().replace(/[-]{2}(.+)/gi, "") + " <<<"
    )}
${apply("dim", after.join("\n") + "...")}\n
===============================================\n\n`;
    return str;
  }
}
