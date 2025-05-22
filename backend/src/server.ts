import express, { Express } from 'express';
import cron from 'node-cron';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDB } from './config/database';
import { setupAdminUser } from './config/setupAdmin';
import { errorHandler, notFound } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import investmentRoutes from './routes/investment';
import adminRoutes from './routes/admin';
import { Investment } from './models/Investment';

// Initialize express app
const app: Express = express();

// Connect to MongoDB and setup admin user
connectDB().then(() => {
  setupAdminUser();
});

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
// Allow CORS for frontend and M-Pesa
// Enable CORS
app.use(cors({
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Add pre-flight OPTIONS handling
app.options('*', cors()); // Handle pre-flight requests

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
app.use('/api/admin', adminRoutes);

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

  // Set up cron job to update investment returns every minute
  cron.schedule('* * * * *', async () => {
    try {
      const activeInvestments = await Investment.find({ status: 'active' });
      for (const investment of activeInvestments) {
        const now = new Date();
        const lastUpdate = investment.lastReturnsUpdate;
        const minutesElapsed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60));

        let returnsToAdd = 0;
        
        if (investment.amount === 1) {
          returnsToAdd = 5 * minutesElapsed; // 5 bob per minute
        } else if (investment.amount === 5) {
          returnsToAdd = 8 * minutesElapsed; // 8 bob per minute
        } else if (investment.amount === 10) {
          returnsToAdd = 15 * minutesElapsed; // 15 bob per minute
        }

        if (returnsToAdd > 0) {
          investment.returns += returnsToAdd;
          investment.lastReturnsUpdate = now;
          await investment.save();
        }
      }
    } catch (error) {
      console.error('Error updating investment returns:', error);
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  
  process.exit(1);
});

export default app;