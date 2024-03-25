import express from 'express';

import { deleteUserById, getUserByEmail, getUsers, getUserById } from '../db/users';
import { authentication, random, sendPasswordResetEmail } from '../helpers';

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
