import * as path from "node:path";

export default {
  entry: "./test.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(import.meta.dirname, "dist"),
  },
  resolve: {
    extensions: [".js"],
  },
  stats: "none",
  mode: "production",
};
