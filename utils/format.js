const momenttz = require('moment-timezone');
const mongoose = require('mongoose');

module.exports = {
  formatTimestamp: () =>
    momenttz.tz(new Date(), 'GMT').format('YYYY/MM/DD | HH:mm') + ' GMT',
};