const Song = require('../models/song');
const Release = require('../models/release');
const appConfig = require('../common/app-config');
const aux = require('../common/auxiliary')
const deleteFile = require('../common/delete-file')

exports.addSong = async (req, res, next) => {
  const url = appConfig.AWSAddressSimple;
  let songInfo = req.body;
  songInfo.filePath = url + '/' + req.file.key;
  let newSong = new Song({
    name: songInfo.name,
    plays: 0,
    filePath: songInfo.filePath,
    releaseName: songInfo.releaseName,
    releaseId: songInfo.releaseId,
    userId: req.userData.userId
  });

  try {
    const song = await newSong.save();
    res.status(201).json({ message: 'Song added successfully!', song: song });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add song', error: err });
  }
}

exports.incSongPlays = async (req, res, next) => {
  try {
    let song = await Song.findById(req.body.songId);
    const newSong = await Song.findByIdAndUpdate(req.body.songId, { plays: song.plays + 1 });
    song.plays++;
    res.status(201).json({ message: 'Song plays incremented successfully!', song: song });
  } catch (err) {
    res.status(500).json({ message: 'Failed to increment song plays', error: err });
  }
}

exports.getReleaseSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({ releaseId: req.query.releaseId })
    res.status(200).json({message: 'Songs fetched successfully!', songs: songs});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch songs', error: err });
  }
}


exports.deleteSong = async (req, res, next) => {
  // TODO: Check if this is MY song
  try {
    const song = await Song.findOne({ _id: req.query.songId, userId: req.userData.userId } );
    const songRelativePath = aux.getRelativePath(song.filePath);
    const result = await deleteFile(songRelativePath);
    const songDeleted = await Song.findByIdAndRemove(req.query.songId);
    res.status(200).json({message: `Song deleted successfully!`});
  } catch (err) {
    res.status(500).json({message: 'Deleting song failed!', error: err });
  }
}



