import { a as depa } from "dep";
(async () => {
  const { a: opta } = import("optionaldep");
  console.log(opta);
})();
import { a as peera } from "peerdep";

console.log(depa, peera);
