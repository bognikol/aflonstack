module.exports = {
    mode: "production",
    entry: "./temp/js/index.js",
    experiments: { outputModule: true },
    output: {
      filename: "index.mjs",
      library: { type: "module" },
      clean: true
    },
    resolve: {
      extensions: [".js", ".json"],
    },
  };