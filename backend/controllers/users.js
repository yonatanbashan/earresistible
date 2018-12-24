const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../common/app-config');
var FB = require('fb');


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
        res.status(401).json({
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

exports.addUser = (req, res, next) => {
  let email = req.body.email;

  if (email) { // If adding new user with email, check that it doesn't exist

    User.find({ email: email })
    .then(document => {
      if (document.length > 0) {
        res.status(401).json({
          message: 'A username with this email already exists!',
          code: 'MAIL_EXISTS'
        });
      }
    });

  }

  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User({
      username: req.body.username,
      password: hash,
      email:    email,
    });
    user.save()
    .then(createdUser => {
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
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
  });

};

exports.loginUser = (req, res, next) => {

  let foundUser;
  let query;

  if (req.query.username && req.query.email) {
    res.status(401).json({
      message: 'Error: please provide either email or username. Can\'t use both at the same time.',
      code: 'EITHER_MAIL_OR_USERNAME'
    });
  }

  if (!req.query.username && !req.query.email) {
    res.status(401).json({
      message: 'Error: please provide an email or a username',
      code: 'NO_MAIL_OR_USERNAME'
    });
  }

  if (req.query.username) {
    const regex = `^${req.query.username}$`;
    query  = User.findOne({ username: { $regex : regex, $options: "i"} });
  }

  if (req.query.email) {
    query  = User.findOne({ email: req.query.email });
  }

  // Login requests
  query.findOne()
  .then(document => {
    if (!document) {
      return res.status(401).json({
        message: 'User not found!',
        code: 'USER_NOT_FOUND'
      });
    }
    foundUser = document;
    return bcrypt.compare(req.query.password, document.password);
  })
  .then(result => {

    if (!result && !req.query.fbToken) {
      return res.status(401).json({
        message: 'Authentication failed! Password might be incorrect',
        code: 'AUTH_FAILED'
      });
    }
    const token = jwt.sign(
      {
        username: foundUser.username,
        email: foundUser.email,
        id: foundUser._id
      },
      appConfig.cryptString,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token: token,
      expireLength: 3600
    });
  })
  .catch(error => {
    return res.status(401).json({
      message: 'Authorization failed - something is wrong. Error: ' + error,
      code: 'AUTH_FAILED'
    });
  });

}



