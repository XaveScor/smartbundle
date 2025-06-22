export function log(message: string): void {
  console.log(`[LOG] ${message}`);
}

export function error(message: string): void {
  console.error(`[ERROR] ${message}`);
}

export const VERSION = "1.0.0";