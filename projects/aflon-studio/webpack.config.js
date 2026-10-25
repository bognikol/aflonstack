module.exports = {
    mode: "production",
    entry: "./src/index.js",
    experiments: { outputModule: true },
    output: {
        filename: "index.mjs",
        library: { type: "module" },
        clean: true
    }
};
