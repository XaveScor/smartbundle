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

function createExternalDepValidator(packageJson: PackageJson) {
  const allExternalPackages = new Set();
  for (const key of [
    "dependencies",
    "optionalDependencies",
    "peerDependencies",
  ] as const) {
    for (const dep of Object.keys(packageJson[key] ?? {})) {
      allExternalPackages.add(dep);
    }
  }
  allExternalPackages.add(packageJson.name);

  return (id: string) => {
    if (id.startsWith("node:")) {
      return true;
    }
    const segments = id.split("/");
    let current = "";
    for (const segment of segments) {
      current += segment;
      // import {} from "a/b/c/d"; case
      if (allExternalPackages.has(current)) {
        return true;
      }
      current += "/";
    }
    return false;
  };
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

  const depsValidator = createExternalDepValidator(packageJson);

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
        external: depsValidator,
        output: {
          exports: "named",
          preserveModules: true,
        },
      },
    },
  });

  return { viteConfig, entrypoints };
}
