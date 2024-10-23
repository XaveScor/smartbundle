const { default: DefaultImport, named } = require("test-lib");
console.log("cjs root default import:", DefaultImport);
console.log("cjs root named import:", named);

const {
  default: SubDefaultImport,
  named: subNamed,
} = require("test-lib/subroute");
console.log("cjs subroute default import:", SubDefaultImport);
console.log("cjs subroute named import:", subNamed);
