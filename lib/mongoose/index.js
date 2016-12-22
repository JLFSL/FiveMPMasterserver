var config = require('../config'),
    logger = require('../logger');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = mongoose;
module.exports.description = "Controls the Database Connection";
module.exports.initialize = function() {
  logger.log('info', '[Mongoose] Attempting to connect to the database.');
  mongoose.connect('mongodb://' + config.mongodb.hostname + '/' + config.mongodb.database);

  var connection = mongoose.connection;
  connection.on('error', function(err) {
    if (err.toString().includes('MongoError: failed to connect to server')) {
      logger.log('warn', '[Mongoose] Failed to connect to the database.');
    } else {
      logger.log('error', '[Mongoose] Encountered an error. %s', err);
    }
  });

  connection.once('open', function() {
    logger.log('info', '[Mongoose] Connected to the database.');
  });
};
module.exports.name = "Mongoose";
