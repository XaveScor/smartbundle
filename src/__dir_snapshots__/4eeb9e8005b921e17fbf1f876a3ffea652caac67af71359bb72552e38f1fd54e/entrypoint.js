"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const a = require("./__do_not_import_directly__/a.js");
function helloWorld() {
  console.log("Hello, world!" + a.a);
}
exports.a = a.a;
exports.helloWorld = helloWorld;
