module.exports = {
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
