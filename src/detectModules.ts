import { type PackageJson } from "./packageJson.js";
import semver from "semver";
import { okLog, errorLog, log, lineLog, warnLog } from "./log.js";
import type { Dirs } from "./resolveDirs.js";
import type { Monorepo } from "./args.js";

type DetectionResult<T> =
  // We have undefined here is module is not found
  // It is not an error because the user would disable some functionality by not installing deps
  { success: true; module: T | undefined } | { success: false; error: string };

type ModuleWithVersion<T> = T & { version: string };

type TSModuleData = {
  ts: typeof import("typescript");
  parsedConfig: import("typescript").ParsedCommandLine;
  host: import("typescript").CompilerHost;
};

type BabelModuleData = {
  babel: typeof import("@babel/core");
};

type ReactModuleData = {
  transform: "legacy" | "modern";
};

export type TSModule = ModuleWithVersion<TSModuleData>;
export type BabelModule = ModuleWithVersion<BabelModuleData>;
export type ReactModule = ModuleWithVersion<ReactModuleData>;

export type DetectedModules = {
  ts?: TSModule;
  babel?: BabelModule;
  react?: ReactModule;
};

export type DetectModulesResult =
  | { success: true; modules: DetectedModules }
  | { success: false; errors: string[] };

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
  isMonorepoPackage: boolean,
): Promise<DetectionResult<BabelModule>> {
  const hasBabelInPackage = getMinVersion(packageJson, "@babel/core", [
    "optionalDependencies",
  ]);

  if (isMonorepoPackage && hasBabelInPackage) {
    return {
      success: false,
      error:
        `Babel found in package-level package.json for monorepo package "${packageJson.name}".\n` +
        `In monorepos, build tools like Babel should be defined in the workspace root package.json, not in individual packages.\n` +
        `Please move "@babel/core" from this package's dependencies/devDependencies to the root package.json's devDependencies.`,
    };
  }

  if ("@babel/core" in (packageJson.optionalDependencies ?? {})) {
    errorLog("babel excluded because inside optionalDependencies");
    return {
      success: false,
      error: "Babel excluded because it's in optionalDependencies",
    };
  }

  // Check for babel in package deps
  const babelVersion = getMinVersion(packageJson, "@babel/core", [
    "optionalDependencies",
  ]);

  if (!babelVersion) {
    errorLog("babel");
    return { success: true, module: undefined };
  }

  try {
    const babel = await import("@babel/core");
    okLog("babel, version:", babel.version);
    return {
      success: true,
      module: {
        babel,
        version: babel.version,
      },
    };
  } catch {
    errorLog("babel");
    return { success: false, error: "Failed to import @babel/core" };
  }
}

async function detectReact(
  packageJson: PackageJson,
  isMonorepoPackage: boolean,
): Promise<DetectionResult<ReactModule>> {
  const reactVersionInPackage = getMinVersion(packageJson, "react", [
    "devDependencies",
  ]);

  if (isMonorepoPackage && reactVersionInPackage) {
    return {
      success: false,
      error:
        `React found in package-level package.json for monorepo package "${packageJson.name}".\n` +
        `In monorepos, build tools like React should be defined in the workspace root package.json, not in individual packages.\n` +
        `Please move "react" from this package's dependencies/peerDependencies to the root package.json's dependencies or peerDependencies.`,
    };
  }

  const reactVersion = getMinVersion(packageJson, "react", ["devDependencies"]);

  if (reactVersion) {
    const isLegacy = semver.lt(reactVersion, "17.0.0");
    const transform = isLegacy ? "legacy" : "modern";
    okLog(
      `react, min version: ${reactVersion.version}. Transform: ${transform}`,
    );
    return {
      success: true,
      module: {
        transform,
        version: reactVersion.version,
      },
    };
  }

  errorLog("react");
  return { success: true, module: undefined };
}

