# SmartBundle TypeScript Integration Guide


<!-- Table of Contents -->
- [Requirements & Setup](#requirements--setup)
- [TypeScript Configuration: verbatimModuleSyntax](#typescript-configuration-verbatimmodulesyntax)
- [Example Package.json Configuration for TypeScript Projects](#example-packagejson-configuration-for-typescript-projects)
  - [Bin Field Example](#bin-field-example)
  - [Exports Field Example](#exports-field-example)


This guide explains how SmartBundle integrates with TypeScript to produce consistent and reliable builds. SmartBundle supports projects using TypeScript (v5.0 and above) by requiring a specific TS configuration and by extending package.json semantics. In addition to outlining how to install and configure TypeScript, this guide explains how fields such as bin and exports are interpreted—similar to our JavaScript workflows but with TS-aware adjustments.

For detailed information on how SmartBundle extends package.json semantics, refer to our [package.json guide](./package-json.md).


## Requirements & Setup

- Minimum TypeScript version: **>= 5.0**.  
- To enable TypeScript support in your project, simply install TypeScript:

```bash
npm install --save-dev typescript
```

SmartBundle detects and uses the locally installed TypeScript.

## TypeScript Configuration: verbatimModuleSyntax

SmartBundle requires that the TypeScript compilation option **"verbatimModuleSyntax": true** be enabled. This setting ensures that the module syntax (ESM import/export statements) is preserved verbatim in the output. Preserving the original module structure is essential because SmartBundle relies on these exact syntaxes to correctly generate package exports and process bin entries for your project.

### Rationale

Enabling `"verbatimModuleSyntax": true` ensures that the original ES module import/export syntax is maintained throughout the build process. This is essential because SmartBundle analyzes the source code to correctly generate package exports and executable scripts, avoiding any side effects caused by module system transformations.

> [!TIP]  
> If you haven't already, update your tsconfig.json to include `"verbatimModuleSyntax": true` to preserve ESM import/export syntax for proper export generation.  

To enable this option, update your tsconfig.json:

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true,
    // ...other options
  }
}
```

## Example Package.json Configuration for TypeScript Projects

Note: The configurations shown below are analogous to those used in JavaScript projects. The only differences are that entry files are in TypeScript (e.g. `bin.ts` or `index.ts`).

### Bin Field Example

If your package defines command-line scripts:

```json
{
  "bin": {
    "my-command": "./src/bin.ts"
  }
}
```

For more details on how to configure the bin field, see the [Bin Field](./package-json.md#bin-field) section in our package.json guide.

### Exports Field Example

The exports field defines your package's entry points:

```json
{
  "exports": "./src/index.ts"
}
```

For more details on how the exports field is processed, refer to the [Exports](./package-json.md#exports) section in our package.json guide.

These configurations work similarly to JavaScript setups, allowing SmartBundle to process and bundle your TypeScript sources correctly.

### Mixing TS and JS Entry Points

It is possible to mix both TypeScript and JavaScript entrypoints within your package.json. This allows you to maintain TS-based entry points (which include type definitions) alongside legacy or selectively provided JavaScript entry points. Note that JavaScript entrypoints do not have associated type definitions, so consumers will not benefit from TypeScript type checking when importing them.

For TypeScript React projects, see our [React Integration Guide](./react.md).

#### Example Combining Both Entry Types

```json
{
  "exports": {
    ".": "./sb-dist/index.ts",
    "./legacy": "./src/legacy-entry.js"
  },
  "bin": {
    "my-command": "./src/bin.ts",
    "old-command": "./scripts/old-command.js"
  }
}
```

This configuration demonstrates:
- Main entry point (`"."`) uses TypeScript:
  - SmartBundle compiles the TypeScript file
  - Type definitions are automatically generated
- Legacy entry (`./legacy`) uses JavaScript only:
  - No type definitions are generated for this entry
  - Consumers won't get TypeScript support when importing this path
- Bin commands support both formats:
  - TypeScript-based command (`my-command`)
  - JavaScript-based command (`old-command`)

## Related Documentation

- [Package.json Configuration Guide](./package-json.md)
- [React Integration Guide](./react.md)
- [Monorepo Support Guide](./monorepo.md)
