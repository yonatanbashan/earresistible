const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  text: { type: String, required: true},
  count: { type: Number, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model('Tag', tagSchema);
