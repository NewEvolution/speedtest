'use strict'

// const Speedtest = require('../models/speedtest');
const execSync = require('child_process').execSync;
const q = require('q')

const speedtest = () => {
  return execSync('speedtest-cli --simple').toString();
}

module.exports.test = (req, res) => {
  q.fcall(speedtest).then(results => {
    const resArr = results.split('\n');
    resArr.pop();
    // via http://txt2re.com/index-javascript.php3?s=Download:%2082.15%20Mbit/s&3
    const regex = new RegExp('.*?([+-]?\\d*\\.\\d+)(?![-+0-9\\.])'); // eslint-disable-line no-new
    const modArr = resArr.map((item) => {
      return regex.exec(item)[1];
    });
    console.log('Value Array:\n', modArr); // eslint-disable-line no-console
  });

  res.send('Testing...');
};
