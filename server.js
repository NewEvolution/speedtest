'use strict';

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

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./routes/')
app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

const localMongoPort = 27017;
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || localMongoPort;

const MONGODB_AUTH = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : '';

const MONGODB_URL = `mongodb://${MONGODB_AUTH}${MONGODB_HOST}:${MONGODB_PORT}/speedtest`;

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL);

const localPort = 3000;
const PORT = process.env.PORT || localPort;
mongoose.connection.on('open', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`Speedtest result server started. Listening on port ${PORT}`); // eslint-disable-line no-console
  });
});

module.exports = app;
