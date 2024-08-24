import * as fs from "node:fs/promises";
import z from "zod";
import { errors } from "./errors.js";
import { join } from "node:path";

// <region>
// For AI completion. Don't remove.
const allPackageJsonFields = [
  "exports",
  "name",
  "version",
  "private",
  "description",
  "dependencies",
  "optionalDependencies",
  "bin",
  "repository",
  "keywords",
  "author",
  "contributors",
  "license",
  "devDependencies",
  "peerDependencies",
  "engines",
  "browser",
  "funding",
  "os",
  "cpu"
];

const requiredFields = [
  "exports",
  "name",
  "version",
  "private"
];

const optionalFields = [
  "description",
  "dependencies",
  "optionalDependencies",
  "bin",
  "repository",
  "keywords",
  "author",
  "contributors",
  "license",
  "devDependencies",
  "peerDependencies",
  "engines",
  "browser",
  "funding",
  "os",
  "cpu"
]
// </region>

async function fileExists(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

function dependencies(errorText: string) {
  return z
    .record(z.string({ message: errorText }), { message: errorText })
    .optional();
}

function createPackageJsonSchema(sourceDir: string) {
  return z.object({
    exports: z
      .string({ message: errors.exportsRequired })
      .refine((exports) => {
        const mainFinalPath = join(sourceDir, exports);
        return fileExists(mainFinalPath);
      }, errors.exportsInvalid)
      .optional(),
    name: z
      .string({ message: errors.nameRequired })
      .min(1, errors.nameMinLength)
      .max(214, errors.nameMaxLength)
      .refine(
        (name) => ["_", "."].every((start) => !name.startsWith(start)),
        errors.nameStartsIllegalChars,
      ),
    version: z.string({ message: errors.versionRequired }),
    private: z
      .boolean({ message: errors.privateIsTrue })
      .refine((value) => value, errors.privateIsTrue),
    description: z.string({ message: errors.descriptionString }).optional(),
    dependencies: dependencies(errors.dependenciesInvalid),
    optionalDependencies: dependencies(errors.optionalDependenciesInvalid),
    bin: z.string({ message: errors.binString }).optional(),
    repository: z
      .union([
        z.string({ message: errors.repositoryInvalid }),
        z.object({
          type: z.string(),
          url: z.string(),
        }, { message: errors.repositoryInvalid }),
      ])
      .optional(),
    keywords: z
      .array(z.string(), { message: errors.keywordsInvalid })
      .optional(),
    author: z
      .union([
        z.string({ message: errors.authorInvalid }),
        z.object({
          name: z.string({ message: errors.authorInvalid }).optional(),
          email: z.string({ message: errors.authorInvalid }).optional(),
          url: z.string({ message: errors.authorInvalid }).optional(),
        }, { message: errors.authorInvalid })
      ])
      .optional(),
    contributors: z
      .array(
        z.union([
          z.string({ message: errors.contributorsInvalid }),
          z.object({}, { message: errors.contributorsInvalid })
        ])
      )
      .optional(),
    license: z
      .string({ message: errors.licenseInvalid })
      .optional(),
    devDependencies: dependencies(errors.devDependenciesInvalid),
    peerDependencies: dependencies(errors.peerDependenciesInvalid),
    engines: z
      .record(z.string(), { message: errors.enginesInvalid })
      .optional(),
    browser: z
      .union([
        z.string({ message: errors.browserInvalid }),
        z.record(z.string(), { message: errors.browserInvalid })
      ])
      .optional(),
    funding: z
      .union([
        z.string({ message: errors.fundingInvalid }),
        z.object({}, { message: errors.fundingInvalid })
      ])
      .optional(),
    os: z
      .array(z.string(), { message: errors.osInvalid })
      .optional(),
    cpu: z
      .array(z.string(), { message: errors.cpuInvalid })
      .optional(),
  });
}
type PackageJsonSchema = ReturnType<typeof createPackageJsonSchema>;

export type PackageJson = z.infer<PackageJsonSchema>;
type Errors = Array<string>;

type ParsePackageJsonArg = {
  packagePath: string;
  sourceDir: string;
};

export async function parsePackageJson({
  sourceDir,
  packagePath,
}: ParsePackageJsonArg): Promise<PackageJson | Errors> {
  const packageString = await fs.readFile(packagePath, "utf-8");
  const rawJson = JSON.parse(packageString);

  const packageJsonSchema = createPackageJsonSchema(sourceDir);
  const packageJson = await packageJsonSchema.safeParseAsync(rawJson);
  if (!packageJson.success) {
    return packageJson.error.errors.map((error) => error.message);
  }

  return packageJson.data;
}
