import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';

import router from './router';
import mongoose from 'mongoose';

require('dotenv').config();

const app = express();
const SECRET = process.env.SECRET;
const PORT = process.env.PORT;

/**
 * Array of allowed origins for CORS (Cross-Origin Resource Sharing).
 * These are the URLs that are allowed to make requests to the server.
 */
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({ origin: allowedOrigins })); // Enable CORS for allowed origins
app.use(morgan('dev')); // Log HTTP requests
app.use(compression()); // Compress HTTP responses
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(helmet()); // Secure HTTP headers
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // Enable secure cookie in production
    maxAge: 1200000, // Session expiration time (20 mins)
  }
})); // Enable session management

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('Server running on http://localhost:8080/');
});

mongoose.Promise = Promise; // Use native promises
mongoose.set('strictQuery', true); // Enable strict mode for queries
mongoose.connect(process.env.MONGO_URL); // Connect to MongoDB
mongoose.connection.on('error', (error: Error) => console.log(error)); // Log MongoDB errors

app.use('/', router());
// path: server/src/router.ts