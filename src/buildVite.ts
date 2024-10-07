import { build, UserConfig } from "vite";
import { errors } from "./errors.js";
import { Rollup } from "vite";

type BuildViteOptions = {
  viteConfig: UserConfig;
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

export async function buildVite({
  viteConfig,
}: BuildViteOptions): Promise<BuildResult> {
  const outputs = await build(viteConfig);
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
