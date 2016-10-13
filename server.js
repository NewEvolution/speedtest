'use strict';

const express = require('express');
const app = express();

const path = require('path');
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, '/sass'),
  dest: path.join(__dirname, '/public/styles'),
  prefix:'/styles',
  indentedSyntax: true,
  outputStyle: 'compressed',
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.send('You found the marble in the oatmeal!');
});

const db = require('./models/');
const localPort = 3000;
const PORT = process.env.PORT || localPort;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`); // eslint-disable-line no-console
  });
});

module.exports = app;
