const config = require('../config/config');

/**
 * Catches requests to routes that don't exist and forwards a 404
 * into the error handler below, instead of Express's default HTML page.
 */
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

/**
 * Centralized error handler. Every thrown ApiError (or any Error passed
 * to next()) ends up here so responses stay consistent and predictable
 * for the frontend: { success: false, message, errors? }.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  // MySQL duplicate entry (e.g. unique student_id / email) -> friendly 409
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with this unique value already exists.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.details || undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
}

module.exports = { notFound, errorHandler };
