const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  name: { type: String, required: true},
  plays: { type: Number, required: true},
  filePath:  { type: String, default: undefined },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  releaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Release" },
  releaseName: { type: String, required: true},
});

module.exports = mongoose.model('Song', songSchema);
