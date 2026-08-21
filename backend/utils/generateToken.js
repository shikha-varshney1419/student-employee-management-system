const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Signs a JWT for a given admin payload. Only non-sensitive fields
 * (id, username, email) should ever be passed in — never the password hash.
 */
function generateToken(admin) {
  return jwt.sign(
    { id: admin.id, username: admin.username, email: admin.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

module.exports = generateToken;
