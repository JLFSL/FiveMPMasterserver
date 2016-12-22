var events = require('events'),
    eventEmitter = new events.EventEmitter(),
    fs = require('fs'),
    path = require('path');

var modules = [];

module.exports = eventEmitter;

module.exports.initialize = function() {
  eventEmitter.emit('initialize');

  var directories = fs.readdirSync('./lib').filter(f => fs.statSync(path.join('./lib', f)).isDirectory());

  for (var m = 0; m < directories.length; m++) {
    module.exports.load(directories[m], function(err, result) {
      if (err) {
        eventEmitter.emit('fail', err, directories[m]);
      }
    });

    if (m == directories.length - 1) {
      setTimeout(function() {
        eventEmitter.emit('ready', modules);

        module.exports.modules = modules;
      }, 5000);
    }
  }
};

module.exports.load = function(module, callback) {
  try {
    var m = require('./' + module);

    modules.push(m);

    eventEmitter.emit('load', m);

    return callback(null, m);
  } catch (exception) {
    return callback(exception, null);
  }
};

module.exports.reload = function(moduleName, callback) {
  module.exports.unload(moduleName, function(err, result) {
    if (err) {
      return callback(err, null);
    }

    module.exports.load(moduleName, function(err, result) {
      if (err) {
        return callback(err, null);
      }

      module.exports.modules = modules;

      eventEmitter.emit('reload', result);

      return callback(null, result);
    })
  });

  return callback(new Error("Cannot reload module " + moduleName), null);
};

module.exports.unload = function(moduleName, callback) {
  if (containsModule(moduleName, modules)) {
    try {
      delete require.cache[require.resolve('./' + moduleName)];

      var directories = fs.readdirSync('./lib').filter(f => fs.statSync(path.join('./lib', f)).isDirectory());

      for (var m = 0; m < directories.length; m++) {
        if (modules[m].name.toLowerCase() == moduleName.toLowerCase()) {
          eventEmitter.emit('unload', modules[m]);
          modules.splice(m, 1);

          module.exports.modules = modules;

          return callback(null, modules);
        }
      }
    } catch (exception) {
      return callback(exception, null);
    }

    return callback(new Error("Cannot unload module " + moduleName), null);
  } else {
    return callback(new Error("Cannot find module " + moduleName), null);
  }
};

var containsModule = function(module, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].name.toLowerCase() === module.toLowerCase()) {
      return true;
    }
  }

  return false;
}
