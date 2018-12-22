const jwt_decode = require('jwt-decode');

module.exports = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  return jwt_decode(token);
}
