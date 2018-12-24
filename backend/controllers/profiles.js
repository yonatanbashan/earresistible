const Profile = require('../models/profile');
const appConfig = require('../common/app-config');

exports.getProfile = (req, res, next) => {

  Profile.findOne( {userId: req.query.id } ).then(profile => {
    res.status(200).json({
      profile: profile,
      message: 'Profile fetched successfully!'
    });
  });

}


exports.addProfile = (req, res, next) => {
  const newProfile = req.body.profile;
  const profile = new Profile(newProfile);
  console.log(profile);
  profile.save().then((profile) => {
    console.log('Success!')
    res.status(201).json({
      message: 'Profile created successfully!',
      profile: profile
    });
  }, (error) => {
    console.log('Error:' + error);
  });
}

exports.updateProfile = (req, res, next) => {
  const profileInfo = req.body.profileInfo;
  console.log(req.body.profileInfo)
  Profile.findOneAndUpdate({ userId: req.userData.userId }, {
    artistName: profileInfo.artistName,
    description: profileInfo.description,
    bio: profileInfo.bio,
    locationCountry: profileInfo.locationCountry,
    locaitonCity: profileInfo.locaitonCity,
    genre: profileInfo.genre,
    subGenre: profileInfo.subGenre
  })
  .then(profile => {
    res.status(201).json({
      profile: profile,
      message: 'User profile updated successfully!'
    });
  });

}



