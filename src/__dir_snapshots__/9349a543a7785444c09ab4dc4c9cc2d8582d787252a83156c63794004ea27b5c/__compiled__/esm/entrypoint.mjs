import { a } from "dep";
import { a as a$1 } from "peerdep";
(async () => {
  const { a: opta } = import("optionaldep");
  console.log(opta);
})();
console.log(a, a$1);
//# sourceMappingURL=entrypoint.mjs.map
