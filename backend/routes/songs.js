const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Song = require('../models/song');
const SongController = require('../controllers/songs');

// User handling


// POST requests

// Add new song
router.post('/add', SongController.addSong);


// GET requests



module.exports = router;
