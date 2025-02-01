# SmartBundle React Integration Guide

<!-- Table of Contents -->
- [Requirements & Setup](#requirements--setup)
- [React JSX Transformation](#react-jsx-transformation)
- [Example Package.json Configuration for React Projects](#example-packagejson-configuration-for-react-projects)

<!-- Overview -->
SmartBundle’s React Integration Guide explains how SmartBundle builds and optimizes your React applications by applying version-specific JSX transformations. This guide provides a step‐by‐step overview of required dependencies, setup instructions, and example package.json configurations for both application entry points and command-line scripts.

## Requirements & Setup

First, ensure your project has the React package installed:

```bash
npm install react
```

> [!INFO]
> Ensure you are using React **>= 16.8.0** to take full advantage of hooks and modern features.

(This step allows SmartBundle to automatically detect your React version.)

## React JSX Transformation

SmartBundle optimizes JSX compilation by applying different transformation strategies based on your React version.

### Transformation Modes

- **React version < 17.0.0:** JSX is compiled into `React.createElement` calls.
- **React version >= 17.0.0:** The new JSX runtime is used (see [new JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)).

### Rationale

SmartBundle selects the best JSX transformation method to ensure both performance and compatibility. The classic transform is used for older versions, while the new runtime (introduced in React 17) reduces bundle size and automatically imports JSX functions.

### Supported File Extensions

SmartBundle processes both the `.jsx` and `.tsx` extensions automatically. Use `.jsx` for JavaScript files containing JSX syntax, and prefer `.tsx` for TypeScript files so you also benefit from type checking.

> **Info:** Support for the `.tsx` extension is enabled only when your project has TypeScript configured. See the [TypeScript Integration Guide](./ts-guide.md) for details.

## Example Package.json Configuration for React Projects

For installation and build commands, please use fenced code blocks (e.g. using ```bash) to clearly highlight terminal commands.

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

