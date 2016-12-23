var VM = require('../../../mongoose/models/version');

module.exports = function(req, res, next) {
  if (!(req.headers['authorization']) || !(req.headers['authorization'].split(' ').length == 3)) {
    return res.json({ message: 'Unauthorized', error: 'Unauthorized', status: 401 });
  }

  if (!(req.headers['authorization'].split(' ')[0] === "OAuth2") || !(req.headers['authorization'].split(' ')[1] === "Basic")) {
    return res.json({ message: 'Unauthorized', error: 'Unauthorized', status: 401 });
  }

  if (req.headers['authorization'].split(' ')[2] == "DVZYw8STCQGTdr4YaC4A5DwXvxqty8cF") {
    next();

    return;
  } else {
    return res.json({ message: 'Unauthorized', error: 'Unauthorized', status: 401 });
  }
};
