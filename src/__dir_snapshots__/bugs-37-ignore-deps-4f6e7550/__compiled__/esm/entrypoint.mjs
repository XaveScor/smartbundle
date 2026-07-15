import { a } from "dep";
import { a as a$1 } from "peerdep";
//#region src/fixtures/37-ignore-deps/entrypoint.js
(async () => {
	const { a: opta } = import("optionaldep");
	console.log(opta);
})();
console.log(a, a$1);
//#endregion

//# sourceMappingURL=entrypoint.mjs.map