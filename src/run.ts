import { args } from "./args.js";
import { run } from "./index.js";
import { PrettyError } from "./PrettyErrors.js";
import { Youch } from "youch";

const youch = new Youch();

(async () => {
  const res = await run(args);

  if (!res.error) {
    return;
  }

  for (const error of res.errors) {
    if (!(error instanceof PrettyError)) {
      console.error("\x1b[31m[ERROR]", error, "\x1b[0m");
      continue;
    }

    console.error(await youch.toANSI(error));
  }
})();
