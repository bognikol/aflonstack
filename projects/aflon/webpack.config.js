module.exports = {
    entry: "./src/index.ts", 
    output: {
      filename: "index.js",
      library: "aflon",
      libraryTarget: "amd"
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"],
    },
    module: {
      rules: [
        // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
        { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
      ],
    },
  };