require('dotenv').config();

const { text } = require('express');
const nodeMailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

/**
 * The transporter object for sending emails.
 *
 * @type {Object}
 */
const transporter = nodeMailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

/**
 * Sends a password reset email to the specified email address.
 *
 * @param {string} email - The email address to send the password reset email to.
 * @param {string} token - The password reset token.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
async function sendPasswordResetEmail(email, token) {
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'Password Reset',
    // TODO: Add a proper page for password reset
    text: 'Click the following link to reset your password: http://example.com/reset-password?token=${token}',
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Sends an email verification email to the specified email address.
 * @param {string} email - The email address to send the verification email to.
 * @param {string} token - The verification token to include in the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent.
 */
async function sendEmailVerificationEmail(email, token) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Email Verification',
    // TODO: Add a proper page for password reset
    text: `Click the following link to verify your email: http://example.com/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail, sendEmailVerificationEmail };
// Path: utils/email.test.js
