import { type Plugin, transformWithEsbuild } from "vite";
import type { PackageJson } from "../../packageJson.js";
import semver from "semver";

type ReactPluginArg = {
  packageJson: PackageJson;
};

const errorJsxMessage =
  "SmartBundle cannot find the react dependency inside dependencies, optionalDependencies or peerDependencies. Please, install it before bundling";

export function reactPlugin({ packageJson }: ReactPluginArg): Plugin {
  const pluginName = "smartbundle:react";

  const reactVersion =
    packageJson.dependencies?.react ??
    packageJson.devDependencies?.react ??
    packageJson.optionalDependencies?.react;

  if (!reactVersion) {
    return {
      name: pluginName,
      transform(code, id) {
        if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
          this.error(new Error(errorJsxMessage));
        }
      },
      buildEnd(err) {
        if (err) {
          const isJsxError = err.message.includes("JSX");
          if (isJsxError) {
            this.error(new Error(errorJsxMessage));
          }
        }
      },
    };
  }

  const isLegacyTransform = semver.lt(
    semver.minVersion(reactVersion)!,
    "17.0.0",
  );

  return {
    name: pluginName,
    enforce: "pre",
    async transform(code, id) {
      const isJs = id.endsWith(".js");
      const isJsx = id.endsWith(".jsx");
      const isTsx = id.endsWith(".tsx");
      if (!(isJs || isJsx || isTsx)) {
        return null;
      }

      return await transformWithEsbuild(
        code,
        id,
        {
          loader: isJs || isJsx ? "jsx" : "tsx",
          jsx: isLegacyTransform ? "transform" : "automatic",
          sourcemap: true,
        },
        this.getCombinedSourcemap(),
      );
    },
  };
}
