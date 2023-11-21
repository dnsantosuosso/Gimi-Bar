const jwt = require('jsonwebtoken');

// authenticates user
const isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          console.error('JWT verification error:', err);
          res.status(401).send({
            message: 'Invalid Token. Please Log in Again!',
          });
        } else {
          req.user = decode; // this will have user details from the JWT token
          console.log(JSON.stringify(req.user, null, 2));
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token. Please Log In again!' });
  }
};

// authenticates admin
const isAdmin = (req, res, next) => {
  if (req.username && req.username.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

module.exports = {
  isAuth: isAuth,
  isAdmin: isAdmin,
};
