'use strict'

const express = require('express'),
      router = express.Router(),

      apiRoutes = require('./api'),
      speedRoutes = require('./speedtest');

router.use('/api', apiRoutes);
router.use('/speedtest', speedRoutes);

module.exports = router;
