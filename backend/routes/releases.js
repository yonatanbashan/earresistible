const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Release = require('../models/release');
const ReleaseController = require('../controllers/releases');

// User handling


// POST requests

// Add new release
router.post('/add', ReleaseController.addRelease);


// GET requests



module.exports = router;
