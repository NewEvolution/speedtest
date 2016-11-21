'use strict';

const HtmlPlugin = require('html-webpack-plugin'),
      HtmlPluginConfig = new HtmlPlugin({
        template: `${__dirname}/src/index.html`,
        filename: 'index.html',
        inject: 'body'
      });

module.exports = {
  entry: [
    'whatwg-fetch',
    './src/app.jsx'
  ],
  module: {
    loaders: [
      {
        test:   /\.scss$/,
        loaders: ['style', 'raw', 'sass'],
        include: `${__dirname}/scss`
      },
      {
        test: /\.jsx$/,
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
