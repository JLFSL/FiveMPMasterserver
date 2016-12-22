var config = require('../config');

var util = require('../../bin/util');

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: config.logger.level,
      timestamp: function() {
        return util.getTimeStamp();
      },
      formatter: function(options) {
        return '['+options.timestamp() +'] ['+ options.level.toUpperCase() +'] '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    }),
    new (winston.transports.File)({
      level: config.logger.level,
      filename: 'lib/logger/logs/' + util.getDateStamp() + '.log',
      timestamp: function() {
        return util.getTimeStamp();
      }
    })
  ]
});

module.exports = logger;
module.exports.description = "Controls Logging";
module.exports.initialize = function() {};
module.exports.name = "Logger";
