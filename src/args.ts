import yargs from "yargs";
import * as process from "node:process";

export const args = yargs(process.argv.slice(2))
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
  .help("help")
  .parseSync();

export type Args = typeof args;
