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


// GET requests
router.get('/user', ReleaseController.getUserReleases);


// DELETE requests
router.delete('', checkAuth, ReleaseController.deleteRelease);


module.exports = router;
