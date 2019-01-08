const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Profile = require('../models/profile');
const ProfileController = require('../controllers/profiles');
const photoUpload = require("../middleware/photo-upload");

// POST requests

// Add new profile
router.post('/add', checkAuth, ProfileController.addProfile);

// Get list of profiles
router.post('/get', ProfileController.getProfiles);

// Update profile
router.put('/update', checkAuth, photoUpload.single('image'), ProfileController.updateProfile);
// router.put('/update', checkAuth, ProfileController.updateProfile);


// GET requests
router.get('', ProfileController.getProfile);



// DELETE requests
router.delete('', checkAuth, ProfileController.deleteField);

module.exports = router;
