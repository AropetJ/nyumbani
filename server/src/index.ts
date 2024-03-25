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
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(helmet());
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // Enable secure cookie in production
    maxAge: 1200000, // Session expiration time (20 mins)
  }
}));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('Server running on http://localhost:8080/');
});

mongoose.Promise = Promise;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
