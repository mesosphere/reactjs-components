var config = require('./.build.config.js');
var glob = require('glob');

module.exports = {
  devtool: 'source-map',
  entry: glob.sync(config.files.docs.srcJS),
  output: {filename: config.files.docs.distJS},
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        plugins: ['transform-runtime'],
        presets: ['es2015', 'react']
      },
      test: /\.js$/
    }],
    postLoaders: [{
      loader: 'transform/cacheable?envify'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  watch: true
};
