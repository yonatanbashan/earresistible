const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Song = require('../models/song');
const SongController = require('../controllers/songs');
const audioUpload = require('../middleware/audio-upload')


// POST requests

// Add new song
router.post('/add', checkAuth, audioUpload.single('song'), SongController.addSong);

// Inc song plays
router.put('/listen', SongController.incSongPlays)

// GET requests
router.get('/release', SongController.getReleaseSongs);

// DELETE requests
router.delete('', checkAuth, SongController.deleteSong);


module.exports = router;
