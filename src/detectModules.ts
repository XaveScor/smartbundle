import { type PackageJson } from "./packageJson.js";
import semver from "semver";
import { okLog, errorLog, log, lineLog } from "./log.js";

export type DetectedModules = {
  ts?: typeof import("typescript");
  babel?: typeof import("@babel/core");
  react?: "legacy" | "modern";
};

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
  const reactVersion =
    packageJson.dependencies?.react ??
    packageJson.devDependencies?.react ??
    packageJson.optionalDependencies?.react;
  if (reactVersion) {
    const minReactVersion = semver.minVersion(reactVersion);
    if (minReactVersion) {
      const isLegacy = semver.lt(minReactVersion, "17.0.0");
      const transform = isLegacy ? "legacy" : "modern";
      okLog(
        `react, min version: ${minReactVersion.version}. Transform: ${transform}`,
      );
      return transform;
    }
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
