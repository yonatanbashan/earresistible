const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const appConfig = require('./common/app-config.js')

const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');

// Instantiate express app
const app = express();

const mongoDbClusterUser = 'admin';
const dbName = 'ear-db';
const mongoDbClusterPass = appConfig.mongoDbClusterPass;
const connectAddress = 'mongodb+srv://' + mongoDbClusterUser + ':' + mongoDbClusterPass + '@earresistible-wmplj.mongodb.net/' + dbName + '?retryWrites=true';

mongoose.connect(connectAddress)
  .then(() => {
    console.log('Connected to DB!');
  })
  .catch(() => {
    console.log('Failed to connect to DB!');
  });


// Add body parser for JSON requests. Adds 'body' field for req parameters.
app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));

// Access control: to avoid CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With-Header, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use('/api/users', usersRoutes);

// This is the 'valid' way to export the express app
module.exports = app;
