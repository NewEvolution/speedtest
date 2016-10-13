'use strict'

const express = require('express');
const router = express.Router();

const api = require('../controllers/api');

router.get('/', api.index)
      .post('/', api.new);

module.exports = router;
