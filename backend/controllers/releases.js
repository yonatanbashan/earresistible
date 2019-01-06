const Release = require('../models/release');
const Profile = require('../models/profile');
const Song = require('../models/song');
const appConfig = require('../common/app-config');
const aux = require('../common/auxiliary')

exports.addRelease = async (req, res, next) => {

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

  releaseInfo.userId = req.userData.userId;
  const newRelease = new Release(releaseInfo);
  try {
    const release = await newRelease.save();
    res.status(200).json({ message: 'User release added successfully!', release: release });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add new release', error: err });
  }

}

exports.publishRelease = async (req, res, next) => {
  try {
    const release = await Release.findByIdAndUpdate(req.body.id, { published: true });
    res.status(200).json({ message: 'Release published!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to publish release', error: err });
  }
}

exports.getReleaseById = async (req, res, next) => {

  try {
    const release = await Release.findById(req.query.id);
    res.status(200).json({ message: 'Release fetched successfully!', releases: [release] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch release', error: err });
  }

}

exports.getUserReleases = async (req, res, next) => {

  query = Release.find({ userId: req.query.userId });
  let releases;
  try {
    releases = await query.find();
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch releases', error: err });
    return;
  }

  let filterReleases = true;

  if(req.userData) {
    if(req.userData.userId === req.query.userId) {
      filterReleases = false;
    }
  }
  if (filterReleases) {
    releases = releases.filter(release => release.published);
  }

  res.status(200).json({ message: 'Releases fetched successfully!', releases: releases });

}


exports.deleteRelease = async (req, res, next) => {
  let release;
  let songs;
  try {
    release = await Release.findById(req.query.releaseId);
    songs = await Song.find({ releaseId: req.query.releaseId } );
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch release and/or songs', error: err });
    return;
  }
  songs.forEach(async (song) => {
    const songRelativePath = aux.getRelativePath(song.filePath);
    try {
      const result = await deleteFile(songRelativePath);
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete song', error: err });
      return;
    }
  });

  try {
    const release = await Release.findByIdAndRemove(req.query.releaseId);
    res.status(201).json({ message: `Release ${release._id} removed successfully from profile!` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete release', error: err });
  }

}


