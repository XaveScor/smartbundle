import type { Plugin } from "vite";
import { transformWithOxc } from "vite";
import { type DetectedModules } from "../../detectModules.js";
import { okLog } from "../../log.js";

type ReactPluginArg = {
  modules: DetectedModules;
};

const errorJsxMessage =
  "SmartBundle cannot find the react dependency inside dependencies, optionalDependencies or peerDependencies. Please, install it before bundling";

export function reactPlugin({ modules }: ReactPluginArg): Plugin {
  const pluginName = "smartbundle:react";
  const emittedWarnings = new Set<string>();

  if (modules.react == null) {
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

      const result = await transformWithOxc(
        code,
        id,
        {
          lang: isJs || isJsx ? "jsx" : "tsx",
          jsx: {
            runtime: modules.react === "legacy" ? "classic" : "automatic",
          },
          sourcemap: true,
        },
        this.getCombinedSourcemap(),
      );
      for (const warning of result.warnings) {
        const key = `${warning.code}\0${warning.message}`;
        if (!emittedWarnings.has(key)) {
          emittedWarnings.add(key);
          this.warn(warning);
        }
      }
      return {
        code: result.code,
        map: result.map,
        moduleType: "js",
      };
    },
    buildEnd(err) {
      if (!err) {
        okLog("React");
      } else {
        this.error(err);
      }
    },
  };
}
