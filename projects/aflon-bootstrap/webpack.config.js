module.exports = {
    mode: "development",
    entry: {
      main: "./temp/js/src/index.js",
      test: "./temp/js/test/index.js"
    }, 
    output: {
      filename: "[name].js"
    },
    resolve: {
      extensions: [".js", ".json"],
    },
  };