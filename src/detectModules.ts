import { type PackageJson } from "./packageJson.js";
import semver from "semver";
import { okLog, errorLog, log, lineLog, warnLog } from "./log.js";
import type { Dirs } from "./resolveDirs.js";

export type TS = {
  ts: typeof import("typescript");
  parsedConfig: import("typescript").ParsedCommandLine;
  host: import("typescript").CompilerHost;
};
export type DetectedModules = {
  ts?: TS;
  babel?: typeof import("@babel/core");
  react?: "legacy" | "modern";
};

type DepType =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";
export function getMinVersion(
  packageJson: PackageJson,
  depName: string,
  exclude: DepType[],
): semver.SemVer | null {
  const allDepKeys = new Set<DepType>([
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]);
  for (const e of exclude) {
    allDepKeys.delete(e);
  }

  let minVersion: semver.SemVer | null = null;
  for (const depKey of allDepKeys) {
    const depVersion = packageJson[depKey]?.[depName];
    if (depVersion) {
      const version = semver.minVersion(depVersion);
      if (!version) {
        warnLog("node-semver cannot parse version of", depName, "from", depKey);
        warnLog("Version:", depVersion);
        continue;
      }
      if (!minVersion) {
        minVersion = version;
        continue;
      }
      if (semver.lt(version, minVersion)) {
        minVersion = version;
      }
    }
  }

  return minVersion;
}

async function detectBabel(
  packageJson: PackageJson,
): Promise<typeof import("@babel/core") | undefined> {
  if ("@babel/core" in (packageJson.optionalDependencies ?? {})) {
    errorLog("babel excluded because inside optionalDependencies");
    return;
  }

  try {
    const babel = await import("@babel/core");
    okLog("babel, version:", babel.version);
    return babel;
  } catch {
    errorLog("babel");
  }
}

async function detectReact(
  packageJson: PackageJson,
): Promise<"legacy" | "modern" | undefined> {
  const reactVersion = getMinVersion(packageJson, "react", ["devDependencies"]);
  if (reactVersion) {
    const isLegacy = semver.lt(reactVersion, "17.0.0");
    const transform = isLegacy ? "legacy" : "modern";
    okLog(
      `react, min version: ${reactVersion.version}. Transform: ${transform}`,
    );
    return transform;
  }
  errorLog("react");
}

async function detectTypescript(
  packageJson: PackageJson,
  dirs: Dirs,
  monorepoType?: "pnpm" | null,
): Promise<TS | undefined> {
  const typescriptVersion = getMinVersion(packageJson, "typescript", []);
  
  if (!typescriptVersion) {
    errorLog("typescript");
    return;
  }

  let ts: typeof import("typescript");
  try {
    // ts <=4.3 has no named exports. The all methods is located in the default export
    ts = (await import("typescript")).default;
  } catch {
    if (monorepoType === "pnpm") {
      throw new Error(
        "smartbundle found the .ts entrypoint but required \"typescript\" to build .d.ts files. " +
        "Please install the \"typescript\" dependency. " +
        "In pnpm workspaces, you may need to either:\n" +
        "1. Add \"hoist-workspace-packages=true\" to your pnpm-workspace.yaml file (recommended), or\n" +
        "2. Add \"public-hoist-pattern[]=[\\\"typescript\\\"]\" to your pnpm-workspace.yaml file, or\n" +
        "3. Add \"typescript\" as a devDependency in each package's package.json\n" +
        "See https://pnpm.io/settings#dependency-hoisting-settings for more details."
      );
    } else {
      throw new Error(
        "smartbundle found the .ts entrypoint but required \"typescript\" to build .d.ts files. " +
        "Please install the \"typescript\" dependency."
      );
    }
  }

  okLog("typescript, version:", ts.version);

  const configFilePath = ts.findConfigFile(dirs.sourceDir, ts.sys.fileExists);
  if (!configFilePath) {
    throw new Error(
      "Cannot find a tsconfig.json file. You should declare it. Please, read the https://github.com/XaveScor/smartbundle/issues/131 for more information",
    );
  }
  const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);
  if (configFile.error) {
    const readableError = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      "\n",
    );
    throw new Error(`Cannot read tsconfig.json file, error: ${readableError}`);
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    dirs.sourceDir,
    {
      declaration: true,
      emitDeclarationOnly: true,
      strict: false,
      strictNullChecks: false,
      strictFunctionTypes: false,
      strictPropertyInitialization: false,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      outDir: "",
      // https://github.com/XaveScor/bobrik/issues/22#issuecomment-2308552352
      noEmit: false,
    },
    configFilePath,
  );

  if (!parsedConfig.options.verbatimModuleSyntax) {
    throw new Error(
      "verbatimModuleSyntax should be enabled in tsconfig.json. Read https://github.com/XaveScor/smartbundle/issues/131 for more explanation.\n" +
        "You also can upvote the issue if you need the support of verbatimModuleSyntax: false in your library",
    );
  }

  const host = ts.createCompilerHost(parsedConfig.options);

  return { ts, parsedConfig, host };
}

export async function detectModules(
  packageJson: PackageJson,
  dirs: Dirs,
  monorepoType?: "pnpm" | null,
): Promise<
  | { error: false; modules: DetectedModules }
  | { error: true; errors: Array<string> }
> {
  try {
    const result: DetectedModules = {};
    log("Detecting modules");

    result.ts = await detectTypescript(packageJson, dirs, monorepoType);
    result.babel = await detectBabel(packageJson);
    result.react = await detectReact(packageJson);

    lineLog();
    return { error: false, modules: result };
  } catch (e: any) {
    return { error: true, errors: [e.message] };
  }
}
