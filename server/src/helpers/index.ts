import crypto from 'crypto';
import { body } from 'express-validator';
import nodeMailer from 'nodemailer';

require('dotenv').config();

const SECRET = process.env.SECRET;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const GOOGLE_API = process.env.GOOGLE_API;

/**
 * The email transporter used for sending emails.
 */
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: EMAIL,
    pass: PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

/**
 * Generates an authentication hash using the provided salt and password.
 * @param salt - The salt value used for hashing.
 * @param password - The password to be hashed.
 * @returns The authentication hash as a string.
 */
export const authentication = (salt: string, password: string): string => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

/**
 * Generates a random string using crypto.randomBytes.
 * 
 * @returns {string} The randomly generated string.
 */
export const random = () => crypto.randomBytes(128).toString('base64');

/**
 * Sends a password reset email to the specified email address.
 * @param email - The email address to send the password reset email to.
 * @param token - The password reset token.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'Nyumbani Password Reset',
    // TODO: Add a proper page for password reset
    text: `Click the following link to reset your password: http://example.com/reset-password?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Sends an email verification email to the specified email address.
 * @param email - The email address to send the verification email to.
 * @param token - The verification token to include in the email.
 * @returns A promise that resolves when the email is sent.
 */
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

export const validateRegisterInput = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  // TODO: Add more validation rules as needed
];

export const validateLoginInput = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// /**
//  * Geocodes an address using the Google Maps Geocoding API.
//  * @param address - The address to geocode.
//  * @returns A promise that resolves to an object containing the latitude and longitude of the geocoded address.
//  * @throws If the geocoding request fails or no results are found for the address.
//  */
// export const geocodeAddress = async (location: string): Promise<{ latitude: number, longitude: number }> =>{
//   const apiKey = GOOGLE_API;
//   const encodedAddress = encodeURIComponent(location);
//   const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodedAddress}&limit=5&appid=${apiKey}`;

//   try {
//     const response = await axios.get(apiUrl);
//     const { data } = response;
//     if (data && data.results && data.results.length > 0) {
//       const { lat, lng } = data.results[0].geometry.location;
//       return { latitude: lat, longitude: lng };
//     } else {
//       throw new Error('No results found for the address');
//     }
//   } catch (error) {
//     throw new Error('Failed to geocode address: ' + error.message);
//   }
// }
// Path: server/src/helpers/index.ts
