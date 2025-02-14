# SmartBundle CLI Commands

SmartBundle provides two main commands: `build` for creating distributable packages and `release` for bundling and publishing them. Each command is designed to streamline your workflow.

## Build Command

### Overview
The `build` command performs the following steps:

- **Transforms your source files:** Applies necessary transformations (e.g., Babel, TypeScript) and bundles them into the output directory.
- **Generates package metadata:** Automatically creates a package.json with accurate export mappings.
- **Build-only workflow:** This command strictly builds your package, without triggering any publish steps.

### Optional Parameters
- `--sourceDir`: Directory containing your source code
- `--outputDir`: Directory where bundled files will be placed
- `--packagePath`: Path to the project's package.json (defaults to sourceDir/package.json)
- `--verbose`: Enables verbose logging during bundling

### Example

```bash
smartbundle build --sourceDir=./src --outputDir=./dist
```

This command:
- Takes source code from `./src`
- Outputs the bundled files to `./dist`
- Creates a distribution-ready package

## Release Command

### Overview
The `release` command extends the build process by automatically publishing your package. Key features:

- **Complete build and publish workflow:** First bundles your project, then publishes it
- **Safe publishing:** Only successfully built packages are published
- **Automatic output management:** Creates and cleans up temporary build directories
- **Package manager integration:** Automatically detects and uses npm or pnpm

### Optional Parameters
- The all from the build command, plus:
- Additional npm/pnpm publish flags can be passed after `--`

> [!IMPORTANT]
> We recommend do not use the `--outputDir` parameter with the release command. SmartBundle automatically manages temporary build directories during the release process.
> If you provide it, smartbundle bundles your project into the specified directory and avoids the automatic cleanup.

### Example

```bash
smartbundle release --sourceDir=./src -- --access public
```

This command:
1. Builds your package from `./src` into a temporary directory
2. Runs `npm publish` or `pnpm publish` with the `--access public` flag
3. Cleans up the temporary directory after successful publishing

> [!TIP]
> To test the release process without publishing, add `--dry-run` anywhere. Smartbundle can manage it:
> ```bash
> smartbundle release --sourceDir=./src -- --dry-run
> ```
> or
> ```bash
> smartbundle release --dry-run --sourceDir=./src
> ```
