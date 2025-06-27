export const MESSAGE = "Hello from utils package!";

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export * from "./math.js";