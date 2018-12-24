const mongoose = require('mongoose');

const releaseSchema = mongoose.Schema({
  name: { type: String, required: true},
  type: { type: String, required: true},
  imagePath: { type: String, default: undefined},
  releaseDate: { type: Date, default: Date.now},
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true }],
});

module.exports = mongoose.model('Release', releaseSchema);
