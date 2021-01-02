const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "commonjs2",
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        react: "commonjs react",
        "prop-types": "commonjs prop-types",
        lodash: "commonjs lodash",
        "styled-components": "commonjs styled-components",
    },
    devtool: "cheap-source-map",
};
