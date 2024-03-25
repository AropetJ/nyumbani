import crypto from 'crypto';
import { text } from 'express';
import nodeMailer from 'nodemailer';

require('dotenv').config();

const SECRET = process.env.SECRET;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 587,
  auth: {
    user: EMAIL,
    password: PASSWORD
  }
} as nodeMailer.TransportOptions);

export const authentication = (salt: string, password: string): string => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

export const random = () => crypto.randomBytes(128).toString('base64');

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'Nyumbani Password Reset',
    // TODO: Add a proper page for password reset
    text: 'Click the following link to reset your password: http://example.com/reset-password?token=${token}',
  };

  await transporter.sendMail(mailOptions);
}

export const sendEmailVerificationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'Nyumbani Email Verification',
    // TODO: Add a proper page for password reset
    text: `Click the following link to verify your email: http://example.com/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
}
