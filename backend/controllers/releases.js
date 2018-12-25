const Release = require('../models/release');
const Profile = require('../models/profile');
const appConfig = require('../common/app-config');

exports.addRelease = (req, res, next) => {

  const url = appConfig.AWSAddressSimple;
  let releaseInfo = req.body;
  if(req.file !== undefined) {
    releaseInfo.image = undefined;
    releaseInfo.imagePath = url + '/' + req.file.key;
  } else {
    res.status(401).json({
      message: 'No image was provided for release!'
    });
  }

  let newReleaseItem;
  releaseInfo.userId = req.userData.userId;
  const newRelease = new Release(releaseInfo);
  newRelease.save()
  .then(release => {
    newReleaseItem = release;
    return Profile.findOne({ userId: req.userData.userId })
  })
  .then((profile) => {
    if (!profile.releases.includes(newReleaseItem._id)) {
      let newReleases = profile.releases;
      newReleases.push(newReleaseItem._id);
      return Profile.findOneAndUpdate( { userId: req.userData.userId }, { releases: newReleases })
    } else {
      return;
    }
  })
  .then(() => {
    res.status(200).json({
      message: 'User release added successfully!',
      release: newReleaseItem
    })
  });

}

exports.getUserReleases = (req, res, next) => {

  query  = Release.find({ userId: req.query.userId });

  query.find()
  .then(releases => {
    res.status(200).json({
      message: 'Releases fetched successfully!',
      releases: releases
    });
  })
  .catch((error) => {
    res.status(401).json({
      message: 'There was an error fetching releases!'
    });
  }
  );
}


exports.deleteRelease = (req, res, next) => {
  Release.findByIdAndDelete(req.query.releaseId)
  .then(() => {
    return Profile.findOneAndUpdate({ userId: req.userData.userId }, { $pull: { releases: req.query.releaseId } });
  })
  .then(() => {
    res.status(201).json({
      message: 'Releases removed successfully from profile!'
    });
  });
}


