/**
 * A lightweight, predictable error shape used across controllers so the
 * error middleware can always trust `statusCode` and `message` exist.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
