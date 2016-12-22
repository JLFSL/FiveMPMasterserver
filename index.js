var logger = require('./lib/logger'),
    manager = require('./lib');

manager.on('fail', function(err, module) {
  logger.log('warn', 'Failed to Load Module %s. %s', module, err);
});

manager.on('load', function(module) {
  logger.log('info', 'Loaded Module %s.', module.name);
});

manager.on('ready', function(modules) {
  logger.log('info', 'Loaded %d Modules.', modules.length);
  for (var m = 0; m < modules.length; m++) {
    modules[m].initialize();
  }
});

manager.initialize();
