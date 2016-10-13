'use strict';
/* eslint no-magic-numbers: 0, no-console: 0 */

const express = require('express');
const app = express();

const path = require('path');
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public/styles'),
  prefix: '/styles',
  outputStye: 'compressed',
  indentedSyntax: true,
  sourceMap: true
}));

const routes = require('./routes/')
app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;

const MONGODB_AUTH = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : '';

const MONGODB_URL = `mongodb://${MONGODB_AUTH}${MONGODB_HOST}:${MONGODB_PORT}/speedtest`;

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL);

const PORT = process.env.PORT || 3000;
mongoose.connection.on('open', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`Node.js server started. listening on port ${PORT}`);
  });
});

module.exports = app;
