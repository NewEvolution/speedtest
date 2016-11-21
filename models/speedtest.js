'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

module.exports = mongoose.model('speedtest',
  mongoose.Schema({
    scantime: Date,
    ping: Number,
    download: Number,
    upload: Number
  })
);
