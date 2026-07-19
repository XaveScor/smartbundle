import yargs from "yargs";
import * as process from "node:process";
import { hideBin } from "yargs/helpers";

const argsSchema = yargs()
  .option("sourceDir", {
    alias: "s",
    type: "string",
    describe:
      "path to the project directory. Default: current working directory",
  })
  .option("packagePath", {
    alias: "p",
    type: "string",
    describe: "path to the package.json. Default: cwd()/package.json",
  })
  .option("outputDir", {
    alias: "o",
    type: "string",
    describe: "path to the output directory. Default: cwd()/dist",
  })
  // Do not cover this option in tests because it is unstable
  .option("seq", {
    type: "boolean",
    describe:
      "run internal tasks sequentially. It is useful for performance testing and debugging. This option is unstable and not recommended for production use.",
  })
  .help("help");

export const args = argsSchema.parseSync(hideBin(process.argv));

export type Args = {
  sourceDir?: string;
  packagePath?: string;
  outputDir?: string;
  seq?: boolean;
};
