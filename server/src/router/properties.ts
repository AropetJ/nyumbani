import express from 'express';

import { deleteProperty, getAllProperties, registerProperty, updateProperty } from '../controllers/properties';
import { isAuthenticated, isOwner, isPropertyOwner, validate } from '../middlewares';

/**
 * Sets up the property routes on the provided Express router.
 * @param router - The Express router to set up the routes on.
 */
export default (router: express.Router) => {

  /**
   * GET /properties
   * Route to get all properties
   * Requires authentication.
   */
  router.get('/properties', isAuthenticated, getAllProperties);

  /**
   * Registers the '/createproperty' route for property creation.
   * Validates request body before registration.
   * @param isAuthenticated - The validation middleware for signed in user.
   * @param registerProperty - The registration handler.
   */
  router.post('/createproperty', isAuthenticated, registerProperty);

  /**
   * DELETE /properties/:id
   * Route to delete a property by ID.
   * Requires authentication, ownership, and validation.
   */
  router.delete('/properties/:id', isAuthenticated, isPropertyOwner, validate, deleteProperty);

  /**
   * PATCH /properties/:id
   * Route to update a user by ID.
   * Requires authentication, ownership, and validation.
   */
  router.patch('/properties/:id', isAuthenticated, isPropertyOwner, validate, updateProperty);
};
