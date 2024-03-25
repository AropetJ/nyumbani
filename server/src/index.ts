import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
const morgan = require('morgan');

import router from './router';
import mongoose from 'mongoose';

require('dotenv').config();

const app = express();

app.use(cors({
  credentials: true,
}));
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080/');
});

mongoose.Promise = Promise;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
