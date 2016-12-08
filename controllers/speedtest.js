'use strict'

const Speedtest = require('../models/speedtest'),
      execSync = require('child_process').execSync,
      moment = require('moment'),
      q = require('q'),

      speedtest = () => {
        let rawData = [];
        try {
          rawData = execSync('speedtest-cli --simple')
            .toString()
            .split('\n')
            .slice(0, -1);
        } catch (e) {
          // any errors mean we get no data back, hence, zeros
          rawData = ['0.0', '0.0', '0.0'];
        }
        return rawData;
      };

module.exports.new = (req, res) => {
  q.fcall(speedtest).then(rawData => {
    // via http://txt2re.com/index-javascript.php3?s=Download:%2082.15%20Mbit/s&3
    const regex = new RegExp('.*?([+-]?\\d*\\.\\d+)(?![-+0-9\\.])'),
          parsedData = rawData.map(item => regex.exec(item)[1]),

          obj = new Speedtest({
            scantime: moment(),
            ping: parsedData[0],
            download: parsedData[1],
            upload: parsedData[2]
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
    scantime: moment(req.body.scantime),
    ping: req.body.ping,
    download: req.body.download,
    upload: req.body.upload
  });

  obj.save((err, newObj) => {
    if (err) throw err;
    res.send(newObj);
  });
};
