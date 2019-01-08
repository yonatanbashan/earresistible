const User = require('../models/user');
const Profile = require('../models/profile');
const Release = require('../models/release');
const Tag = require('../models/tag');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../common/app-config');
const deleteFile = require('../common/delete-file')
const aux = require('../common/auxiliary')
var FB = require('fb');


exports.getUserByName = async (req, res, next) => {

  if(req.params.username) {
    try {
    const user = await User.findOne({username: req.params.username});
      res.status(200).json({ message: 'User fetched successfully', user: user });
    } catch (err) {
      res.status(500).json({ message: 'Failed to get user', error: err });
    }
  } else {
    next();
  }
}

exports.verifyFBToken = (req, res, next) => {
  let token = null;
  if (req.query.fbToken) {
    token = req.query.fbToken;
  } else if (req.body.fbToken) {
    token = req.query.fbToken;
  }

  if (token) {
    FB.setAccessToken(token);
    FB.api('me', (response) => {
      if (!response.id) {
        res.status(404).json({
          message: 'FB auth failed - token is invalid!',
          code: 'AUTH_FAILED'
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }

}

exports.addUser = async (req, res, next) => {
  let email = req.body.email;

  if (email) { // If adding new user with email, check that it doesn't exist
    const users = await  User.find({ email: email });
    if (users.length > 0) {
      res.status(401).json({ message: 'A username with this email already exists!', code: 'MAIL_EXISTS' });
    }
  }

  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    username: req.body.username,
    password: hash,
    email:    email,
  });

  try {
    const createdUser = await user.save();
    const token = jwt.sign(
      {
        username: createdUser.username,
        email: createdUser.email,
        id: createdUser._id
      },
        appConfig.cryptString,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User added successfully',
      token: token,
      expireLength: 3600
    });

  } catch (err) {
    res.status(500).json({ error: err })
  }


};

exports.loginUser = async (req, res, next) => {

  let foundUser;
  let query;
  if (req.query.username && req.query.email) {
    res.status(401).json({
      message: 'Error: please provide either email or username. Can\'t use both at the same time.',
      code: 'EITHER_MAIL_OR_USERNAME'
    });
    return;
  }

  if (!req.query.username && !req.query.email) {
    res.status(401).json({
      message: 'Error: please provide an email or a username',
      code: 'NO_MAIL_OR_USERNAME'
    });
    return;
  }

  if (req.query.username) {
    const regex = `^${req.query.username}$`;
    query  = User.findOne({ username: { $regex : regex, $options: "i"} });
  }

  if (req.query.email) {
    query  = User.findOne({ email: req.query.email });
  }

  // Login requests
  try {
    const user = await query.findOne();
    if (!user) {
      return res.status(500).json({
        message: 'User not found!',
        code: 'USER_NOT_FOUND'
      });
    }
    foundUser = user;
    const result = await bcrypt.compare(req.query.password, user.password);
    if (!result && !req.query.fbToken) {
      return res.status(404).json({
        message: 'Authentication failed! Password might be incorrect',
        code: 'AUTH_FAILED'
      });
    }
    token = jwt.sign(
      {
        username: foundUser.username,
        email: foundUser.email,
        id: foundUser._id
      },
      appConfig.cryptString,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      token: token,
      expireLength: 3600,
      message: 'User logged in successfully!',
    });
  } catch (err) {
    return res.status(404).json({
      message: 'Authorization failed - something is wrong. Error: ' + err,
      code: 'AUTH_FAILED_OTHER'
    });
  }

}

exports.deleteUser = async (req, res, next) => {

  let releases;

  try {
    const profile = await Profile.findOne({ userId: req.userData.userId });
    releases = profile.releases;
    imagePath = profile.imagePath;
    if (imagePath !== appConfig.defaultPhoto){
      const imageRelativePath = aux.getRelativePath(imagePath);
      const result = await deleteFile(imageRelativePath);
    }
    const deletedProfile = await Profile.deleteOne({ userId: req.userData.userId });
    const deletedReleases = await Release.deleteMany({ _id: { $in: releases }});
    const user = await User.deleteOne({_id: req.userData.userId });
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete user!', error: err })
  }

}

