'use strict'

const express = require('express'),
      router = express.Router(),
      speedtest = require('../controllers/speedtest');

router.get('/', speedtest.new)
      .post('/', speedtest.add)

module.exports = router;
