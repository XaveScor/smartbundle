import { type Dirs } from "./resolveDirs.js";
import { type PackageJson } from "./packageJson.js";
import { join, relative } from "node:path";
import { defineConfig } from "vite";

type CreateViteConfigParam = {
  dirs: Dirs;
  packageJson: PackageJson;
};

function mapToObject(map: Map<string, string>) {
  const obj: Record<string, string> = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

export function createViteConfig({ dirs, packageJson }: CreateViteConfigParam) {
  const { sourceDir, outDir } = dirs;

  const entrypoints = new Map<string, string>();
  if (packageJson.exports) {
    const mainEntry = join(sourceDir, packageJson.exports);
    entrypoints.set(".", mainEntry);
  }

  if (packageJson.bin) {
    const binEntry = join(sourceDir, packageJson.bin);
    entrypoints.set("__bin__", binEntry);
  }

  const viteConfig = defineConfig({
    publicDir: false,
    build: {
      outDir,
      write: true,
      minify: false,
      emptyOutDir: true,
      assetsInlineLimit: 0,
      terserOptions: {
        compress: false,
        mangle: false,
      },
      lib: {
        entry: mapToObject(entrypoints),
        formats: ["es", "cjs"],
        fileName: (format, entryName) => {
          const entrypoint = entrypoints.get(entryName);
          if (!entrypoint) {
            const noExt = entryName.replace(/\.[^.]+$/, "");
            return (
              "__do_not_import_directly__/" +
              noExt +
              (format === "es" ? ".js" : ".cjs")
            );
          }
          const relativePath = relative(sourceDir, entrypoint);
          const noExt = relativePath.replace(/\.[^.]+$/, "");
          if (format === "es") {
            return `${noExt}.js`;
          }
          if (format === "cjs") {
            return `${noExt}.cjs`;
          }
          return noExt;
        },
      },
      rollupOptions: {
        external: (id, parentId, isResolved) => {
          if (id === packageJson.name) {
            return true;
          }
          if (id.startsWith("node:")) {
            return true;
          }
          if (id in (packageJson.dependencies ?? {})) {
            return true;
          }
          if (id in (packageJson.optionalDependencies ?? {})) {
            return true;
          }
          return false;
        },
        output: {
          exports: "named",
          preserveModules: true,
        },
      },
    },
  });

  return { viteConfig, entrypoints };
}
