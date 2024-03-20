const express = require('express');
const UsersController = require('../controllers/UsersController');
const loginLimiter = require('../utils/loginLimiter');

const router = express.Router();

router.post('/register', UsersController.registerMe);
router.post('/login', loginLimiter, UsersController.loginMe);
router.post('/reset-password-request', UsersController.requestPasswordReset);
router.post('/reset-password', UsersController.passwordReset);
router.post('/email-verification-request', UsersController.requestEmailVerification);
router.post('/verify-email', UsersController.verifyEmail);

module.exports = router;
