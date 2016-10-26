#!/usr/bin/env node
/* eslint no-console: 0 */
'use strict';

const args = process.argv;
const requiredArgs = 4;
const CLIUsageError = 64;
const fs = require('fs');
const wait = require('wait.for');
const request = require('request');

const testPoster = (url, test) => {
  request.post(url, {json: test}, (err, res, body) => {
    if (err) throw err;
    console.log('Created:', body);
  });
}

if (args.length === requiredArgs) {
  const filepath = args[2];
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) throw err;

    const speedtestObjects = data
      .split('#')
      .map(testBlock => testBlock
        .split('\n')
        .filter(testElement => testElement !== '' && testElement !== ' '))
      .filter(testArr => testArr.length !== 0)
      .map(testArr => {
        const testObj = {};
        testObj.scantime = testArr.shift();
        const successfulSpeedtestElements = 3;
        if (testArr.length === successfulSpeedtestElements) {
          // via http://txt2re.com/index-javascript.php3?s=Download:%2082.15%20Mbit/s&3
          const regex = new RegExp('.*?([+-]?\\d*\\.\\d+)(?![-+0-9\\.])');
          const parsedData = testArr.map(testData => regex.exec(testData)[1]);
          testObj.ping = parsedData[0];
          testObj.download = parsedData[1];
          testObj.upload = parsedData[2];
        } else {
          testObj.ping = testObj.download = testObj.upload = '0.0';
        }
        return testObj
      });

    const url = args[3];

    const testSender = () => {
      speedtestObjects.forEach((test, index) => {
        console.log('Number', index);
        wait.for(testPoster, url, test);
      });
    };

    wait.launchFiber(testSender);
  });
} else {
  console.log('usage: import.js </path/to/testObj.log> <http://url.to.post.to>');
  process.exit(CLIUsageError);
}
