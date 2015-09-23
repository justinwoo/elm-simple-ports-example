var webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: './build',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        loader: 'elm-simple-loader',
        test: /\.elm$/,
        exclude: /node_modules/
      }
    ]
  }
};
