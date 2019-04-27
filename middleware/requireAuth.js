const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  req.isAuth = false;

  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next();
  }

  const isBearer = authHeader.indexOf('Bearer ') >= 0;

  if (!isBearer) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token || token === '') {
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret-key-string');
  } catch (error) {
    return next();
  }

  if (!decodedToken) {
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  return next();
};
