const jwt = require('jsonwebtoken');

const tokenGenAndSign = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = { tokenGenAndSign };
