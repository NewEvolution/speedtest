'use strict'

const express = require('express'),
      router = express.Router(),
      api = require('../controllers/api');

router.get('/day/:date', api.day)
      .get('/week/:date', api.week)
      .get('/month/:date', api.month)
      .get('/year/:date', api.year)
      .get('/range/:sdate/:edate', api.range)
      .get('/', api.today);

module.exports = router;
