const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protects a route: requires a valid "Bearer <token>" Authorization header.
 * On success, attaches the authenticated admin (minus password) to req.admin.
 * On failure, responds 401 so the frontend can redirect to /login.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Not authorized. Please log in to continue.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    throw new ApiError(401, 'Session expired or invalid. Please log in again.');
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists.');
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
