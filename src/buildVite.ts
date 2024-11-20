import { build, type UserConfig, Rollup } from "vite";
import { errors } from "./errors.js";

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
  try {
    const outputs = await build(viteConfig);
    if (!Array.isArray(outputs)) {
      return {
        error: true,
        errors: [errors.rollupError],
      };
    }

    return {
      error: false,
      output: outputs.flatMap((x) =>
        x.output.filter((x) => x.type === "chunk"),
      ),
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: true,
        errors: [e.message],
      };
    }
  }
  return {
    error: true,
    errors: [errors.rollupError],
  };
}
