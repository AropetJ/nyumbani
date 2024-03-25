import express from 'express';
import { merge, get } from 'lodash';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';

require('dotenv').config();

const SECRET = process.env.SECRET;

import { getUserBySessionToken } from '../db/users';

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

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 failed login attempts
  message: 'Too many failed login attempts. Please try again later.',
});

export const validate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
