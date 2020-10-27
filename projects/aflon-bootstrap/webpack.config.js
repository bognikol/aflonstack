module.exports = {
    mode: "development",
    entry: {
      main: "./src/index.ts",
      test: "./test/index.ts"
    }, 
    output: {
      filename: "[name].js"
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