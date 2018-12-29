const jwt = require('jsonwebtoken');
const appConfig = require('../common/app-config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, appConfig.cryptString);
    req.userData = { username: decodedToken.username, userId: decodedToken.id }
    next();
  } catch(error) {
    next();
  }
};
