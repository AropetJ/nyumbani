import express from 'express';

import authentication from './authentication';
import users from './users';
import properties from './properties';

const router = express.Router();

/**
 * Creates and configures the main router for the application.
 * @returns The configured express.Router instance.
 */
export default (): express.Router => {
  authentication(router);
  users(router);
  properties(router);

  return router;
};
