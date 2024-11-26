let logEnabled = true;
export function disableLog() {
  logEnabled = false;
}

export function log(...messages: Array<string>) {
  if (logEnabled) {
    console.log(...messages);
  }
}
export function warnLog(...messages: Array<string>) {
  if (logEnabled) {
    console.warn(...messages);
  }
}

export function okLog(...messages: Array<string>) {
  log(`✅ ${messages.join(" ")}`);
}
export function errorLog(...messages: Array<string>) {
  log(`❌ ${messages.join(" ")}`);
}
export function lineLog() {
  log("=".repeat(40));
}