async function detectTypescript(
  packageJson: PackageJson,
  dirs: Dirs,
  monorepoType?: "pnpm" | null,
): Promise<DetectionResult<TSModule>> {
  const typescriptVersion = getMinVersion(packageJson, "typescript", []);

  if (monorepoType != null && typescriptVersion) {
    return {
      success: false,
      error:
        `TypeScript found in package-level package.json for monorepo package "${packageJson.name}".\n` +
        `In monorepos, build tools like TypeScript should be defined in the workspace root package.json, not in individual packages.\n` +
        `Please move "typescript" from this package's dependencies/devDependencies to the root package.json's devDependencies.`,
    };
  }

  if (!typescriptVersion) {
    errorLog("typescript");
    return { success: true, module: undefined };
  }

  let ts: typeof import("typescript");
  try {
    // ts <=4.3 has no named exports. The all methods are located in the default export
    ts = (await import("typescript")).default;
  } catch {
    if (monorepoType === "pnpm") {
      return {
        success: false,
        error:
          'smartbundle found the .ts entrypoint but required "typescript" to build .d.ts files. ' +
          'Please install the "typescript" dependency. ' +
          "In pnpm workspaces, you may need to either:\n" +
          '1. Add "hoist-workspace-packages=true" to your pnpm-workspace.yaml file (recommended), or\n' +
          '2. Add "public-hoist-pattern[]=[\\"typescript\\"]" to your pnpm-workspace.yaml file, or\n' +
          '3. Add "typescript" as a devDependency in each package\'s package.json\n' +
          "See https://pnpm.io/settings#dependency-hoisting-settings for more details.",
      };
    } else {
      return {
        success: false,
        error:
          'smartbundle found the .ts entrypoint but required "typescript" to build .d.ts files. ' +
          'Please install the "typescript" dependency.',
      };
    }
  }

  okLog("typescript, version:", ts.version);

  const configFilePath = ts.findConfigFile(dirs.sourceDir, ts.sys.fileExists);
  if (!configFilePath) {
    return {
      success: false,
      error:
        "Cannot find a tsconfig.json file. You should declare it. Please, read the https://github.com/XaveScor/smartbundle/issues/131 for more information",
    };
  }
  const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);
  if (configFile.error) {
    const readableError = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      "\n",
    );
    return {
      success: false,
      error: `Cannot read tsconfig.json file, error: ${readableError}`,
    };
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    dirs.sourceDir,
    {
      declaration: true,
      emitDeclarationOnly: true,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      outDir: "",
      // https://github.com/XaveScor/bobrik/issues/22#issuecomment-2308552352
      noEmit: false,
    },
    configFilePath,
  );

  if (!parsedConfig.options.verbatimModuleSyntax) {
    return {
      success: false,
      error:
        "verbatimModuleSyntax should be enabled in tsconfig.json. Read https://github.com/XaveScor/smartbundle/issues/131 for more explanation.\n" +
        "You also can upvote the issue if you need the support of verbatimModuleSyntax: false in your library",
    };
  }

  const host = ts.createCompilerHost(parsedConfig.options);

  return {
    success: true,
    module: {
      ts,
      parsedConfig,
      host,
      version: ts.version,
    },
  };
}

export async function detectModules(
  packageJson: PackageJson,
  dirs: Dirs,
  monorepo?: Monorepo,
): Promise<DetectModulesResult> {
  if (!monorepo) {
    return detectPackageModules(packageJson, dirs);
  }

  // First, check if package has ts/babel (which is wrong in monorepo)
  const packageValidation = await detectPackageModules(
    packageJson,
    dirs,
    monorepo.type,
  );

  // Collect validation errors
  const errors: string[] = [];
  if (!packageValidation.success) {
    errors.push(...packageValidation.errors);
  } else {
    if (packageValidation.modules.ts) {
      errors.push(
        `Package "${packageJson.name}" has ts/babel in package.json, but it's not allowed in monorepo.`,
      );
    }
    if (packageValidation.modules.babel) {
      errors.push(
        `Package "${packageJson.name}" has babel in package.json, but it's not allowed in monorepo.`,
      );
    }
  }

  // Create merged package.json with workspace devDeps for ts/babel
  const mergedPackageJson: PackageJson = {
    ...packageJson,
    devDependencies: {
      ...monorepo.devDeps,
      ...packageJson.devDependencies,
    },
  };

  // Detect modules with merged package.json (ts/babel from workspace, react from package)
  const result = await detectPackageModules(mergedPackageJson, dirs);

  if (!result.success) {
    errors.push(...result.errors);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return result;
}

async function detectPackageModules(
  packageJson: PackageJson,
  dirs: Dirs,
  monorepoType?: "pnpm" | null,
): Promise<DetectModulesResult> {
  log("Detecting modules");

  const [tsResult, babelResult, reactResult] = await Promise.all([
    detectTypescript(packageJson, dirs, monorepoType),
    detectBabel(packageJson, monorepoType != null),
    detectReact(packageJson, monorepoType != null),
  ]);

  const errors: string[] = [];
  const modules: DetectedModules = {};

  if (!tsResult.success) {
    errors.push(tsResult.error);
  } else if (tsResult.module) {
    modules.ts = tsResult.module;
  }

  if (!babelResult.success) {
    errors.push(babelResult.error);
  } else if (babelResult.module) {
    modules.babel = babelResult.module;
  }

  if (!reactResult.success) {
    errors.push(reactResult.error);
  } else if (reactResult.module) {
    modules.react = reactResult.module;
  }

  lineLog();

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, modules };
}
