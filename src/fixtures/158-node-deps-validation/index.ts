import * as fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { Readable, Writable } from "node:stream";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { URL } from "node:url";
import { Buffer } from "node:buffer";

// Use some of the imported modules to ensure they're not tree-shaken
export function readFileSync(path: string): Buffer {
  return fs.readFileSync(path);
}

export async function readFileAsync(path: string): Promise<Buffer> {
  return await readFile(path);
}

export function hashData(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export function getFilePath(dir: string, file: string): string {
  return join(dir, file);
}

export function createReadStream(): Readable {
  return new Readable({
    read() {
      this.push("Hello from Node.js built-in stream");
      this.push(null);
    }
  });
}

export { writeFile, dirname, promisify, spawn, createServer, URL, Buffer, Writable };