'use strict';

const HtmlPlugin = require('html-webpack-plugin');
const HtmlPluginConfig = new HtmlPlugin({
  template: `${__dirname}/src/index.html`,
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/app.js'
  ],
  module: {
    loaders: [
      {
        test:   /\.scss$/,
        loaders: ['style', 'raw', 'sass'],
        include: `${__dirname}/scss`
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: `${__dirname}/src`
      }
    ]
  },
  output: {
    filename: 'bundled.js',
    path: `${__dirname}/public`
  },
  plugins: [HtmlPluginConfig]
};
