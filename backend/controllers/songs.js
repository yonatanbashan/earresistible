const Song = require('../models/song');
const Release = require('../models/release');
const appConfig = require('../common/app-config');
const aux = require('../common/auxiliary')
const deleteFile = require('../common/delete-file')

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
    releaseId: songInfo.releaseId,
    userId: req.userData.userId
  });

  newSong.save()
  .then(song => {
    res.status(201).json({
      message: 'Song added successfully!',
      song: song
    });
  });
}

exports.getReleaseSongs = (req, res, next) => {
  console.log(req.query);
  Song.find({ releaseId: req.query.releaseId })
  .then(songs => {
    res.status(200).json({
      message: 'Songs fetched successfully!',
      songs: songs
    });
  });

}

exports.deleteSong = (req, res, next) => {
  console.log(req.query);
  Song.findOne({ _id: req.query.songId, userId: req.userData.userId } )
  .then(song => {
    // TODO: Check if this is MY song
    const songRelativePath = aux.getRelativePath(song.filePath);
    deleteFile(songRelativePath);
  })
  .then(() => {
      return Song.findByIdAndRemove(req.query.songId);
  })
  .then(song => {
    res.status(200).json({
      message: `Song deleted successfully!`
    });
  })
}



