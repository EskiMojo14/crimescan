/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index_bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: "pre",
        use: [
          {
            options: {
              eslintPath: require.resolve("eslint"),
            },
            loader: require.resolve("eslint-loader"),
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: ["ts-loader", "eslint-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(js)$/,
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "src/"),
      "@c": path.resolve(__dirname, "src/components/"),
      "@s": path.resolve(__dirname, "src/app/slices/"),
      "@h": path.resolve(__dirname, "src/app/hooks/"),
      "@m": path.resolve(__dirname, "src/media/"),
    },
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "public/favicon.ico",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: "./public/",
          from: "*.{ico,png,json}",
          to: ".",
        },
      ],
    }),
    new Dotenv({ path: path.resolve(__dirname, "apiKeys.env") }),
  ],
};

// typescript: https://webpack.js.org/guides/typescript/
// sass: https://webpack.js.org/loaders/sass-loader/
