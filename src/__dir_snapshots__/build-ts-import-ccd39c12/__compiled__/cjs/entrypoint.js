"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_a = require("./a.js");
//#region src/fixtures/ts-import/entrypoint.ts
function helloWorld() {
	console.log("Hello, world!1");
}
//#endregion
exports.a = require_a.a;
exports.helloWorld = helloWorld;

//# sourceMappingURL=entrypoint.js.map