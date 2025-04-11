import type { PackageJson } from "../packageJson.js";

const monorepoPostfix = "-sbsources";
const monorepoPostfixRegex = new RegExp(`${monorepoPostfix}$`);

function walkOverMonorepoDepsToRemovePostfix(
  deps: Record<string, string> | undefined,
) {
  if (!deps) {
    return undefined;
  }

  const res: Record<string, string> = {};
  for (const [key, value] of Object.entries(deps)) {
    if (key.endsWith(monorepoPostfix)) {
      res[key.replace(monorepoPostfixRegex, "")] = value;
    } else {
      res[key] = value;
    }
  }
  return res;
}

const allDepsClauses = [
  "dependencies",
  "optionalDependencies",
  "peerDependencies",
  "devDependencies",
] as const;

export function convertPackageJson(packageJson: PackageJson) {
  if (packageJson.name.endsWith(monorepoPostfix)) {
    const originalName = packageJson.name;
    packageJson.name = packageJson.name.replace(monorepoPostfix, "");

    for (const depClause of allDepsClauses) {
      packageJson[depClause] = walkOverMonorepoDepsToRemovePostfix(
        packageJson[depClause],
      );
    }

    // add the sources to the devDeps to create a wire between source and dist
    packageJson.devDependencies = packageJson.devDependencies ?? {};
    packageJson.devDependencies[originalName] = "workspace:*";
  }

  return packageJson;
}
