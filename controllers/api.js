'use strict'

const Speedtest = require('../models/speedtest');

module.exports.index = (req, res) => {
  res.send('I exist');
};

module.exports.new = (req, res) => {
  const obj = new Speedtest({
    scantime: Date.parse(req.body.date),
    ping: req.body.ping,
    download: req.body.download,
    upload: req.body.upload
  });

  obj.save((err, newObj) => {
    if (err) throw err;
    res.send(newObj);
  });
};
