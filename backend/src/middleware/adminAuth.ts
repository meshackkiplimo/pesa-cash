import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from './auth';
import { ApiError } from './errorHandler';

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      const error = new Error('Authentication required') as ApiError;
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'admin') {
      const error = new Error('Access denied. Admin privileges required.') as ApiError;
      error.statusCode = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};