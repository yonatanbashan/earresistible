const Profile = require('../models/profile');
const Release = require('../models/release');
const User = require('../models/user');
const appConfig = require('../common/app-config');



exports.getProfile = async (req, res, next) => {
  let profile;
  try {
    if(req.query.username) {
      const user = await User.findOne({ username: req.query.username });
      profile = await Profile.findOne( {userId: user._id } );
    } else if(req.query.id) {
      profile = await Profile.findOne( {userId: req.query.id } );
    }
    res.status(200).json({ profile: profile, message: 'Profile fetched successfully!'});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err });
  }
}


exports.addProfile = async (req, res, next) => {
  const newProfile = req.body.profile;
  const profile = new Profile(newProfile);
  profile.imagePath = appConfig.defaultPhoto;
  try {
    const newProfile = await profile.save();
    res.status(201).json({ message: 'Profile created successfully!', profile: newProfile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create profile', error: err });
  }
}

exports.updateProfile = async (req, res, next) => {

  const url = appConfig.AWSAddressSimple;
  let profileInfo = req.body;
  if(req.file !== undefined) {
    profileInfo.image = undefined;
    profileInfo.imagePath = url + '/' + req.file.key;
  }

  try {
    const profile = await Profile.findOneAndUpdate({ userId: req.userData.userId }, profileInfo);
    res.status(200).json({ message: 'User profile updated successfully!' , profile: profile })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err });
  }

}

exports.getProfiles = async (req, res, next) => {

  try {
    const profiles = await Profile.find({ userId: { $in: req.body.userIds }});
    res.status(200).json({ message: 'User profiles fetched successfully!' , profiles: profiles })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profiles', error: err });
  }

}


exports.deleteField = async (req, res, next) => {

  if (req.query.field === 'photo') {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId: req.userData.userId },
        { imagePath: appConfig.defaultPhoto });
      res.status(201).json({ profile: profile, message: 'Profile photo deleted successfully!' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete photo from profile', error: err });
    }
  }
}



