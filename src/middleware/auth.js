const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-undef
const privateKey = process.env.PRIVATE_KEY;
// const { response } = require('../helpers');

const verifyAccess = (req, res, next) => {
  // Request
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    const error = new Error('Server need token');
    error.status = 401;
    return next(error);
  }

  const token = tokenHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const error = new Error('token expired');
      error.status = 401;
      return next(error);
    }
    if (err.name === 'JsonWebTokenError') {
      const error = new Error('token invalid');
      error.status = 401;
      return next(error);
    }
    const error = new Error('token not active');
    error.status = 401;
    return next(error);
  }
};

const superAccess = (req, res, next) => {
  // Role User
  const role = req.user.role;

  if (role !== 'admin') {
    const message = new Error(
      `Your account does'nt have access! Super admin only!`
    );
    message.status = 401;
    next(message);
  }
  next();
};

const sellerAccess = (req, res, next) => {
  // Role User
  const role = req.user.role;

  if (role !== 'seller' && role !== 'admin') {
    const message = new Error(`Your account does'nt have access! Seller only`);
    message.status = 401;
    next(message);
  }
  next();
};

module.exports = { verifyAccess, superAccess, sellerAccess };