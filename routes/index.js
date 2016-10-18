'use strict'

const express = require('express');
const router = express.Router();

const apiRoutes = require('./api');
router.use('/api', apiRoutes);

const speedRoutes = require('./speedtest');
router.use('/speedtest', speedRoutes);

module.exports = router;
