import { hideBin } from "yargs/helpers";
import { runCli } from "./cli/root.js";
import { formatUnexpectedError } from "./cli/errors.js";

void (async () => {
  try {
    process.exitCode = await runCli(hideBin(process.argv));
  } catch (error) {
    console.error(formatUnexpectedError(error));
    process.exitCode = 1;
  }
})();
