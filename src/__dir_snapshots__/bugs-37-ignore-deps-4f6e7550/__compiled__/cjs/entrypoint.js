"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let dep = require("dep");
let peerdep = require("peerdep");
//#region src/fixtures/37-ignore-deps/entrypoint.js
(async () => {
	const { a: opta } = import("optionaldep");
	console.log(opta);
})();
console.log(dep.a, peerdep.a);
//#endregion

//# sourceMappingURL=entrypoint.js.map