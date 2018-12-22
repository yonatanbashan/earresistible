const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'blogsapptokenlongstringrandomcomesnow0$!q1f4nwj4gd!#gd67&#jv6nc64e0&89klx#p!n041pdhu&4s%a3f4h#4c');
    req.userData = { username: decodedToken.username, userId: decodedToken.id }
    next();
  } catch(error) {
    res.status(401).json({
      message: 'Auth failed!'
    });
  }
};
