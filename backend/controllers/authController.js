const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/login
 * Accepts either email or username as "identifier".
 * On success, returns a JWT plus the admin's public profile.
 */
const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const admin = await Admin.findByEmailOrUsername(identifier);
  if (!admin) {
    // Same message as a wrong password, so we don't reveal which part failed.
    throw new ApiError(401, 'Invalid email/username or password.');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email/username or password.');
  }

  const token = generateToken(admin);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    token,
    admin: { id: admin.id, username: admin.username, email: admin.email },
  });
});

/**
 * POST /api/auth/logout
 * JWTs are stateless, so "logout" server-side is a no-op that simply
 * confirms the request; the frontend is responsible for discarding the token.
 * (A production system could additionally maintain a token blocklist.)
 */
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/profile
 * Requires the `protect` middleware to have already run.
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
});

module.exports = { login, logout, getProfile };
