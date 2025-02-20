# SmartBundle CLI Commands

SmartBundle provides two main commands:
- `smartbundle build` for creating distributable packages
- `smartbundle release` for building and publishing your package

Each command is designed to streamline your workflow. Please ensure you explicitly specify the desired command.

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
The `release` command extends the build process by automatically publishing your package. It supports all parameters allowed in the build command, including `--outputDir`. In release mode:

- **Complete build and publish workflow:** Your package is first bundled and then published.
- **Output Directory Flexibility:** If you do not supply `--outputDir`, SmartBundle will create a temporary output directory that is automatically cleaned up after publishing. However, if you specify an output directory, SmartBundle will use it and **retain its contents** so you can inspect or reuse the build artifacts.
- **Safe publishing:** Publishing is attempted only if the build succeeds.
- **Package manager integration:** The process automatically detects and invokes npm (or pnpm) with any extra publish flags.

### Optional Parameters

The `release` command accepts all parameters available in build mode, including:
- `--sourceDir`: Directory containing your source code
- `--packagePath`: Path to the project's package.json (defaults to sourceDir/package.json)
- `--outputDir`: If provided, the build will use this directory. Otherwise, a temporary directory is automatically created. Note that when using a temporary directory, it will be cleaned up after publishing.
- Any additional npm/pnpm publish flags passed after `--`

> [!IMPORTANT]
> We recommend do not use the `--outputDir` parameter with the release command. SmartBundle automatically manages temporary build directories during the release process.
> If you provide it, smartbundle bundles your project into the specified directory and avoids the automatic cleanup.

### Example

```bash
smartbundle release --sourceDir=./src -- --access public
```

This command:
- Builds your package from `./src`. If you do not provide `--outputDir`, a temporary directory is created and used (and later cleaned up). If `--outputDir` is specified, SmartBundle uses that directory without automatic cleanup.
- Runs `npm publish` or `pnpm publish` with the `--access public` flag.

> [!TIP]
> To test the release process without publishing, add `--dry-run` anywhere. Smartbundle can manage it:
> ```bash
> smartbundle release --sourceDir=./src -- --dry-run
> ```
> or
> ```bash
> smartbundle release --dry-run --sourceDir=./src
> ```
