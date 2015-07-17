var config = require('./configuration');
var glob = require('glob');

module.exports = {
  entry: glob.sync(config.files.docs.srcJS),
  output: {
    filename: config.files.docs.distJS
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
