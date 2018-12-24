const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Profile = require('../models/profile');
const ProfileController = require('../controllers/profiles');
const photoUpload = require("../middleware/photo-upload");

// User handling


// POST requests

// Add new release
router.post('/add', checkAuth, ProfileController.addProfile);


// Update profile
router.put('/update', checkAuth, photoUpload.single('image'), ProfileController.updateProfile);
// router.put('/update', checkAuth, ProfileController.updateProfile);


// GET requests
router.get('', ProfileController.getProfile);



// DELETE requests
router.delete('', checkAuth, ProfileController.deleteField);

module.exports = router;
