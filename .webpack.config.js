var config = require("./.build.config.js");

module.exports = {
  devtool: "source-map",
  entry: config.files.docs.srcJS,
  output: { filename: config.files.docs.distJS, publicPath: "" },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          cacheDirectory: true
        },
        test: /\.js$/
      }
    ],
    postLoaders: [
      {
        loader: "transform/cacheable?envify"
      }
    ]
  },
  resolve: {
    extensions: ["", ".js"]
  },
  watch: process.env.NODE_ENV === "development"
};
