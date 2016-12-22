var manager = require('../../lib');

var fs = require('fs');

if (fs.existsSync('./lib/config/production.json') && fs.existsSync('./lib/config/development.json')) {
  var env = process.env.NODE_ENV || 'development',
      config = require('./' + env + '.json');

  config.env = env;

  module.exports = config;
  module.exports.description = "Controls the configuration.";
  module.exports.initialize = function() {};
  module.exports.name = "Configuration";
} else {
  manager.emit('error', new Error("Cannot find Configuration Files"));
  process.exit(1);
}
