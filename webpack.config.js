var config = require('./configuration');

module.exports = {
  entry: config.files.docs.srcJS,
  output: {
    filename: config.files.docs.distJS
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }],
    postLoaders: [{
      loader: 'transform?envify'
    }]
  },
  resolve: {
    extensions: ['', '.js']
  }
};
