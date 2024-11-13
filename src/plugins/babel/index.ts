import { type Plugin } from "vite";
import * as path from "node:path";
import { findBabelConfig } from "./findBabelConfig.js";
import { type PackageJson } from "../../packageJson.js";
import { type Dirs } from "../../resolveDirs.js";

type BabelPluginOptions = {
  packageJson: PackageJson;
  dirs: Dirs;
};

export function babelPlugin({ packageJson, dirs }: BabelPluginOptions): Plugin {
  let babelCore: typeof import("@babel/core") | undefined;
  let hasBabelConfig = false;

  return {
    name: "smartbundle:babel",
    async buildStart() {
      try {
        if (!("@babel/core" in (packageJson.optionalDependencies ?? {}))) {
          babelCore = await import("@babel/core");
        }
      } catch (e) {
        console.error(e);
        // Leave babelCore as undefined
      }

      hasBabelConfig = await findBabelConfig(dirs.sourceDir, packageJson);
      if (babelCore && !hasBabelConfig) {
        this.warn(
          "We have found a @babel/core package, but config was not found. It could be a bug",
        );
      } else if (!babelCore && hasBabelConfig) {
        this.error(
          new Error(
            "We have found a babel config. Please install @babel/core to devDeps or remove the config file",
          ),
        );
      }
    },
    async transform(code, id) {
      if (!babelCore || !hasBabelConfig) {
        return null;
      }

      const extname = path.extname(id);
      if (![".js", ".ts"].includes(extname)) {
        return null;
      }

      const map = this.getCombinedSourcemap();

      const result = await babelCore.transformAsync(code, {
        filename: id,
        sourceMaps: true,
        inputSourceMap: map,
      });

      if (!result?.code) {
        throw new Error("Babel transformation failed");
      }

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}
