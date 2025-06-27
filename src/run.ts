import { args } from "./args.js";
import { run } from "./index.js";
import { PrettyError } from "./PrettyErrors.js";
import { Youch } from "youch";
import { parseMonorepo } from "./monorepo/parseMonorepo/parseMonorepo.js";
import { buildMonorepo } from "./monorepo/buildAll.js";

const youch = new Youch();

(async () => {
  try {
    const sourceDir = args.sourceDir || process.cwd();

    // Check if we're in a monorepo
    const { monorepo, projectPaths } = await parseMonorepo({ sourceDir });

    if (monorepo) {
      // Handle monorepo build
      if (projectPaths.length === 0) {
        throw new PrettyError(
          "No packages with -sbsources suffix found in monorepo",
        );
      }

      const result = await buildMonorepo({
        ...args,
        monorepo,
      });

      // Print errors for failed packages
      if (result.failedBuilds > 0) {
        for (const { packagePath, errors } of result.errors) {
          console.error(`\n\x1b[31mErrors in ${packagePath}:\x1b[0m`);
          for (const error of errors) {
            if (!(error instanceof PrettyError)) {
              console.error("\x1b[31m[ERROR]", error, "\x1b[0m");
              continue;
            }
            console.error(await youch.toANSI(error));
          }
        }
        process.exit(1);
      }
      return;
    }

    // Not a monorepo, run normal build
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
  } catch (error) {
    if (error instanceof PrettyError) {
      console.error(await youch.toANSI(error));
    } else {
      console.error("\x1b[31m[ERROR]", error, "\x1b[0m");
    }
    process.exit(1);
  }
})();
