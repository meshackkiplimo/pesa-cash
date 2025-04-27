import mongoose from 'mongoose';
import { config } from './index';

const validateConfig = () => {
  const required = [
    { key: 'MONGO_URI', value: config.mongoUri },
    { key: 'JWT_SECRET', value: config.jwtSecret }
  ];

  const missing = required.filter(item => !item.value);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.map(item => item.key).join(', ')}`);
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    validateConfig();
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};