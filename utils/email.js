require('dotenv').config();

const { text } = require('express');
const nodeMailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

// Create a node mailer transporter
const transporter = nodeMailer.createTransport({
  service: 'Gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

// Function to send password reset email
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

// Function to send email verification email
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
