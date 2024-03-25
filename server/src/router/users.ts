import express from 'express';

import { getAllUsers, deleteUser, updateUser,passwordReset, requestEmailVerification, verifyEmail } from '../controllers/users';
import { isAuthenticated, isOwner, validate } from '../middlewares';
import { requestPasswordReset } from '../controllers/users';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.delete('/users/:id', isAuthenticated, isOwner, validate, deleteUser);
  router.patch('/users/:id', isAuthenticated, isOwner, validate, updateUser);
  router.post('/users/reqpasswordreset', requestPasswordReset);
  router.post('/users/passwordreset', passwordReset);
  router.post('/users/reqemailverification', requestEmailVerification);
  router.post('/users/emailverification', verifyEmail);
};
