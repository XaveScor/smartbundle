import { type PackageJson } from "./packageJson.js";
import semver from "semver";
import { okLog, errorLog, log, lineLog, warnLog } from "./log.js";

export type DetectedModules = {
  ts?: typeof import("typescript");
  babel?: typeof import("@babel/core");
  react?: "legacy" | "modern";
};

type DepType =
  | "dependencies"
  | "devDependencies"
  | "peerDependencies"
  | "optionalDependencies";
function getMinVersion(
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

export async function detectModules(
  packageJson: PackageJson,
): Promise<DetectedModules> {
  const result: DetectedModules = {};
  log("Detecting modules");
  try {
    // ts <=4.3 has no named exports. The all methods is located in the default export
    result.ts = (await import("typescript")).default;
    okLog("typescript, version:", result.ts.version);
  } catch {
    errorLog("typescript");
  }

  result.babel = await detectBabel(packageJson);
  result.react = await detectReact(packageJson);

  lineLog();
  return result;
}
