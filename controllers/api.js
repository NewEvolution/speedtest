'use strict'

const Speedtest = require('../models/speedtest');
const moment = require('moment');

const getResults = (startDate, endDate) => {
  return Speedtest
    .find({scantime: {$gte: startDate, $lt: endDate}})
    .exec((err, results) => {
      if (err) throw err;
      return results;
    });
};

const getAverage = numArray => {
  let sum;
  numArray.forEach(value => { sum += value });
  return sum / numArray.length;
};

module.exports.today = (req, res) => {
  const startDate = moment();
  const endDate = moment(startDate).add(1, 'day');
  getResults(startDate, endDate)
    .then(results => res.send(results))
};

module.exports.year = (req, res) => {
  const startDate = moment(req.params.date, 'YYYY');
  const endDate = moment(startDate).add(1, 'year');
  getResults(startDate, endDate)
    .then(results => res.send(results))
};

module.exports.month = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMM');
  const endDate = moment(startDate).add(1, 'month');
  getResults(startDate, endDate)
    .then(results => {
      let currentDay;
      let ping = [];
      let download = [];
      let upload = [];
      const dayTest = {};

      const summarize = () => {
        dayTest.ping = getAverage(ping);
        dayTest.download = getAverage(download);
        dayTest.upload = getAverage(upload);
        ping = [];
        download = [];
        upload = [];
        dayTest.scantime = moment()
          .year(currentDay.year())
          .month(currentDay.month())
          .date(currentDay.date())
      };

      const perDayResults = results.map((test, index) => {
        currentDay = currentDay ? currentDay : moment(test.scantime);

        if (!currentDay.isSame(test.scantime, 'day')) {
          summarize();
          currentDay = moment(test.scantime);
          return dayTest;
        }

        ping[ping.length] = test.ping;
        download[download.length] = test.download;
        upload[upload.length] = test.length;

        if (index === results.length - 1) {
          summarize();
          return dayTest;
        }
      });
      res.send(perDayResults);
    })
};

module.exports.week = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(7, 'days'); // eslint-disable-line no-magic-numbers
  getResults(startDate, endDate)
    .then(results => res.send(results))
};

module.exports.day = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(1, 'day');
  getResults(startDate, endDate)
    .then(results => res.send(results))
};
