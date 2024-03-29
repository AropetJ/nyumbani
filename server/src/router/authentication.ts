import express from 'express';
import { validationResult } from 'express-validator';

import { githubCallback, githubLogin, login, register } from '../controllers/authentication';
import { loginLimiter, validate } from '../middlewares';
import { validateLoginInput, validateRegisterInput } from '../helpers';

/**
 * Registers the authentication routes on the provided Express router.
 * @param router - The Express router.
 */
export default (router: express.Router) => {

  /**
   * Registers the '/auth/register' route for user registration.
   * Validates request body before registration.
   * @param validateRegisterInput - The validation middleware for registration input.
   * @param register - The registration handler.
   */
  router.post('/auth/register', validateRegisterInput, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await register(req, res);
    } catch (error) {
      next(error);
    }
  });

  /**
   * Registers the '/auth/login' route for user login.
   * Applies rate limiting middleware to prevent brute force attacks.
   * Validates request body before login.
   * @param loginLimiter - The rate limiter middleware for login requests.
   * @param validateLoginInput - The validation middleware for login input.
   * @param login - The login handler.
   */
  router.post('/auth/login', validateLoginInput, loginLimiter, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await login(req, res);
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
  });

  router.get('/auth/github', githubLogin);
  router.get('/auth/github/callback', githubCallback);
};
