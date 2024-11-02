module.exports = {
  resolver: {
    extraNodeModules: {
      "test-lib": "/test-lib",
    },
  },
  reporter: { update: () => {} },
  watchFolders: ["/test-lib"],
};
