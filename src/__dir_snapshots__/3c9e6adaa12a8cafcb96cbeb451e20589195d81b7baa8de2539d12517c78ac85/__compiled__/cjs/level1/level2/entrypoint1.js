"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const dep1 = require("../dep1.js");
function foo() {
  console.log(dep1.a);
}
exports.foo = foo;
