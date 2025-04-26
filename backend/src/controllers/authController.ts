import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { ApiError } from '../middleware/errorHandler';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error('Email already registered') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      const user = await User.create({
        email,
        password,
        firstName,
        lastName
      });

      const token = user.generateAuthToken();

      res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Login user
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        const error = new Error('Invalid credentials') as ApiError;
        error.statusCode = 401;
        throw error;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        const error = new Error('Invalid credentials') as ApiError;
        error.statusCode = 401;
        throw error;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = user.generateAuthToken();

      res.json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get current user
  static async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user?.userId);
      if (!user) {
        const error = new Error('User not found') as ApiError;
        error.statusCode = 404;
        throw error;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  // Logout
  static async logout(req: AuthRequest, res: Response) {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}