"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fs = require("node:fs");
const promises = require("node:fs/promises");
const node_stream = require("node:stream");
const node_path = require("node:path");
const node_crypto = require("node:crypto");
const node_util = require("node:util");
const node_child_process = require("node:child_process");
const node_http = require("node:http");
const node_url = require("node:url");
const node_buffer = require("node:buffer");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
function readFileSync(path) {
  return fs__namespace.readFileSync(path);
}
async function readFileAsync(path) {
  return await promises.readFile(path);
}
function hashData(data) {
  return node_crypto.createHash("sha256").update(data).digest("hex");
}
function getFilePath(dir, file) {
  return node_path.join(dir, file);
}
function createReadStream() {
  return new node_stream.Readable({
    read() {
      this.push("Hello from Node.js built-in stream");
      this.push(null);
    }
  });
}
Object.defineProperty(exports, "writeFile", {
  enumerable: true,
  get: () => promises.writeFile
});
Object.defineProperty(exports, "Writable", {
  enumerable: true,
  get: () => node_stream.Writable
});
Object.defineProperty(exports, "dirname", {
  enumerable: true,
  get: () => node_path.dirname
});
Object.defineProperty(exports, "promisify", {
  enumerable: true,
  get: () => node_util.promisify
});
Object.defineProperty(exports, "spawn", {
  enumerable: true,
  get: () => node_child_process.spawn
});
Object.defineProperty(exports, "createServer", {
  enumerable: true,
  get: () => node_http.createServer
});
Object.defineProperty(exports, "URL", {
  enumerable: true,
  get: () => node_url.URL
});
Object.defineProperty(exports, "Buffer", {
  enumerable: true,
  get: () => node_buffer.Buffer
});
exports.createReadStream = createReadStream;
exports.getFilePath = getFilePath;
exports.hashData = hashData;
exports.readFileAsync = readFileAsync;
exports.readFileSync = readFileSync;
//# sourceMappingURL=index.js.map
