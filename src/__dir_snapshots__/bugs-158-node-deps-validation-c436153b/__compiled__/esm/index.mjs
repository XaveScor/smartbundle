import * as fs from "node:fs";
import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { Writable } from "node:stream";
import { join } from "node:path";
import { dirname } from "node:path";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { URL } from "node:url";
import { Buffer } from "node:buffer";
function readFileSync(path) {
  return fs.readFileSync(path);
}
async function readFileAsync(path) {
  return await readFile(path);
}
function hashData(data) {
  return createHash("sha256").update(data).digest("hex");
}
function getFilePath(dir, file) {
  return join(dir, file);
}
function createReadStream() {
  return new Readable({
    read() {
      this.push("Hello from Node.js built-in stream");
      this.push(null);
    }
  });
}
export {
  Buffer,
  URL,
  Writable,
  createReadStream,
  createServer,
  dirname,
  getFilePath,
  hashData,
  promisify,
  readFileAsync,
  readFileSync,
  spawn,
  writeFile
};
//# sourceMappingURL=index.mjs.map
