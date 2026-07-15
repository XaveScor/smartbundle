"use strict";
Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_index = require("./dir/index.js");
//#region src/fixtures/97-dts-reexports-bundler/reexports.ts
var reexports_default = Promise.resolve().then(() => require("./dir/index.js"));
//#endregion
exports.a = require_index.a;
exports.default = reexports_default;

//# sourceMappingURL=reexports.js.map