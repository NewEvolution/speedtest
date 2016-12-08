'use strict';

const express = require('express'),
      app = express(),

      bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./routes/');
app.use(routes);

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const localMongoPort = 27017,
      MONGODB_USER = process.env.MONGODB_USER || '',
      MONGODB_PASS = process.env.MONGODB_PASS || '',
      MONGODB_HOST = process.env.MONGODB_HOST || 'localhost',
      MONGODB_PORT = process.env.MONGODB_PORT || localMongoPort,

      mongodb_auth = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASS}@` : '',

      mongodb_url = `mongodb://${mongodb_auth}${MONGODB_HOST}:${MONGODB_PORT}/speedtest`,

      mongoose = require('mongoose');
mongoose.connect(mongodb_url);

const localPort = 3000,
      PORT = process.env.PORT || localPort;
mongoose.connection.on('open', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`Speedtest result server started. Listening on port ${PORT}`); // eslint-disable-line no-console
  });
});

module.exports = app;
