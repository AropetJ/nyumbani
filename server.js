/**
 * Express router.
 * @type {object}
 */

const express = require('express');
const router = require('./routes/router');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use(morgan('dev'));
// Security middleware
app.use(helmet());
// Session middleware
app.use(session({
  secret: 'rameSSes',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // Enable secure cookie in production
    maxAge: 3600000, // Session expiration time (1 hour)
  }
}));

// API routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
