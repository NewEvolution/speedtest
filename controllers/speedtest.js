'use strict'

const Speedtest = require('../models/speedtest');
const execSync = require('child_process').execSync;
const moment = require('moment');
const q = require('q');

const speedtest = () => {
  return execSync('speedtest-cli --simple').toString();
}

module.exports.new = (req, res) => {
  q.fcall(speedtest).then(results => {
    // via http://txt2re.com/index-javascript.php3?s=Download:%2082.15%20Mbit/s&3
    const regex = new RegExp('.*?([+-]?\\d*\\.\\d+)(?![-+0-9\\.])');
    const rawData = results.split('\n')
    rawData.pop();
    const cleanData = rawData.map((item) => {
      return regex.exec(item)[1];
    });

    const obj = new Speedtest({
      ping: cleanData[0],
      download: cleanData[1],
      upload: cleanData[2]
    });

    obj.save((err) => {
      if (err) throw err;
    });
  });

  const created = 201;
  res.sendStatus(created);
};

module.exports.add = (req, res) => {
  const obj = new Speedtest({
    scantime: moment(req.body.date),
    ping: req.body.ping,
    download: req.body.download,
    upload: req.body.upload
  });

  obj.save((err, newObj) => {
    if (err) throw err;
    res.send(newObj);
  });
};
