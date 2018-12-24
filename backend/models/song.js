const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  name: { type: String, required: true},
  length: { type: Number, required: true},
  filePath:  { type: String, default: undefined }
});

module.exports = mongoose.model('Song', songSchema);
