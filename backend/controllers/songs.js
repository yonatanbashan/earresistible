const Song = require('../models/song');
const Release = require('../models/release');
const appConfig = require('../common/app-config');
const aux = require('../common/auxiliary')

exports.addSong = (req, res, next) => {

  const url = appConfig.AWSAddressSimple;
  let songInfo = req.body;
  if(req.file !== undefined) {
    songInfo.songFile = undefined;
    songInfo.filePath = url + '/' + req.file.key;
  } else {
    res.status(401).json({
      message: 'Song not provided!'
    });
    return;
  }

  let newSong = new Song({
    name: songInfo.name,
    plays: 0,
    filePath: songInfo.filePath,
    releaseName: songInfo.releaseName,
    userId: req.userData.userId
  });

  let newSongId;
  let newSongObj;

  newSong.save()
  .then(song => {
    newSongObj = song;
    newSongId = song._id;
    return Release.findById(songInfo.releaseId);
  })
  .then(release => {
    let newItems = release.items;
    newItems.push(newSongId);
    return Release.findByIdAndUpdate(songInfo.releaseId, { items: newItems });
  })
  .then(() => {
    res.status(201).json({
      message: 'Song added successfully!',
      song: newSongObj
    });
  });

}

exports.getReleaseSongs = (req, res, next) => {

  Song.find({ userId: req.query.userId, releaseName: req.query.releaseName })
  .then(songs => {
    res.status(200).json({
      message: 'Songs fetched successfully!',
      songs: songs
    });
  });

}

exports.deleteSong = (req, res, next) => {
  let failed = false;
  Song.findById(req.query.songId)
  .then(song => {
    // TODO: Check if this is MY song
    const songRelativePath = aux.getRelativePath(song.filePath);
    deleteFile(songRelativePath);
  })
  .then(() => {
    if (!false) {
      return Song.deleteOne({_id: req.query.songId});
    } else {
      return;
    }
  })
  .then(() => {
    if (!failed) {
      res.status(200).json({
        message: 'Song deleted successfully!'
      });
    } else {
      return;
    }
  })
}



