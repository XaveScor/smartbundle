import z from "zod";
declare function createPackageJsonSchema(sourceDir: string): z.ZodObject<{
    exports: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    name: z.ZodEffects<z.ZodString, string, string>;
    version: z.ZodString;
    private: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    description: z.ZodOptional<z.ZodString>;
    dependencies: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    bin: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    private: boolean;
    exports?: string | undefined;
    description?: string | undefined;
    dependencies?: Record<string, string> | undefined;
    bin?: string | undefined;
}, {
    name: string;
    version: string;
    private: boolean;
    exports?: string | undefined;
    description?: string | undefined;
    dependencies?: Record<string, string> | undefined;
    bin?: string | undefined;
}>;
type PackageJsonSchema = ReturnType<typeof createPackageJsonSchema>;
export type PackageJson = z.infer<PackageJsonSchema>;
type Errors = Array<string>;
type ParsePackageJsonArg = {
    packagePath: string;
    sourceDir: string;
};
export declare function parsePackageJson({ sourceDir, packagePath, }: ParsePackageJsonArg): Promise<PackageJson | Errors>;
export {};
