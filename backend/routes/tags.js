const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const TagController = require('../controllers/tags')


// GET requests

// Get tags by userId/text
router.get('/all', TagController.getTags);

// Get top tags by userId
router.get('/top', TagController.getTopTags);

// Search tags by regexp
router.get('/search', TagController.searchTags);

// Get similar artists
router.get('/similar', TagController.getSimilarArtists);

// POST requests

// Add new tag/increment tag
router.post('', TagController.incTag, TagController.addTag);



module.exports = router;
