const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendPasswordResetEmail, sendEmailVerificationEmail } = require('../utils/email');

class UsersController {

  // REGISTRATION
  static async registerMe(req, res) {
    try {
    // Check if the user exists
    const existingUser =await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Enforce password policy
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create a new User
    // TODO: Add other user properties
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });

  }catch (error) {
    console.error(error);
    res.statu(500).json({message: 'Failed to create user, internal server error'});
  };
  }

  // LOGIN
  static async loginMe(req, res) {
    try {
    // Check if a user exists
    const user = await User.findOne({ email: res.body.email });

    if (!user) {
      return res.status(400).json({ message: 'User with this email doesnot exist' });
    }

    // Check for password
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password, please try again' });
    }

    // Generate session token
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login, Internal server error' });
  }
  }

  // REQUEST PASSWORD RESET
  static async requestPasswordReset(req, res) {
    try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found'});
    }

    // Generate a password reset token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Svae the token to the user document
    user.resetPasswordToken = token;
    user.resetPasswordToken = Date.now() + 3600000;
    await user.save();

    // Send the password reset email
    await sendPasswordResetEmail(user.email, token);

    res.status(200).json({ message: 'Password reset email sent'});
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to initiate password reset, Internal server error'});
    
  }
  }

  // PASSWORD RESET
  static async passwordReset(req, res) {
    try {
      const {token, password } = req.body;

      // Find the user by reset password token
      const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token'});
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update the user password
      user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });

    } catch(error) {}
  }

  // REQUEST EMAIL VERIFICATION
  static async requestEmailVerification(req, res) {
    try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate email verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save token to user document
    user.emailVerificationToken = token;
    user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email verification email
    await sendEmailVerificationEmail(user.email, token);

    res.status(200).json({ message: 'Email verification email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  }

  // VERIFY EMAIL
  static async verifyEmail(req, res) {
    try {
    const { token } = req.body;

    // Find user by email verification token
    const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update user email verification status
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  }
}

module.exports = UsersController;
