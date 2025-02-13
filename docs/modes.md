# SmartBundle Modes

SmartBundle now supports two operation modes that determine how the tool behaves during a run. Each mode answers two main questions:
1. **What the mode is doing**
2. **What parameters (CLI options) it has**

## Bundle Mode

**What it does:**
- This mode corresponds to the current behavior of SmartBundle.
- It processes your source files, applies any necessary transformations (Babel, TypeScript, etc.), and bundles your code into the output directory.
- It generates an auto-generated package.json with the correct export mappings as needed.
- No publish or extra linking steps are performed in this mode.

**Parameters:**
- `--sourceDir`: Specifies the directory containing your source code.
- `--outputDir`: Specifies the directory where the bundled outputs will be placed.
- `--packagePath`: (Optional) Path to the project's package.json used during the build.
- `--verbose`: (Optional) Enables verbose logging of the bundling process.
- *(Other parameters defined in the CLI documentation that affect the build process can also be used.)*

### Example

Command:
```bash
smartbundle --sourceDir=./src --outputDir=./dist --verbose
```

Explanation:
- This command runs SmartBundle in bundle mode.
- It takes the source code from the `./src` directory, bundles it into the `./dist` directory, and provides verbose logging.
- No publish step is triggered because this is the standard build (bundle) mode.

## Release Mode

**What it does:**
- This mode includes everything from the Bundle Mode.
- Once the build is successfully completed, it automatically triggers a publish step (using npm or pnpm) to release the package.
- It ensures that only a successfully bundled package gets published to avoid accidental release of incomplete builds.

**Parameters:**
- All parameters from Bundle Mode are supported.
- `--publishCmd`: (Optional) Defines the command used for publishing (defaults to `npm publish` or `pnpm publish` depending on your project's configuration).
- `--access`: (Optional) Sets the access level (e.g., public or restricted) for the package when publishing.
- `--tag`: (Optional) Specifies a release tag such as `latest`, `beta`, etc.
- `--dryRun`: (Optional) Executes all steps up to publishing without actually sending your package to the registry.

### Example

Command:
```bash
smartbundle --sourceDir=./src --outputDir=./dist --publishCmd="npm publish" --tag=latest --dryRun
```

Explanation:
- This command runs SmartBundle in release mode.
- It first bundles the project (using the same parameters as in bundle mode).
- After a successful build, it will simulate a publish using `npm publish` under the tag `latest`.
- The `--dryRun` flag means the publish step will not actually push the package, allowing you to verify the process without releasing.
