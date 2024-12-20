import { args } from "./args.js";
import { run } from "./index.js";

run(args).then((res) => {
  if (res.error) {
    for (const error of res.errors) {
      console.error("\x1b[31m[ERROR]", error, "\x1b[0m");
    }
  }
});
