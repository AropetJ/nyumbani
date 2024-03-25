import express from 'express';

import { deleteUserById, getUserByEmail, getUsers, getUserById, getUserByPasswordResetToken, getUserByEmailVerificationToken } from '../db/users';
import { authentication, random, sendEmailVerificationEmail, sendPasswordResetEmail } from '../helpers';

require('dotenv').config();

const SECRET = process.env.SECRET;

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await getUserById(id);
    
    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

export const requestPasswordReset = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist' });
    }

    const salt = random();
    user.resetPasswordToken = authentication(salt, user._id.toString());
    // user.resetPasswordToken = Date.now() + 3600000;
    // TODO: Set expiry time to the token

    await user.save();

    await sendPasswordResetEmail(user.email, user.resetPasswordToken);

    res.status(200).json({ message: 'Password reset email sent'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to initiate password reset, Internal server error'});
  }
}

export const passwordReset = async (req: express.Request, res: express.Response) => {
  try {
    const { resetPasswordToken, password } = req.body;

    const user = await getUserByPasswordResetToken(resetPasswordToken);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = random();
    const hashedPassword = authentication(salt, password);

    user.authentication.password = hashedPassword;
    user.authentication.salt = salt;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
};

export const requestEmailVerification = async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist' });
    }

    const salt = random();
    user.emailVerificationToken = authentication(salt, user._id.toString());
    // user.resetPasswordToken = Date.now() + 3600000;
    // TODO: Set expiry time to the token

    await user.save();

    await sendEmailVerificationEmail(user.email, user.emailVerificationToken);

    res.status(200).json({ message: 'Email confirmation message sent'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to initiate email verification, Internal server error'});
  }
}

export const verifyEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { emailVerificationToken } = req.body;

    const user = await getUserByEmailVerificationToken(emailVerificationToken);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
};
