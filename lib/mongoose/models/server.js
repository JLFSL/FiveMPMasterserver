var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ServerSchema = new Schema({
  active: Boolean,
  blacklisted: Boolean,
  ip: String,
  port: { type: Number, min: 0, max: 65535 },
  name: String,
  players: {
    amount: { type: Number },
    max: { type: Number },
    record: { type: Number },
    list: { type: Schema.Types.Mixed }
  },
  stats: {
    verified: { type: Boolean },
    version: { type: String }
  },
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Server', ServerSchema);
