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

// Get user by username
router.get('/user/:username', UserController.getUserByName);

// Login
router.get('/login', UserController.verifyFBToken, UserController.loginUser);

// DELETE requests

// Delete own user (and profile + releases)
router.delete('', checkAuth, UserController.deleteUser);

module.exports = router;
