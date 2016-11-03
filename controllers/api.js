'use strict'

const Speedtest = require('../models/speedtest');
const moment = require('moment');

// Given starting and ending dates return all speed tests between them
const getResults = (startDate, endDate) => {
  return Speedtest
    .find({scantime: {$gte: startDate, $lt: endDate}})
    .exec((err, results) => {
      if (err) throw err;
      return results;
    });
};

// Given an array of numbers, return their average
const getAverage = numArray => {
  let sum = 0;
  numArray.forEach(value => { sum += value });
  const decimalPlaces = 3;
  return parseFloat((sum / numArray.length).toFixed(decimalPlaces));
};

// Given an array of speed test results and a time period, group those
// results by the time period and return the per time period average result
const averagedResults = (results, timePeriod) => {
  let currentPeriod = null;
  let ping = [];
  let download = [];
  let upload = [];

  const summarize = () => {
    const dayTest = {
      ping: getAverage(ping),
      download: getAverage(download),
      upload: getAverage(upload),
      scantime: moment(currentPeriod).startOf('day')
    };
    ping = [];
    download = [];
    upload = [];
    return dayTest;
  };

  const perTimePeriodResults = [];
  results.forEach((test, index) => {
    currentPeriod = currentPeriod ? currentPeriod : moment(test.scantime);

    if (!currentPeriod.isSame(test.scantime, timePeriod)) {
      perTimePeriodResults[perTimePeriodResults.length] = summarize();
      currentPeriod = moment(test.scantime);
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

// Send the results for the current day as JSON
module.exports.today = (req, res) => {
  const startDate = moment(moment().format('YYYY-MM-DD'));
  const endDate = moment(startDate).add(1, 'day');
  getResults(startDate, endDate)
    .then(results => res.send(results));
};

// Send the summarized-by-week results for the given year as JSON
module.exports.year = (req, res) => {
  const startDate = moment(req.params.date, 'YYYY');
  const endDate = moment(startDate).add(1, 'year');
  getResults(startDate, endDate)
    .then(results => res.send(averagedResults(results, 'week')));
};

// Send the summarized-by-day results for the given month as JSON
module.exports.month = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMM');
  const endDate = moment(startDate).add(1, 'month');
  getResults(startDate, endDate)
    .then(results => res.send(averagedResults(results, 'day')));
};

// Send the full results for the given week as JSON
module.exports.week = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(1, 'week');
  getResults(startDate, endDate)
    .then(results => res.send(results));
};

// Send the full results for the given day as JSON
module.exports.day = (req, res) => {
  const startDate = moment(req.params.date, 'YYYYMMDD');
  const endDate = moment(startDate).add(1, 'day');
  getResults(startDate, endDate)
    .then(results => res.send(results));
};

// Send the results for the given time frame
// full or variously summarized based on time frame length
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
