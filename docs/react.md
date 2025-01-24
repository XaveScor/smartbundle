# SmartBundle React Integration Guide

<!-- Table of Contents -->
- [Requirements & Setup](#requirements--setup)
- [React JSX Transformation](#react-jsx-transformation)
- [Example Package.json Configuration for React Projects](#example-packagejson-configuration-for-react-projects)

<!-- Overview -->
SmartBundle’s React Integration Guide explains how SmartBundle builds and optimizes your React applications by applying version-specific JSX transformations. This guide provides a step‐by‐step overview of required dependencies, setup instructions, and example package.json configurations for both application entry points and command-line scripts.

## Requirements & Setup

First, ensure your project has the React package installed:

```shell
npm install react
```

It is recommended to use React **>= 16.8.0** to take advantage of hooks and other modern features.

(This step allows SmartBundle to automatically detect your React version.)

## React JSX Transformation

SmartBundle optimizes JSX compilation by applying different transformation strategies based on your React version.

### Transformation Modes

- **React < 17.0.0:** Compiles JSX files into calls to `React.createElement`.
- **React >= 17.0.0:** Uses the new JSX runtime (see [new JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)).

### Rationale

SmartBundle selects the best JSX transformation method to ensure both performance and compatibility. The classic transform is used for older versions, while the new runtime (introduced in React 17) reduces bundle size and automatically imports JSX functions.

### Supported File Extensions

SmartBundle processes both the `.jsx` and `.tsx` extensions automatically. Use `.jsx` for JavaScript files containing JSX syntax, and prefer `.tsx` for TypeScript files so you also benefit from type checking.

**Note:** Support for the `.tsx` extension is available only when TS mode is enabled in your project. For more details, see the [TypeScript Integration Guide](./ts-guide.md).

## Example Package.json Configuration for React Projects

Below is a sample configuration. SmartBundle auto-detects React and applies the correct JSX transformation, so your package.json setup remains straightforward:

```json
{
  "dependencies": {
    "react": "^17.0.0"
  },
  "exports": "./src/index.js",
  "bin": {
    "my-react-app": "./src/cli.js"
  }
}
```

In this example, using React 17 triggers the new JSX runtime.
