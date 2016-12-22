var crypto = require('crypto'),
    moment = require('moment');

exports.getDateStamp = function() {
  return moment().format('M[-]D[-]YYYY');
};

exports.getISOStamp = function() {
  return new Date().toISOString();
}

exports.generateString = function(length) {
  return crypto.randomBytes(length).toString('hex');
};

exports.getTimeStamp = function() {
  return moment().format('LLLL');
};

exports.isJSONString = function(string) {
  try {
    JSON.parse(string);
  } catch(e) {
    console.log('fail %s', e);
    return false;
  }
  return true;
};
