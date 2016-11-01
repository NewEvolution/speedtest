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
      {test: /\.js$/, include: `${__dirname}/src`, loader: 'babel-loader'}
    ]
  },
  output: {
    filename: 'bundled.js',
    path: `${__dirname}/public`
  },
  plugins: [HtmlPluginConfig]
};
