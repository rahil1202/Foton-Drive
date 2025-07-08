import express from 'express';
import dotenv from './config/dotenv.js';
import connectDB from './config/db.js';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoute from './routes/authRoute.js';
import fileRoute from './routes/fileRoute.js';
import userRoute from './routes/userRoute.js';

dotenv();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://adsiduous-assignment-rahil1202.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the Home Route, API is working :-)');
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/files', fileRoute);
app.use('/api/v1/user', userRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
