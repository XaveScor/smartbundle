const { default: DefaultImport, named } = require("test-lib");
console.log("cjs root default import:", DefaultImport);
console.log("cjs root named import:", named);

const {
  default: SubDefaultImport,
  named: subNamed,
} = require("test-lib/subroute");
console.log("cjs subroute default import:", SubDefaultImport);
console.log("cjs subroute named import:", subNamed);

const {
  default: RenamedDefaultImport,
  named: renamedNamed,
} = require("test-lib/innerFolder/renamed1");
console.log("cjs renamed default import:", RenamedDefaultImport);
console.log("cjs renamed named import:", renamedNamed);
