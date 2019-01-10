const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const appConfig = require('../common/app-config')

const profileSchema = mongoose.Schema({
  artistName: { type: String, required: true},
  imagePath: { type: String, default: appConfig.defaultPhoto},
  description: { type: String, default: ''},
  bio: { type: String, default: ''},
  locationCity: { type: String, default: ''},
  locationCountry: { type: String, default: ''},
  genre: { type: String, default: ''},
  subGenre: { type: String, default: ''},
  plays: {type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
});

profileSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Profile', profileSchema);
