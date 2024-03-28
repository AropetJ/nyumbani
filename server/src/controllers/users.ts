import express from 'express';

import { deleteUserById, getUserByEmail, getUsers, getUserById, getUserByPasswordResetToken, getUserByEmailVerificationToken, updateUserById } from '../db/users';
import { authentication, random, sendEmailVerificationEmail, sendPasswordResetEmail } from '../helpers';

require('dotenv').config();

import { UserModel } from '../db/users';

const SECRET = process.env.SECRET;

/**
 * Retrieves all users.
 * 
 * @param req - The express request object.
 * @param res - The express response object.
 * @returns A JSON response with all users or an error message.
 */
export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
};

/**
 * Deletes a user by their ID.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the deleted user.
 */
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

/**
 * Updates a user's username.
 * 
 * @param req - The request object containing the user ID and the new username.
 * @param res - The response object used to send the updated user object or an error message.
 * @returns A JSON response containing the updated user object or an error message.
 */
export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Get all fields to update from request body

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Call the updateUserById function to update the user
    const updatedUser = await updateUserById(id, updateFields);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'A server error occurred' });
  }
}

/**
 * Handles the request to reset a user's password.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the status of the password reset request.
 */
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

/**
 * Handles the password reset functionality.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the status of the password reset.
 */
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

/**
 * Handles the request to send an email verification message to a user.
 * @param req - The express Request object.
 * @param res - The express Response object.
 * @returns A JSON response indicating the status of the email verification request.
 */
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

/**
 * Verifies the email of a user using the email verification token.
 * 
 * @param req - The express Request object.
 * @param res - The express Response object.
 * @returns A JSON response indicating the result of the email verification process.
 */
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
// path: server/src/controllers/users.ts
