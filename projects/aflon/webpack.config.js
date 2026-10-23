module.exports = {
    entry: "./temp/js/index.js",
    output: {
      filename: "index.js",
      library: "aflon",
      libraryTarget: "amd"
    },
    resolve: {
      extensions: [".js", ".json"],
    },
  };