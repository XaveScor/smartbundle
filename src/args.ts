import yargs from "yargs";
import * as process from "node:process";
import { hideBin } from "yargs/helpers";

// In test mode, if no arguments (i.e. no command) are provided, default to "build"
if (process.env.NODE_ENV === "test" && hideBin(process.argv).length === 0) {
  process.argv.push("build");
}

// Configure yargs to capture arguments after --
const parser = yargs(hideBin(process.argv)).parserConfiguration({
  "populate--": true,
});

const commonOptions = {
  verbose: {
    alias: "v",
    type: "boolean",
    describe: "enables verbose logging",
  },
  sourceDir: {
    alias: "s",
    type: "string",
    describe:
      "path to the project directory. Default: current working directory",
  },
  packagePath: {
    alias: "p",
    type: "string",
    describe: "path to the package.json. Default: cwd()/package.json",
  },
  outputDir: {
    alias: "o",
    type: "string",
    describe: "path to the output directory. Default: cwd()/dist",
  },
  // Do not cover this option in tests because it is unstable
  seq: {
    type: "boolean",
    describe:
      "run internal tasks sequentially. It is useful for performance testing and debugging. This option is unstable and not recommended for production use.",
  },
} as const;

const argsSchema = parser
  .command("build", "Build your package for distribution", (yargs) => {
    return yargs.options(commonOptions);
  })
  .command("release", "Build and publish your package", (yargs) => {
    return yargs.options(commonOptions);
  })
  .demandCommand(1, "You must specify a command (build or release)")
  .help("help");

// Parse arguments and extract command name and publish flags
const rawArgs = argsSchema.parseSync();
export const args = {
  ...rawArgs,
  command: rawArgs._[0] as "build" | "release",
  // Only include publishFlags for release command
  ...(rawArgs._[0] === "release" && rawArgs["--"]
    ? { publishFlags: rawArgs["--"] as string[] }
    : {}),
  // Set default paths if not provided
  sourceDir: typeof rawArgs.sourceDir === "string" ? rawArgs.sourceDir : process.cwd(),
  packagePath: typeof rawArgs.packagePath === "string"
    ? rawArgs.packagePath
    : `${typeof rawArgs.sourceDir === "string" ? rawArgs.sourceDir : process.cwd()}/package.json`,
  outputDir: typeof rawArgs.outputDir === "string" ? rawArgs.outputDir : `${process.cwd()}/dist`,
};

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
  Omit<OmitUnknown<typeof args>, "_" | "$0" | "--">
> & {
  command: "build" | "release";
  sourceDir: string;
  packagePath: string;
  outputDir: string;
  verbose?: boolean;
  publishFlags?: string[];
  seq?: boolean;
};
