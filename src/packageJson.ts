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
  "cpu",
];

const requiredFields = ["exports", "name", "version", "private"];

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
  "cpu",
];
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

function createPathValidator(sourceDir: string) {
  return (path: string) => {
    const finalPath = join(sourceDir, path);
    return fileExists(finalPath);
  };
}

const PackageJsonNameField: string = "___NAME___";
function fillPackageJson(packageJson: PackageJson) {
  if (packageJson.bin) {
    const binName = packageJson.bin.get(PackageJsonNameField);
    if (binName) {
      packageJson.bin.set(packageJson.name, binName);
      packageJson.bin.delete(PackageJsonNameField);
    }
  }
}

function createPackageJsonSchema(sourceDir: string) {
  const pathValidator = createPathValidator(sourceDir);

  return z.object({
    exports: z
      .union(
        [
          z.string().transform((path) => new Map([[".", path]])),
          z.record(z.string()).transform((obj) => new Map(Object.entries(obj))),
        ],
        {
          errorMap() {
            return { message: errors.exportsRequired };
          },
        },
      )
      .refine(async (obj) => {
        for (const [key, value] of obj.entries()) {
          if (!(await pathValidator(value))) {
            return false;
          }
        }
        return true;
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
    bin: z
      .union(
        [
          z
            .string()
            .transform((value) => new Map([[PackageJsonNameField, value]])),
          z
            .record(z.string())
            .transform((record) => new Map(Object.entries(record))),
        ],
        {
          errorMap() {
            return { message: errors.binFiled };
          },
        },
      )
      .refine(
        async (map) => {
          for (const [key, value] of map.entries()) {
            if (!(await pathValidator(value))) {
              return false;
            }
          }
          return true;
        },
        { message: errors.binFiled },
      )
      .optional(),
    repository: z.any().optional(),
    keywords: z
      .array(z.string(), { message: errors.keywordsInvalid })
      .optional(),
    author: z.any().optional(),
    maintainers: z.any().optional(),
    contributors: z
      .array(
        z.union([
          z.string({ message: errors.contributorsInvalid }),
          z.object({}, { message: errors.contributorsInvalid }),
        ]),
      )
      .optional(),
    license: z.any().optional(),
    devDependencies: dependencies(errors.devDependenciesInvalid),
    peerDependencies: dependencies(errors.peerDependenciesInvalid),
    engines: z
      .record(z.string(), { message: errors.enginesInvalid })
      .optional(),
    browser: z
      .union([
        z.string({ message: errors.browserInvalid }),
        z.record(z.string(), { message: errors.browserInvalid }),
      ])
      .optional(),
    bugs: z.any().optional(),
    funding: z
      .union([
        z.string({ message: errors.fundingInvalid }),
        z.object({}, { message: errors.fundingInvalid }),
      ])
      .optional(),
    os: z.array(z.string(), { message: errors.osInvalid }).optional(),
    cpu: z.array(z.string(), { message: errors.cpuInvalid }).optional(),
    sideEffects: z.any().optional(),
    unpkg: z.any().optional(),
    homepage: z.any().optional(),
    babel: z.any().optional(),
    peerDependenciesMeta: z.any().optional(),
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

  fillPackageJson(packageJson.data);
  return packageJson.data;
}
