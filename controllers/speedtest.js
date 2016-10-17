'use strict'

// const Speedtest = require('../models/speedtest');
const execSync = require("child_process").execSync;

module.exports.test = (req, res) => {
  const speedy = execSync("speedtest-cli --simple").toString();
  res.send(speedy);
};
