import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import mongoose from 'mongoose';
import router from './router';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

/**
 * Array of allowed origins for CORS (Cross-Origin Resource Sharing).
 * These are the URLs that are allowed to make requests to the server.
 */
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({ origin: allowedOrigins })); // Enable CORS for allowed origins
app.use(morgan('dev')); // Log HTTP requests
app.use(compression()); // Compress HTTP responses
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Secure HTTP headers
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set secure cookie in production
    maxAge: 1200000, // cookie expires in 20 minutes
  }
})); // Enable session management

// Connect to MongoDB
mongoose.Promise = global.Promise; // Use native promises
mongoose.set('strictQuery', true); // Enable strict mode
mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connected')) // Log success message
  .catch(error => console.error('MongoDB connection error:', error)); // Log any errors with MongoDB connection

/**
 * Use the router to handle incoming requests.
 */
app.use('/', router());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
// path: server/src/router.ts
