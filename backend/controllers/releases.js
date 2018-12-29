const Release = require('../models/release');
const Profile = require('../models/profile');
const Song = require('../models/song');
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
    res.status(200).json({
      message: 'User release added successfully!',
      release: release
    });
  });

}

exports.publishRelease = (req, res, next) => {

  Release.findByIdAndUpdate(req.body.id, { published: true })
  .then(release => {
    res.status(200).json({
      message: 'Release published!'
    });
  })
}

exports.getReleaseById = (req, res, next) => {

  Release.findById(req.query.id)
  .then(release => {
    res.status(200).json({
      message: 'Release fetched successfully!',
      releases: [release] // Returning as array for better handling on frontend
    });
  })

}

exports.getUserReleases = (req, res, next) => {

  query  = Release.find({ userId: req.query.userId });

  query.find()
  .then(releases => {
    let filterReleases = true;

    if(req.userData) {
      if(req.userData.userId === req.query.userId) {
        filterReleases = false;
      }
    }

    if (filterReleases) {
      releases = releases.filter(release => release.published);
    }

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

    return Song.find({ releaseId: req.query.releaseId } );
  })
  .then(songs => {
    songs.forEach(song => {
      const songRelativePath = aux.getRelativePath(song.filePath);
      deleteFile(songRelativePath);
    });
  })
  .then(() => {
    return Release.findByIdAndRemove(req.query.releaseId);
  })
  .then(release => {
    res.status(201).json({
      message: `Release ${release._id} removed successfully from profile!`
    });
  });
}


