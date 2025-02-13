# SmartBundle Modes
## Bundle Mode

**What it does:**
- It processes your source files, applies any necessary transformations (Babel, TypeScript, etc.), and bundles your code into the output directory.
- It generates an auto-generated package.json with the correct export mappings as needed.
- No publish or extra linking steps are performed in this mode.

**Parameters:**
- `--sourceDir`: (Optional) Specifies the directory containing your source code.
- `--outputDir`: (Optional) Specifies the directory where the bundled outputs will be placed.
- `--packagePath`: (Optional) Path to the project's package.json used during the build.
- `--verbose`: (Optional) Enables verbose logging of the bundling process.
- *(Other parameters defined in the CLI documentation that affect the build process can also be used.)*

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

**What it does:**
- This mode includes everything from the Bundle Mode.
- Once the build is successfully completed, it automatically triggers a publish step (using npm or pnpm) to release the package.
- It ensures that only a successfully bundled package gets published to avoid accidental release of incomplete builds.
- Automatically detects the package manager (npm or pnpm) based on the project's lock file. `package-lock.json` for npm and `pnpm-lock.yaml` for pnpm.

**Parameters:**
- All parameters from Bundle Mode are supported.
- `--dry-run`: (Optional) Simulates the publish step without actually pushing the package. Also, you can see what command do we call to publish the package.
- You can pass the additional params after `--`. It will be passed to the publish command directly.
> [!TIP]
> You can pass `--dry-run` after the `--` safely. Smartbundle can handle this situation and pass dry-run as you can expect.

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
