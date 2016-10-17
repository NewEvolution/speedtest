'use strict'

const express = require('express');
const router = express.Router();

const api = require('../controllers/api');
router.get('/', api.index)
      .post('/', api.new);

const speedtest = require('../controllers/speedtest');
router.get('/speedtest', speedtest.test);

module.exports = router;
