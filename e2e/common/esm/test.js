import DefaultImport, { named } from "test-lib";
console.log("esm root default import:", DefaultImport);
console.log("esm root named import:", named);

const { default: dynamicDefault, named: dynamicNamed } = await import(
  "test-lib"
);
console.log("esm root dynamic default import:", dynamicDefault);
console.log("esm root dynamic named import:", dynamicNamed);

import SubDefaultImport, { named as subNamed } from "test-lib/subroute";
console.log("esm subroute default import:", SubDefaultImport);
console.log("esm subroute named import:", subNamed);

const { default: dynamicSubDefault, named: dynamicSubNamed } = await import(
  "test-lib/subroute"
);
console.log("esm subroute dynamic default import:", dynamicSubDefault);
console.log("esm subroute dynamic named import:", dynamicSubNamed);

import RenamedDefaultImport, {
  named as renamedNamed,
} from "test-lib/innerFolder/renamed1";
console.log("esm renamed default import:", RenamedDefaultImport);
console.log("esm renamed named import:", renamedNamed);

const { default: dynamicRenamedDefault, named: dynamicRenamedNamed } =
  await import("test-lib/innerFolder/renamed1");
console.log("esm renamed dynamic default import:", dynamicRenamedDefault);
console.log("esm renamed dynamic named import:", dynamicRenamedNamed);

/**
 *
 * const { default: OnlyDefault } = require("test-lib/onlyDefault");
 * console.log("cjs only default import:", OnlyDefault);
 *
 * const { named: OnlyNamed } = require("test-lib/onlyNamed");
 * console.log("cjs only named import:", OnlyNamed);
 *
 * require("test-lib/onlySideEffect");
 */
import OnlyDefault from "test-lib/onlyDefault";
console.log("esm only default import:", OnlyDefault);
const { default: dynamicOnlyDefault } = await import("test-lib/onlyDefault");
console.log("esm only dynamic default import:", dynamicOnlyDefault);

import { named as OnlyNamed } from "test-lib/onlyNamed";
console.log("esm only named import:", OnlyNamed);
const { named: dynamicOnlyNamed } = await import("test-lib/onlyNamed");
console.log("esm only dynamic named import:", dynamicOnlyNamed);

import "test-lib/onlySideEffect";
console.log("esm only side effect import");
await import("test-lib/onlySideEffect");
console.log("esm only dynamic side effect import");
