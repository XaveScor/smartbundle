# SmartBundle - zero-config bundler for npm packages

## How to use
1) Create package.json like
```json
{
  "name": "my-package",
  "version": "1.0.0",
  "private": true, // required for avoiding the accidental publishing
  "type": "module",
  "exports": {
    ".": "./src/index.ts" // entrypoint list for building the package
  }
}
```
2) Run
```bash
npx smartbundle
```
3) Go to the `dist` folder and publish your package to the npm registry. The total package.json will be generated automatically.

## Supported targets:
- Bun 1+

## Features
- generate the most compatible package.json for any bundlers(webpack, rollup, esbuild, vite, etc) or runtimes(node, bun, deno, etc)
- validate package.json for common errors
- do not require any configuration files like tsconfig.json, eslintrc.json, etc
- but if you need to use them, you can use them by creating them manually like for the parcel bundler
- generate esm and cjs entrypoints for the package
- generate typescript typings for the package
- require only minimal package.json fields

## Known issues:
  - does not generate fully compatible cjs typings for the entrypoints (#9)
  - supports only `type: module` right now. It will be fixed before `v1.0.0` release.

## Motivation

Almost every npm package have the same build pipeline: build code, generate typescript typings, validate package.json, generate correct package.json for the bundlers and runtimes, blah-blah, etc.

I really like the [microbundle](https://github.com/developit/microbundle) project, but it requires a lot of extra configuration and is not zero-config. And more, the project is not maintained and does not support a lot of modern js features.

So I decided to create my own project to automate the build pipeline and save the developer's time for building packages.
