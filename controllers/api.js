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
  let sum = 0;
  numArray.forEach(value => { sum += value });
  const decimalPlaces = 3;
  return parseFloat((sum / numArray.length).toFixed(decimalPlaces));
};

const averagedResults = (results, timePeriod) => {
  let currentDay = null;
  let ping = [];
  let download = [];
  let upload = [];

  const summarize = () => {
    const dayTest = {
      ping: getAverage(ping),
      download: getAverage(download),
      upload: getAverage(upload),
      scantime: moment()
        .year(currentDay.year())
        .month(currentDay.month())
        .date(currentDay.date())
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
    };
    ping = [];
    download = [];
    upload = [];
    return dayTest;
  };

  const perTimePeriodResults = [];
  results.forEach((test, index) => {
    currentDay = currentDay ? currentDay : moment(test.scantime);

    if (!currentDay.isSame(test.scantime, timePeriod)) {
      perTimePeriodResults[perTimePeriodResults.length] = summarize();
      currentDay = moment(test.scantime);
    }

    ping[ping.length] = test.ping;
    download[download.length] = test.download;
    upload[upload.length] = test.upload;

    if (index === results.length - 1) {
      perTimePeriodResults[perTimePeriodResults.length] = summarize();
    }
  });

  return perTimePeriodResults;
};

module.exports.today = (req, res) => {
  const startDate = moment(moment().format('YYYY-MM-DD'));
  const endDate = moment(startDate).add(1, 'day');
  getResults(startDate, endDate)
    .then(results => res.send(results));
};

module.exports.year = (req, res) => {
  const startDate = moment(req.params.date, 'YYYY');
  const endDate = moment(startDate).add(1, 'year');
  getResults(startDate, endDate)
    .then(results => res.send(averagedResults(results, 'week')));
};

module.exports.month = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMM');
  const endDate = moment(startDate).add(1, 'month');
  getResults(startDate, endDate)
    .then(results => res.send(averagedResults(results, 'day')));
};

module.exports.week = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(7, 'days'); // eslint-disable-line no-magic-numbers
  getResults(startDate, endDate)
    .then(results => res.send(results));
};

module.exports.day = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(1, 'day');
  getResults(startDate, endDate)
    .then(results => res.send(results));
};

module.exports.range = (req, res) => {
  const startDate = moment(req.params.sdate, 'YYYYMMDD');
  const endDate = moment(req.params.edate, 'YYYYMMDD');
  const daysInRange = endDate.diff(startDate, 'days');
  const maxDaysAsHours = 7;
  const maxDaysAsDays = 168;
  const maxDaysAsWeeks = 1168;
  getResults(startDate, endDate)
    .then(results => {
      if (daysInRange <= maxDaysAsHours) {
        res.send(results);
      } else if (daysInRange <= maxDaysAsDays) {
        res.send(averagedResults(results, 'day'));
      } else if (daysInRange <= maxDaysAsWeeks) {
        res.send(averagedResults(results, 'week'));
      } else {
        res.send(averagedResults(results, 'month'));
      }
    });
};
