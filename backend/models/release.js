const mongoose = require('mongoose');

const releaseSchema = mongoose.Schema({
  name: { type: String, required: true},
  type: { type: String, required: true},
  imagePath: { type: String, required: true},
  releaseDate: { type: Date, default: Date.now},
  published: { type: Boolean, default: false },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song", default: [] }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model('Release', releaseSchema);
