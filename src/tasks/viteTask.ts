import { build, type UserConfig, type Rollup } from "vite";
import { errors } from "../errors.js";
import { okLog } from "../log.js";
import { BuildError } from "../error.js";

type ViteTaskParams = {
  viteConfig: UserConfig;
};

type BuildSuccess = {
  error: false;
  output: Rollup.OutputChunk[];
};
type BuildErrorType = {
  error: true;
  errors: Array<string>;
};

type BuildResult = BuildSuccess | BuildErrorType;

export async function buildVite({
  viteConfig,
}: ViteTaskParams): Promise<BuildResult> {
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

export async function viteTask({ viteConfig }: ViteTaskParams) {
  const outputs = await buildVite({ viteConfig });
  if (outputs.error) {
    throw outputs.errors.map((e) => new BuildError(e));
  }

  okLog("Vite");
  return outputs.output;
}