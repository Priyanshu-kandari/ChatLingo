import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './Routes/auth.routes.js';
import chatRoutes from './Routes/chat.route.js';
import userRoutes from './Routes/user.route.js';

const app = express();

// Core middleware.
app.use(express.json());
app.use(cookieParser());

// Allow the frontend app to call this API with cookies.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local dev origins (localhost + LAN IP) and non-browser tools.
      if (!origin) return callback(null, true);
      if (/^http:\/\/(localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3}):5173$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// API route groups.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

export default app;
