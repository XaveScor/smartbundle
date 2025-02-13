# SmartBundle Modes
SmartBundle supports two primary modes: **Bundle Mode** for building your project and **Release Mode** for publishing it. Each mode is designed to streamline your workflow.
## Bundle Mode

### Overview
In Bundle Mode, SmartBundle performs the following steps:

- **Transforms your source files:** Applies necessary transformations (e.g., Babel, TypeScript) and bundles them into the output directory.
- **Generates package metadata:** Automatically creates a package.json with accurate export mappings.
- **Build-only workflow:** This mode strictly builds your package, without triggering any publish steps.

### Parameters
- `--sourceDir`: (Optional) Directory containing your source code.
- `--outputDir`: (Optional) Directory where bundled files are placed.
- `--packagePath`: (Optional) Path to the project's package.json used in the build.
- `--verbose`: (Optional) Enables verbose logging during bundling.
- *(Additional parameters from the CLI documentation are also supported.)*

### Example

Command:
```bash
smartbundle build --sourceDir=. --outputDir=./dist --verbose
```

Explanation:
- This command runs SmartBundle in bundle mode.
- It takes the source code from the `.` directory, bundles it into the `./dist` directory, and provides verbose logging.
- No publish step is triggered because this is the standard build (bundle) mode.

## Release Mode

### Overview
Release Mode extends Bundle Mode by automatically publishing your package after a successful build. Key points include:

- **Complete build and publish workflow:** First bundles your project, then triggers the publish step using either npm or pnpm.
- **Safe publishing:** Only successfully built packages are published, preventing incomplete releases.
- **Automatic package manager detection:** Uses `package-lock.json` for npm and `pnpm-lock.yaml` for pnpm.

### Parameters
Inherits all parameters from Bundle Mode, with the following addition:

- `--dry-run`: (Optional) Simulates the publish step without actually pushing the package, letting you preview the publish command.
- Any extra parameters provided after `--` will be passed directly to the publish command.

> [!TIP]
> `--dry-run` can be safely used after `--`. SmartBundle will propagate this flag to the publish command correctly.

### Example

Command:
```bash
smartbundle publish --dry-run -- --otp=<otp code for npm>
```
> [!TIP]
> We recommend to avoid passing the `--outputDir` parameter in release mode. The output directory is automatically set to /tmp/<random> for the publish step.
> After successful publish, the output directory is deleted.
> If you provide the `--outputDir` parameter, the output directory will not be deleted after the publish step.

Explanation:
- This command runs SmartBundle in release mode.
- It first bundles the project (using the same parameters as in bundle mode).
- After a successful build, it will simulate a publish using `npm publish` or `pnpm publish` under the tag `latest`.
