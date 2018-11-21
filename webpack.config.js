const path = require("path");

module.exports = {
  entry: {
    worker1: path.join(__dirname, "./src/index.ts"),
    worker2: path.join(__dirname, './src/token.ts'),
  },

  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },
 mode:"production",
  // mode: process.env.NODE_ENV || "development",

  watchOptions: {
    ignored: /node_modules|dist|\.js/g
  },

  devtool: "none",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    plugins: [],
    alias: {
      joi: "joi-browser"
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  }
};
