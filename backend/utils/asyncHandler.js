/**
 * Wraps an async Express route handler so any thrown error / rejected
 * promise is forwarded to next(err), letting the centralized error
 * middleware handle the response instead of the process crashing.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
