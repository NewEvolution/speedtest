'use strict'

const Speedtest = require('../models/speedtest');
const moment = require('moment');

const getResults = (startDate, endDate, significantDateLength) => {
  return Speedtest
    .aggregate([
      {
        $match: {
          scantime: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate()
          }
        }
      },
      {
        $project: {
          scantime: {$substr: ['$scantime', 0, significantDateLength]},
          ping: '$ping',
          download: '$download',
          upload: '$upload'
        }
      },
      {
        $group: {
          _id : '$scantime',
          ping : {$avg : '$ping'},
          download: {$avg: '$download'},
          upload: {$avg: '$upload'}
        }
      }
    ])
    .exec((err, results) => {
      if (err) throw err;
      return results;
    });
};

module.exports.today = (req, res) => {
  const startDate = moment();
  const endDate = moment(startDate).add(1, 'day');
  const significantDateLength = 16;
  getResults(startDate, endDate, significantDateLength)
    .then(results => res.send(results))
};

module.exports.year = (req, res) => {
  const startDate = moment(req.params.date, 'YYYY');
  const endDate = moment(startDate).add(1, 'year');
  const significantDateLength = 10;
  getResults(startDate, endDate, significantDateLength)
    .then(results => res.send(results))
};

module.exports.month = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMM');
  const endDate = moment(startDate).add(1, 'month');
  const significantDateLength = 10;
  getResults(startDate, endDate, significantDateLength)
    .then(results => {
      res.send(results);
    })
};

module.exports.week = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(7, 'days'); // eslint-disable-line no-magic-numbers
  const significantDateLength = 16;
  getResults(startDate, endDate, significantDateLength)
    .then(results => res.send(results))
};

module.exports.day = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(1, 'day');
  const significantDateLength = 16;
  getResults(startDate, endDate, significantDateLength)
    .then(results => res.send(results))
};
