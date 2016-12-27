var config = require('../config');

var mysql = require('mysql'),
    pool = mysql.createPool({
      connectionLimit: config.mysql.connectionLimit,
      host: config.mysql.hostname,
      database: config.mysql.database,
      user: config.mysql.username,
      password: config.mysql.password
    });

module.exports = pool;
module.exports.description = "Controls the MySQL Connection.";
module.exports.initialize = function() {};
module.exports.name = "MySQL";
