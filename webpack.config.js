const path = require("path");

module.exports = {
  entry: {
    auth: path.join(__dirname, "./src/auth-server.ts"),
    resource: path.join(__dirname, './src/resource-server.ts'),
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
