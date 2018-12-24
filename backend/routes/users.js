const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const UserController = require('../controllers/users');

// User handling


// POST requests

// Add new user
router.post('/add', UserController.verifyFBToken, UserController.addUser);



// GET requests

// Login and check existence
router.get('', UserController.verifyFBToken, UserController.loginUser);



module.exports = router;