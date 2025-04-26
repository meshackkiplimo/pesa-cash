import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  nodeEnv: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pesa_db',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production',
  nodeEnv: process.env.NODE_ENV || 'development',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};

// Ensure required environment variables are set
const requiredEnvVars = ['JWT_SECRET'];
if (config.nodeEnv === 'production') {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is required in production`);
    }
  });
}

export default config;