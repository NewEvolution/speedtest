'use strict'

const express = require('express');
const router = express.Router();

const api = require('../controllers/api');
router.get('/:year/:month/:day', api.day)
      .get('/:year/:month', api.month)
      .get('/:year', api.year)
      .get('/', api.index);

module.exports = router;
