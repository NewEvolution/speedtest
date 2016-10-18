'use strict'

const express = require('express');
const router = express.Router();

const speedtest = require('../controllers/speedtest');
router.get('/', speedtest.new)
      .post('/', speedtest.add)

module.exports = router;
