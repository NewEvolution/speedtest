#!/usr/bin/env node
'use strict';

const args = process.argv;
const requiredArgs = 3;
const CLIUsageError = 64;
const fs = require('fs');

if (args.length === requiredArgs) {
  const filepath = args[2];
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) throw err;
    const tests = data
      .split('#')
      .map(test => test
        .split('\n')
        .filter(test => test !== '' && test !== ' '))
      .filter(test => test.length !== 0)
    console.log(tests); // eslint-disable-line no-console
  });
} else {
  console.log('usage: import.js </path/to/speedtest.log>') // eslint-disable-line no-console
  process.exit(CLIUsageError);
}
