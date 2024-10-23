const path = require("node:path");

module.exports = {
  entry: "./test.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js"],
  },
  stats: 'minimal',
  mode: "production",
};
