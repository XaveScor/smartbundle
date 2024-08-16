import { a } from "./__do_not_import_directly__/a.js";
function helloWorld() {
  console.log("Hello, world!" + a);
}
export {
  a,
  helloWorld
};
