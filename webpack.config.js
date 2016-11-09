/**
 * Created by fed on 2016/11/8.
 */
const ug = require('webpack/lib/optimize/UglifyJsPlugin');
module.exports = {
  entry:  ['babel-polyfill', './src/index'],
  output: {
    path: './dist',
    publicPath: 'dist/',
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        loaders: ['file?name=[sha512:hash:base64:7].[ext]'],
      },
    ],
  },
  plugins: [
    new ug({
      minimize: true,
    }),
  ]
};
