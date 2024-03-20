const rateLimit = require('express-rate-limit');

/**
 * Creates a rate limiter middleware for limiting failed login attempts.
 *
 * @param {object} options - The options for the rate limiter.
 * @param {number} options.windowMs - The time window in milliseconds.
 * @param {number} options.max - The maximum number of failed attempts allowed within the time window.
 * @param {string} options.message - The message to send when the limit is exceeded.
 * @returns {function} - The rate limiter middleware function.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 failed login attempts
  message: 'Too many failed login attempts. Please try again later.',
});

module.exports = loginLimiter;
// Path: utils/email.js
