var app = require('../index.js').app,
    logger = require('../../logger');

var SM = require('../../mongoose/models/server');

var util = require('../../../bin/util');

var striptags = require('striptags');

app.get('/v2/servers', function(req, res) {
  SM.find({ 'active': true, 'blacklisted': false }).sort('created_at').exec(function(err, result) {
    if (err) {
      logger.log('error', '[Express - Servers] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result.length)) {
      return res.json({ message: 'No Servers Found', error: 'Not Found', status: 404 });
    }

    var servers = [];

    for (var i = 0; i < result.length; i++) {
      if (result[i].players.list && result[i].players.amount > 0) {
        servers.push({ id: result[i]._id, ip: result[i].ip, port: result[i].port, name: result[i].name, players: { amount: result[i].players.amount, max: result[i].players.max, record: result[i].players.record, list: result[i].players.list }, stats: { verified: result[i].stats.verified, version: result[i].stats.version }, created_at: result[i].created_at, updated_at: result[i].updated_at });
      } else {
        servers.push({ id: result[i]._id, ip: result[i].ip, port: result[i].port, name: result[i].name, players: { amount: result[i].players.amount, max: result[i].players.max, record: result[i].players.record }, stats: { verified: result[i].stats.verified, version: result[i].stats.version }, created_at: result[i].created_at, updated_at: result[i].updated_at });
      }
    }

    if (!(servers.length)) {
      return res.json({ message: 'No Servers Found', error: 'Not Found', status: 404 });
    }

    return res.json({ servers: servers, total: servers.length });
  });
});

app.put('/v2/servers', function(req, res) {
  if (!req.body.ip)) {
    return res.json({ message: 'Missing Parameter \'ip\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(req.body.port)) {
    return res.json({ message: 'Missing Parameter \'port\'.', error: 'Unprocessable Entity', status: 422 });
  }

  SM.findOne({ 'ip': req.body.ip, 'port': req.body.port }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Servers] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result)) {
      return res.json({ message: 'Server Does Not Exist', error: 'Not Found', status: 404 });
    }

    result.blacklisted = (req.body.blacklisted) ? req.body.blacklisted:result.blacklisted,
    result.stats.verified = (req.body.verified) ? req.body.verified:result.stats.verified,
    result.updated_at = util.getISOStamp();

    result.save(function(err) {
      if (err) {
        logger.log('error', '[Express - Servers] ' + err);
        return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
      }

      if (result.players.list && result.players.amount > 0) {
        return res.json({ id: result._id, ip: result.ip, port: result.port, name: result.name, players: { amount: result.players.amount, max: result.players.max, record: result.players.record, list: result.players.list }, stats: { blacklisted: result.blacklisted, verified: result.stats.verified, version: result.stats.version }, created_at: result.created_at, updated_at: result.updated_at });
      } else {
        return res.json({ id: result._id, ip: result.ip, port: result.port, name: result.name, players: { amount: result.players.amount, max: result.players.max, record: result.players.record }, stats: { blacklisted: result.blacklisted, verified: result.stats.verified, version: result.stats.version }, created_at: result.created_at, updated_at: result.updated_at });
      }
    });
  });
});

