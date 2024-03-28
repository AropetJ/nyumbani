import express from 'express';

require('dotenv').config();

import { getUserByEmail, createUser, updateUserById } from '../db/users';
import { authentication, random } from '../helpers';

const SECRET = process.env.SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/**
 * Handles the login functionality.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns The response with the user data or an error message.
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    
    if (user.authentication.password != expectedHash) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie(SECRET, user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
};

/**
 * Registers a new user.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns The registered user object.
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

export const githubLogin = async (req: express.Request, res: express.Response) => {
  const clientId = GITHUB_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/auth/github/callback';
  const scope = 'user';

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(githubAuthUrl);
}

export const githubCallback = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.query;

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to obtain access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Use the access token to fetch user data from GitHub API
    const userDataResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    if (!userDataResponse.ok) {
      throw new Error('Failed to fetch user data from GitHub API');
    }

    const userData = await userDataResponse.json();

    // Create or retrieve user
    const salt = random();
    let user = await createUser({
      email: userData.email,
      username: userData.login,
      authentication: {
        salt,
        password: authentication(salt, SECRET),
        sessionToken: authentication(salt, userData.login),
      },
    });

    // If user creation failed due to uniqueness constraint violation, retrieve existing user
    if (!user) {
      user = await getUserByEmail(userData.email);
    }

    // Set session token and save user
    const sessionSalt = random();
    user.authentication.sessionToken = authentication(sessionSalt, user._id.toString());
    await updateUserById(user._id.toString(), { 'user.authentication.sessionToken': user.authentication.sessionToken });

    // Set session token cookie and respond with user data
    res.cookie(SECRET, user.authentication.sessionToken, { domain: 'localhost', path: '/' });
    return res.status(200).json(user).end();
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
}


// path: server/src/controllers/authentication.ts
