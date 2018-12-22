const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../common/app-config');

exports.addUser = (req, res, next) => {
  let email = req.body.email;

  if (email) { // If adding new user with email, check that it doesn't exist

    User.find({ email: email })
    .then(document => {
      if (document.length > 0) {
        res.status(401).json({
          message: 'A username with this email already exists!'
        });
      }
    });


  }

    console.log(req.body);

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
        username: req.body.username,
        password: hash,
        email:    email,
      });
      user.save().then(createdUser => {
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
      message: 'Error: please provide either email or username. Can\'t use both at the same time.'
    });
  }

  if (!req.query.username && !req.query.email) {
    res.status(401).json({
      message: 'Error: please provide an email or a username'
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
        message: 'User not found!'
      });
    }
    foundUser = document;
    return bcrypt.compare(req.query.password, document.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Authentication failed! Password might be incorrect'
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
      message: 'Authorization failed - something is wrong. Error: ' + error
    });
  });

}