app.post('/v2/servers', function(req, res) {
  if (!(req.headers['content']) || !(util.isJSONString(req.headers['content']))) {
    return res.json({ message: 'Missing Header \'content\'.', error: 'Unprocessable Entity', status: 422 });
  }

  var content = JSON.parse(req.headers['content']);
  content.ip = req.connection.remoteAddress.replace('::ffff:', '');
  content.version = req.version;

  if (!(content.port)) {
    return res.json({ message: 'Missing Parameter \'port\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(content.name)) {
    return res.json({ message: 'Missing Parameter \'name\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(content.players.amount == null)) {
    return res.json({ message: 'Missing Parameter \'amount\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (!(content.players.max)) {
    return res.json({ message: 'Missing Parameter \'max\'.', error: 'Unprocessable Entity', status: 422 });
  }

  SM.findOne({ 'ip': content.ip, 'port': content.port }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Servers] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result)) {
      var server = new SM();
      server.active = true,
      server.blacklisted = false,
      server.ip = content.ip,
      server.port = content.port,
      server.name = striptags(content.name),
      server.players.amount = content.players.amount,
      server.players.max = content.players.max,
      server.players.record = content.players.amount,
      server.players.list = (content.players.amount < 1 || content.players.list) ? content.players.list:[],
      server.stats.verified = false,
      server.stats.version = content.version,
      server.created_at = util.getISOStamp(),
      server.updated_at = util.getISOStamp();

      server.save(function(err) {
        if (err) {
          logger.log('error', '[Express - Servers] ' + err);
          return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
        }

        if (server.players.list && server.players.amount > 0) {
          return res.json({ id: server._id, ip: server.ip, port: server.port, name: server.name, players: { amount: server.players.amount, max: server.players.max, record: server.players.record, list: server.players.list }, stats: { verified: server.stats.verified, version: server.stats.version }, created_at: server.created_at, updated_at: server.updated_at });
        } else {
          return res.json({ id: server._id, ip: server.ip, port: server.port, name: server.name, players: { amount: server.players.amount, max: server.players.max, record: server.players.record }, stats: { verified: server.stats.verified, version: server.stats.version }, created_at: server.created_at, updated_at: server.updated_at });
        }
      });
    } else {
      result.active = true,
      result.ip = content.ip,
      result.port = content.port,
      result.name = striptags(content.name),
      result.players.amount = content.players.amount,
      result.players.max = content.players.max,
      result.players.record = ((content.players.amount > result.players.record) ? content.players.amount:result.players.record),
      result.players.list = (content.players.amount < 1 || content.players.list) ? content.players.list:[],
      result.stats.version = content.version,
      result.updated_at = util.getISOStamp();

      result.save(function(err) {
        if (err) {
          logger.log('error', '[Express - Servers] ' + err);
          return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
        }

        if (result.players.list && result.players.amount > 0) {
          res.json({ id: result._id, ip: result.ip, port: result.port, name: result.name, players: { amount: result.players.amount, max: result.players.max, record: result.players.record, list: result.players.list }, stats: { verified: result.stats.verified, version: result.stats.version }, created_at: result.created_at, updated_at: result.updated_at });
        } else {
          res.json({ id: result._id, ip: result.ip, port: result.port, name: result.name, players: { amount: result.players.amount, max: result.players.max, record: result.players.record }, stats: { verified: result.stats.verified, version: result.stats.version }, created_at: result.created_at, updated_at: result.updated_at });
        }
      });
    }
  })
});

app.delete('/v2/servers', function(req, res) {
  if (!(req.headers['content']) || !(util.isJSONString(req.headers['content']))) {
    return res.json({ message: 'Missing Header \'content\'.', error: 'Unprocessable Entity', status: 422 });
  }
  var content = JSON.parse(req.headers['content']);
  content.ip = req.connection.remoteAddress.replace('::ffff:', '');

  if (!(content.port)) {
    return res.json({ message: 'Missing Parameter \'port\'.', error: 'Unprocessable Entity', status: 422 });
  }

  SM.findOne({ 'ip': content.ip, 'port': content.port }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Servers] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result.length)) {
      return res.json({ message: 'Server Does Not Exist', error: 'Not Found', status: 404 });
    }

    result.active = false,
    result.updated_at = util.getISOStamp();

    result.save(function(err) {
      if (err) {
        logger.log('error', '[Express - Servers] ' + err);
        return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
      }

      res.json({ message: 'Server Removed', status: 200 });
    });
  })
});

setInterval(function() {
  SM.find({ active: true }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Servers] ' + err);
    }

    for (var i = 0; i < result.length; i++) {
      if (Math.floor(Date.now() / 1000 - 300) > (new Date(result[i].updated_at).getTime() / 1000).toFixed(0)) {
        result[i].active = false,
        result[i].updated_at = util.getISOStamp();

        logger.log('debug', 'Removed Server %s:%d.', result[i].ip, result[i].port);
        result[i].save(function(err) {
          if (err) {
            logger.log('error', '[Express - Servers] ' + err);
          }
        });
      }
    }
  });
}, 30000);
