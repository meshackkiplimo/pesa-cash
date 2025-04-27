import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investment';

// Initialize express app
const app: Express = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
// Allow CORS for frontend and M-Pesa
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://yourfrontenddomain.com', // Replace with your frontend domain
        'https://api.safaricom.co.ke',    // M-Pesa production
        'https://sandbox.safaricom.co.ke'  // M-Pesa sandbox
      ]
    : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 minutes
  max: config.rateLimitMax // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing Middleware
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// HTTP request logger
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Health Check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

export default app;