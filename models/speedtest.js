'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('speedtest',
  mongoose.Schema({
    scantime: {type: Date, default: Date.now},
    ping: Number,
    download: Number,
    upload: Number
  })
);
