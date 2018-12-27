const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Release = require('../models/release');
const ReleaseController = require('../controllers/releases');
const photoUpload = require("../middleware/photo-upload");

// User handling


// POST requests

// Add new release
router.post('/add', checkAuth, photoUpload.single('image'), ReleaseController.addRelease);


// PUT request

// Publish release
router.put('/publish', checkAuth, ReleaseController.publishRelease);


// GET requests
router.get('/user', ReleaseController.getUserReleases);
router.get('/get', ReleaseController.getReleaseById);


// DELETE requests
router.delete('', checkAuth, ReleaseController.deleteRelease);


module.exports = router;
