import express from 'express';
import { merge, get } from 'lodash';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';

require('dotenv').config();

const SECRET = process.env.SECRET;

import { getUserBySessionToken } from '../db/users';
import { getPropertyById } from '../db/properties';

/**
 * Middleware function to check if a user is authenticated.
 * 
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction object.
 * @returns Promise<void>
 */
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies[SECRET];

    if (!sessionToken) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

/**
 * Middleware function to check if the current user is the owner of a resource.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns If the current user is not the owner, it returns a response with status 403 (Unauthorized).
 *          If the current user is not authenticated, it returns a response with status 400 (Unauthorized).
 *          If a server error occurs, it returns a response with status 400 (A server error occurred).
 */
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string;

    if (!currentUserId) {
      return res.status(400).json({ message: 'Unauthorized' });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

/**
 * Middleware function to check if the current user is the owner of a resource.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns If the current user is not the owner, it returns a response with status 403 (Unauthorized).
 *          If the current user is not authenticated, it returns a response with status 400 (Unauthorized).
 *          If a server error occurs, it returns a response with status 400 (A server error occurred).
 */
export const isPropertyOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as string; // Assuming the authenticated user ID is stored in req.identity._id

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized, Please log in' });
    }

    const property = await getPropertyById(id);
    console.log('property', property);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== currentUserId.toString()) {
      console.log('currentUserId', currentUserId);
      console.log('landlordId', property.landlord.toString());
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

/**
 * Rate limiter middleware for login attempts.
 * Limits the number of failed login attempts within a specified time window.
 *
 * @remarks
 * This middleware uses the `rateLimit` function to restrict the number of failed login attempts.
 * If the maximum number of attempts is reached within the specified time window,
 * further login attempts will be blocked and an error message will be returned.
 *
 * @param windowMs - The time window in milliseconds.
 * @param max - The maximum number of failed login attempts allowed within the time window.
 * @param message - The error message to be returned when the maximum number of attempts is reached.
 *
 * @returns The rate limiter middleware function.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 failed login attempts
  message: 'Too many failed login attempts. Please try again later.',
});

/**
 * Validates the request using the express-validator library.
 * If there are validation errors, it sends a 400 response with the errors as JSON.
 * Otherwise, it calls the next middleware in the chain.
 * 
 * @param req - The express request object.
 * @param res - The express response object.
 * @param next - The next middleware function.
 */
export const validate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
