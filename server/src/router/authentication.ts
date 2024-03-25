import express from 'express';

import { login, register } from '../controllers/authentication';
import { loginLimiter, validate } from '../middlewares';

export default (router: express.Router) => {
  router.post('/auth/register', validate, register);
  router.post('/auth/login', loginLimiter, login);
};
