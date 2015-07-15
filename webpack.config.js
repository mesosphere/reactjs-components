var config = require('./configuration');

module.exports = {
  output: {
    filename: config.files.distJS
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
