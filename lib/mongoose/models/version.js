var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VersionSchema = new Schema({
  version: String,
  download: String,
  token: String,
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Version', VersionSchema);
