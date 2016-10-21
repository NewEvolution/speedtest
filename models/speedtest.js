'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
mongoose.Promise = require('q').Promise;

module.exports = mongoose.model('speedtest',
  mongoose.Schema({
    scantime: {type: Date, default: moment()},
    ping: Number,
    download: Number,
    upload: Number
  })
);
