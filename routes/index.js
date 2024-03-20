const UsersController = require('../controllers/UsersController');
const loginLimiter = require('../utils/loginLimiter');

const router = (app) => {
  app.post('/register', UsersController.registerMe);
  app.post('/login', loginLimiter, UsersController.loginMe);
  app.post('/reset-password-request', UsersController.requestPasswordReset);
  app.post('/reset-password', UsersController.passwordReset);
  app.post('/email-verification-request', UsersController.requestEmailVerification);
  app.post('/verify-email', UsersController.verifyEmail);
};

module.exports = router;
