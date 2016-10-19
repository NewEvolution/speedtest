'use strict'

const express = require('express');
const router = express.Router();

const api = require('../controllers/api');
router.get('/day/:date', api.day)
      .get('/month/:date', api.month)
      .get('/week/:date', api.week)
      .get('/year/:date', api.year)
      .get('/', api.today);

module.exports = router;
