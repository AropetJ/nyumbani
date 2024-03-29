import express from 'express';

import { getAllUsers, deleteUser, updateUser,passwordReset, requestEmailVerification, verifyEmail } from '../controllers/users';
import { isAuthenticated, isOwner, validate } from '../middlewares';
import { requestPasswordReset } from '../controllers/users';
import { logout } from '../controllers/authentication';

/**
 * Sets up the user routes on the provided Express router.
 * @param router - The Express router to set up the routes on.
 */
export default (router: express.Router) => {

  /**
   * GET /users
   * Route to get all users.
   * Requires authentication.
   */
  router.get('/users', isAuthenticated, getAllUsers);

  /**
   * DELETE /users/:id
   * Route to delete a user by ID.
   * Requires authentication, ownership, and validation.
   */
  router.delete('/users/:id', isAuthenticated, isOwner, validate, deleteUser);

  /**
   * PATCH /users/:id
   * Route to update a user by ID.
   * Requires authentication, ownership, and validation.
   */
  router.patch('/users/:id', isAuthenticated, isOwner, validate, updateUser);

  /**
   * POST /users/reqpasswordreset
   * Route to request a password reset.
   */
  router.post('/users/reqpasswordreset', requestPasswordReset);

  /**
   * POST /users/passwordreset
   * Route to reset a user's password.
   */
  router.post('/users/passwordreset', passwordReset);

  /**
   * POST /users/reqemailverification
   * Route to request email verification.
   */
  router.post('/users/reqemailverification', requestEmailVerification);

  /**
   * POST /users/emailverification
   * Route to verify a user's email.
   */
  router.post('/users/emailverification', verifyEmail);

  router.post('/auth/logout/:id', isAuthenticated, isOwner, logout);
};
