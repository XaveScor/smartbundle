import { build } from "vite";
import { relative } from "node:path";
import { PackageJson } from "./packageJson.js";
import { errors } from "./errors.js";
import { Rollup } from "vite";

type BuildViteOptions = {
  sourceDir: string;
  packageJson: PackageJson;
  entrypoints: Map<string, string>;
  outDir: string;
};

type BuildSuccess = {
  error: false;
  output: Rollup.OutputChunk[];
};
type BuildError = {
  error: true;
  errors: Array<string>;
};

type BuildResult = BuildSuccess | BuildError;

function mapToObject(map: Map<string, string>) {
  const obj: Record<string, string> = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

export async function buildVite({
  entrypoints,
  packageJson,
  sourceDir,
  outDir,
}: BuildViteOptions): Promise<BuildResult> {
  const outputs = await build({
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
  if (!Array.isArray(outputs)) {
    return {
      error: true,
      errors: [errors.rollupError],
    };
  }

  return {
    error: false,
    output: outputs.flatMap((x) => x.output.filter((x) => x.type === "chunk")),
  };
}
