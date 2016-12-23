var VM = require('../../../mongoose/models/version');

module.exports = function(req, res, next) {
  if (!(req.headers['authorization']) || !(req.headers['authorization'].split(' ').length == 3)) {
    return res.json({ message: 'Unauthorized', error: 'Unauthorized', status: 401 });
    console.log('a')
  }

  if (!(req.headers['authorization'].split(' ')[0] === "FiveMP") || !(req.headers['authorization'].split(' ')[1] === "Token")) {
    return res.json({ message: 'Unauthorized', error: 'Unauthorized', status: 401 });
    console.log('b')
  }

  VM.findOne({ 'token': req.headers['authorization'].split(' ')[2] }, function(err, result) {
    if (err) {
      logger.log('error', '[Express - Versions] ' + err);
      return res.json({ message: 'Internal Server Error', error: 'Internal Error', status: 500 });
    }

    if (!(result)) {
      console.log('c');
      return res.json({ message: 'Unauthorized', error: 'Unauthorized', status: 401 });
    }

    req.version = result.version;
    req.token = req.headers['authorization'].split(' ')[2];
    next();
  });
};
