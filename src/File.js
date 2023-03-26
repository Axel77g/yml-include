import fs from "fs";
export class File {
  constructor(filePath) {
    this.filePath = filePath;
    this.content = fs.readFileSync(filePath, "utf8");
  }
}

export class FileCache {
  constructor() {
    this.files = new Map();
  }
  clear() {
    this.files.clear();
  }
  get(filePath) {
    if (this.files.has(filePath)) {
      return this.files.get(filePath);
    }

    let file = new File(filePath);
    this.files.set(filePath, file);
    return file;
  }
}
