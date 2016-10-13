/* eslint no-magic-numbers: 0 */
'use strict';

module.exports = (sequelize, DataTypes) => {
  const speedtest = sequelize.define('speedtest', {
    ping: DataTypes.DECIMAL(7, 3),
    download: DataTypes.DECIMAL(5, 2),
    upload: DataTypes.DECIMAL(5, 2)
  });
  return speedtest;
};
