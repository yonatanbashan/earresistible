const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const TagController = require('../controllers/tags')


// GET requests

// Get tags by userId/text
router.get('/all', TagController.getTags);

// Get top tags by userId
router.get('/usertop', TagController.getUserTopTags);

// Search tags by regexp
router.get('/search', TagController.searchTags);

// Get similar artists
router.get('/similar', TagController.getSimilarArtists);

// Get top tags
router.get('/top', TagController.getTopTags);

// Get top artists by tag
router.get('/artists', TagController.getArtistsByTag);


// POST requests

// Add new tag/increment tag
router.post('', TagController.incTag, TagController.addTag);

// DELETE requests
router.delete('', checkAuth, TagController.deleteTag);



module.exports = router;
