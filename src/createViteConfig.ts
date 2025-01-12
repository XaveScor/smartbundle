import { type Dirs } from "./resolveDirs.js";
import { type PackageJson } from "./packageJson.js";
import { join, relative } from "node:path";
import { defineConfig } from "vite";
import { babelPlugin } from "./plugins/babel/index.js";
import { reactPlugin } from "./plugins/react/index.js";
import { type DetectedModules } from "./detectModules.js";
import { importsPlugin } from "./plugins/imports/index.js";

type CreateViteConfigParam = {
  dirs: Dirs;
  packageJson: PackageJson;
  modules: DetectedModules;
  test?: boolean;
};

function mapToObject(map: Map<string, string>) {
  const obj: Record<string, string> = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

export function createViteConfig({
  dirs,
  packageJson,
  modules,
  test,
}: CreateViteConfigParam) {
  const { sourceDir, outDir, esmOutDir, cjsOutDir } = dirs;

  const entrypoints = new Map<string, string>();
  if (packageJson.exports) {
    for (const [key, value] of packageJson.exports) {
      const entry = join(sourceDir, value);
      entrypoints.set(key, entry);
    }
  }

  const bins = new Map<string, string>();
  if (packageJson.bin) {
    for (const [key, value] of packageJson.bin) {
      bins.set(key, join(sourceDir, value));
    }
  }

  const mergedEntries = new Map([...entrypoints, ...bins]);

  const esmRelativeOutPath = relative(outDir, esmOutDir);
  const cjsRelativeOutPath = relative(outDir, cjsOutDir);
  const viteConfig = defineConfig({
    plugins: [
      importsPlugin(packageJson, test),
      reactPlugin({ modules }),
      babelPlugin({ packageJson, dirs, modules }),
    ],
    publicDir: false,
    root: sourceDir,
    logLevel: "silent",
    build: {
      outDir,
      write: true,
      minify: false,
      emptyOutDir: false,
      sourcemap: true,
      assetsInlineLimit: 0,
      terserOptions: {
        compress: false,
        mangle: false,
      },
      lib: {
        entry: mapToObject(mergedEntries),
        formats: ["es", "cjs"],
        fileName: (format, entryName) => {
          const entrypoint = mergedEntries.get(entryName);
          if (!entrypoint) {
            const noExt = entryName.replace(/\.[^.]+$/, "");
            if (format === "es") {
              return join(esmRelativeOutPath, `${noExt}.mjs`);
            } else {
              return join(cjsRelativeOutPath, `${noExt}.js`);
            }
          }

          if (format === "es") {
            return join(
              esmRelativeOutPath,
              relative(sourceDir, entrypoint).replace(/\.[^.]+$/, "") + ".mjs",
            );
          } else {
            return join(
              cjsRelativeOutPath,
              relative(sourceDir, entrypoint).replace(/\.[^.]+$/, "") + ".js",
            );
          }
        },
      },
      rollupOptions: {
        output: {
          preserveModulesRoot: sourceDir,
          exports: "named",
          preserveModules: true,
        },
      },
    },
  });

  return { viteConfig, entrypoints, bins };
}
