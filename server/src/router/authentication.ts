import express from 'express';

import { login, register } from '../controllers/authentication';
import { loginLimiter, validate } from '../middlewares';

/**
 * Registers the authentication routes on the provided Express router.
 * @param router - The Express router.
 */
export default (router: express.Router) => {

  /**
   * Registers the '/auth/register' route for user registration.
   * @param validate - The validation middleware.
   * @param register - The registration handler.
   */
  router.post('/auth/register', validate, register);

  /**
   * Registers the '/auth/login' route for user login.
   * @param loginLimiter - The rate limiter middleware for login requests.
   * @param login - The login handler.
   */
  router.post('/auth/login', loginLimiter, login);
};
