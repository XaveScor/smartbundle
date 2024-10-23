import DefaultImport, { named } from "test-lib";
console.log("esm root default import:", DefaultImport);
console.log("esm root named import:", named);

// !! TOP-LEVEL-AWAIT is not supported in webpack4
(async () => {
  const { default: dynamicDefault, named: dynamicNamed } = await import(
    "test-lib"
  );
  console.log("esm root dynamic default import:", dynamicDefault);
  console.log("esm root dynamic named import:", dynamicNamed);
})();

import SubDefaultImport, { named as subNamed } from "test-lib/subroute";
console.log("esm subroute default import:", SubDefaultImport);
console.log("esm subroute named import:", subNamed);

// !! TOP-LEVEL-AWAIT is not supported in webpack4
(async () => {
  const { default: dynamicSubDefault, named: dynamicSubNamed } = await import(
    "test-lib/subroute"
  );
  console.log("esm subroute dynamic default import:", dynamicSubDefault);
  console.log("esm subroute dynamic named import:", dynamicSubNamed);
})();
