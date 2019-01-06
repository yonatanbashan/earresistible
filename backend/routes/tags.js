const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const TagController = require('../controllers/tags')

// POST requests

// Add new song
router.post('', checkAuth, TagController.incTag, TagController.addTag);



module.exports = router;
