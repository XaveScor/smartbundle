# React Integration

## Installation
Simply install `react` in your project, and you're all set to use it.

## Optimizations
- For `react@<17.0.0`, SmartBundle compiles JSX files into `React.createElement` calls.
- For `react@>=17.0.0`, SmartBundle compiles JSX files into `jsx/runtime` [calls](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).  
