'use strict'

const Speedtest = require('../models/speedtest');

module.exports.index = (req, res) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  Speedtest
    .find({ scantime: {$gte: today} })
    .exec((err, results) => {
      if (err) throw err;
      res.send(results);
    });
};

module.exports.year = (req, res) => {
  const year = req.params.year;
  res.send(year);
};

module.exports.month = (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  res.send(`${year}-${month}`);
};

module.exports.day = (req, res) => {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;
  res.send(`${year}-${month}-${day}`);
};
