'use strict'

const Speedtest = require('../models/speedtest');
const moment = require('moment');

module.exports.today = (req, res) => {
  const now = moment();
  const today = `${now.year()}-${now.month() + 1}-${now.date()}`;
  Speedtest
    .find({ scantime: {$gte: today} })
    .exec((err, results) => {
      if (err) throw err;
      res.send(results);
    });
};

module.exports.year = (req, res) => {
  const startDate = moment(req.params.date, 'YYYY');
  const endDate = startDate.add(1, 'year');
  Speedtest
    .find({ scantime: { $gte: startDate._d, $lt: endDate._d } })
    .exec((err, results) => {
      if (err) throw err;
      res.send(results);
    });
};

module.exports.month = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMM');
  const endDate = startDate.add(1, 'month');
  Speedtest
    .find({ scantime: { $gte: startDate._d, $lt: endDate._d } })
    .exec((err, results) => {
      if (err) throw err;
      res.send(results);
    });
};

module.exports.day = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = startDate.add(1, 'day');
  Speedtest
    .find({ scantime: { $gte: startDate._d, $lt: endDate._d } })
    .exec((err, results) => {
      if (err) throw err;
      res.send(results);
    });
};
