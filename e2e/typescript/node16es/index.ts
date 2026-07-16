import { a, type Bar } from "test-lib/reexport";

const bar: Bar = { x: 1 };
console.log(a, bar.x);
