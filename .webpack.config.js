var config = require('./.build.config.js');
var glob = require('glob');
var StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: config.files.docs.srcJS,
  output: {filename: config.files.docs.distJS},
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true
      },
      test: /\.js$/
    }],
    postLoaders: [{
      loader: 'transform/cacheable?envify'
    }]
  },
  plugins: [
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: '**/*.less',
      syntax: 'less'
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  watch: process.env.NODE_ENV === 'development'
};
