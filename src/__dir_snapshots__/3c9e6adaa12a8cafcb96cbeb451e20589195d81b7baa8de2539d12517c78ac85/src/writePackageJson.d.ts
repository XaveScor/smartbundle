import { PackageJson } from "./packageJson.js";
export type ExportsObject = {
    mjs?: string;
    mdts?: string;
};
type BuildResult = {
    exportsMap: Map<string, ExportsObject>;
};
export declare function writePackageJson(outDir: string, parsed: PackageJson, { exportsMap }: BuildResult): Promise<void>;
export {};
