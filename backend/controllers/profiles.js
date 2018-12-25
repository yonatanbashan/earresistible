const Profile = require('../models/profile');
const Release = require('../models/release');
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
  profile.imagePath = appConfig.defaultPhoto;
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

  const url = appConfig.AWSAddressSimple;
  let profileInfo = req.body;
  if(req.file !== undefined) {
    profileInfo.image = undefined;
    profileInfo.imagePath = url + '/' + req.file.key;
  }
  Profile.findOneAndUpdate({ userId: req.userData.userId }, profileInfo)
  .then(profile => {
    res.status(200).json({
      message: 'User profile updated successfully!'
    })
  })
  .catch((error) => {
    console.log(error)
    res.status(401).json({
      message: 'An error occurred during profile update attempt!'
    });
  })

}


exports.deleteField = (req, res, next) => {

  if (req.query.field === 'photo') {
    Profile.findOneAndUpdate({ userId: req.userData.userId }, {
      imagePath: appConfig.defaultPhoto
    })
    .then(profile => {
      res.status(201).json({
        profile: profile,
        message: 'Profile photo deleted successfully!'
      });
    });
  }
}



