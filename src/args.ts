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
  .option("ci", {
    type: "boolean",
    describe: "run in CI mode",
  })
  .help("help");

export const args = argsSchema.parseSync(hideBin(process.argv));

type OmitUnknown<T> = {
  [K in keyof T as string extends K ? never : K]: T[K];
};
type ConvertUndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: Exclude<
    T[K],
    undefined
  >;
} & {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type Args = ConvertUndefinedToOptional<
  Omit<OmitUnknown<typeof args>, "_" | "$0">
>;
