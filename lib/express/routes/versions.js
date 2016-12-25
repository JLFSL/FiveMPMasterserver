var app = require('../index.js').app,
    logger = require('../../logger');

var VM = require('../../mongoose/models/version');

var util = require('../../../bin/util');

app.get('/v2/versions', function(req, res) {
  VM.find({}).sort('created_at').exec(function(err, result) {
    if (err) {
      logger.log('error', '[Express - Versions] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result.length)) {
      return res.json({ message: 'No Versions Found', error: 'Not Found', status: 404 });
    }

    var versions = [];

    for (var i = 0; i < result.length; i++) {
      versions.push({ id: result[i]._id, version: result[i].version, download: (result[i].download == null) ? null:result[i].download, token: result[i].token, created_at: result[i].created_at, updated_at: result[i].updated_at });
    }

    if (!(versions.length)) {
      return res.json({ message: 'No Versions Found', error: 'Not Found', status: 404 });
    }

    return res.json({ versions: versions, total: versions.length });
  });
});

app.put('/v2/versions', function(req, res) {
  if (!(req.body.token)) {
    return res.json({ message: 'Missing Parameter \'token\'.', error: 'Unprocessable Entity', status: 422 });
  }

  VM.findOne({ 'token': req.body.token }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Versions] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result)) {
      return res.json({ message: 'Version Does Not Exist', error: 'Not Found', status: 404 });
    }

    result.version = (req.body.version) ? (req.body.version == result.version) ? result.version:req.body.version:result.version,
    result.download = (req.body.download) ? (req.body.download == result.download) ?  result.download:req.body.download:result.download,
    result.download = (req.body.download == "null") ? null:result.download,
    result.updated_at = util.getISOStamp();

    result.save(function(err) {
      if (err) {
        logger.log('error', '[Express - Versions] ' + err);
        return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
      }

      return res.json({ id: result._id, version: result.version, download: (result.download == null) ? null:result.download, token: result.token, created_at: result.created_at, updated_at: result.updated_at });
    });
  });
});

app.post('/v2/versions', function(req, res) {
  if (!(req.body.version)) {
    return res.json({ message: 'Missing Parameter \'version\'.', error: 'Unprocessable Entity', status: 422 });
  }

  if (req.body.version) {
    VM.findOne({ 'version': req.body.version }, function(err, result) {
      if (err) {
        logger.log('error', '[Express - Versions] ' + err);
        return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
      }

      if (result) {
        return res.json({ message: 'Version Already Exists', error: 'Conflict', status: 409 });
      }

      var version = new VM();
      version.version = req.body.version,
      version.download = (req.body.download == null) ? null:req.body.download,
      version.token = (req.body.token == null) ? util.generateString(8):req.body.token,
      version.updated_at = util.getISOStamp(),
      version.created_at = util.getISOStamp();

      version.save(function(err) {
        if (err) {
          logger.log('error', '[Express - Versions] ' + err);
          return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
        }

        return res.json({ id: version._id, version: version.version, download: (version.download == null) ? null:version.download, token: version.token, created_at: version.created_at, updated_at: version.updated_at });
      });
    });
  }
});

app.delete('/v2/versions', function(req, res) {
  if (!(req.body.token)) {
    return res.json({ message: 'Missing Parameter \'token\'.', error: 'Unprocessable Entity', status: 422 });
  }

  VM.findOne({ 'token': req.body.token }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Versions] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result)) {
      return res.json({ message: 'Version Does Not Exist', error: 'Not Found', status: 404 });
    }

    VM.remove({ 'token': req.body.token }, function(err) {
      if (err) {
        logger.log('error', '[Express - Versions] ' + err);
        return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
      }

      return res.json({ message: 'Version Removed', status: 200 })
    });
  });
});
