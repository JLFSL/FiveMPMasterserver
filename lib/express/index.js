var config = require('../config'),
    logger = require('../logger');

var bodyParser = require('body-parser'),
    express = require('express'),
    app = express();

var fivempAuth = require('./middleware/fivemp');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', process.env.PORT || config.express.port);

module.exports.app = app;
module.exports.description = "Controls the Web Part of the API.";
module.exports.initialize = function() {
  app.listen(app.get('port'), function(){
    logger.log('info', '[Express] Started on port %d.', app.get('port'));
  });
};
module.exports.name = "Express";

app.post('/v2/servers', require('./middleware/fivemp'));
app.delete('/v2/servers', require('./middleware/fivemp'));

require('./routes/servers');
require('./routes/versions');

app.get('/v2', function(req, res) {
  res.json({endpoints: { servers: 'http://api.five-multiplayer.net/v2/servers', versions: 'http://api.five-multiplayer.net/v2/versions' }});
});

app.use(function(req, res) {
  res.json({ error: 'Not Found', message: 'Not Found', status: 404 });
});
