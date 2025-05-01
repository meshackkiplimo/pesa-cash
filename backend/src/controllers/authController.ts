import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { ApiError } from '../middleware/errorHandler';
import { sendEmail } from '../utils/email';
import { config } from '../config';
import crypto from 'crypto';

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
        const error = new Error('No account found with this email') as ApiError;
        error.statusCode = 401;
        throw error;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        const error = new Error('Incorrect password. Forgot your password? Use the forgot password link to reset it.') as ApiError;
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

  // Forgot Password
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('User not found') as ApiError;
        error.statusCode = 404;
        throw error;
      }

      // Generate reset token
      const resetToken = user.generateResetPasswordToken();
      await user.save();

      // Create reset url
      const resetUrl = `${config.baseUrl}/reset-password/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link to reset your password: \n\n ${resetUrl} \n\n If you did not request this, please ignore this email and your password will remain unchanged.`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Request',
          message
        });

        res.json({
          success: true,
          message: 'Password reset email sent'
        });
      } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const error = new Error('Email could not be sent') as ApiError;
        error.statusCode = 500;
        throw error;
      }
    } catch (err) {
      next(err);
    }
  }

  // Reset Password
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Get hashed token
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        const error = new Error('Invalid or expired reset token') as ApiError;
        error.statusCode = 400;
        throw error;
      }

      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
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
}