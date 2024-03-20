/**
 * Express router for handling user-related routes.
 * @module routes/index
 */

const express = require('express');
const { check } = require('express-validator');

const UsersController = require('../controllers/UsersController');
const loginLimiter = require('../utils/loginLimiter');
const validate = require('../utils/inputValidation');

const router = express.Router();

/**
 * Route for user registration.
 * @name POST /register
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/register', [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
], validate, UsersController.registerMe);

/**
 * Route for user login with rate limiting.
 * @name POST /login
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
router.post('/login', [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }),
], validate, loginLimiter, UsersController.loginMe);

/**
 * Route for requesting password reset.
 * @name POST /reset-password-request
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/reset-password-request', [
  check('email').isEmail().normalizeEmail(),
], validate, UsersController.requestPasswordReset);

/**
 * Route for resetting password.
 * @name POST /reset-password
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/reset-password', [
  check('token').not().isEmpty(),
  check('password').isLength({ min: 6 }),
], validate, UsersController.passwordReset);

/**
 * Route for requesting email verification.
 * @name POST /email-verification-request
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/email-verification-request', [
  check('email').isEmail().normalizeEmail(),
], validate, UsersController.requestEmailVerification);

/**
 * Route for verifying email.
 * @name POST /verify-email
 * @function
 * @memberof module:routes/index
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/verify-email', [
  check('token').not().isEmpty(),
], validate, UsersController.verifyEmail);

module.exports = router;
// Path: routes/router.js
