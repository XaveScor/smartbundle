import fs from "node:fs/promises";

export const monorepoMarkFileName = ".smartbundle-monorepo";

export async function markDirAsMonorepo(path: string) {
  await fs.writeFile(`${path}/${monorepoMarkFileName}`, "");
}

export async function isMonorepo(path: string) {
  try {
    const stat = await fs.stat(`${path}/${monorepoMarkFileName}`);
    return stat.isFile();
  } catch (error) {
    return false;
  }
}
