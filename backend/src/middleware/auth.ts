import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from './errorHandler';

export interface UserPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const error = new Error('No authentication token, access denied') as ApiError;
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error('Token is invalid or expired') as ApiError;
    error.statusCode = 401;
    next(error);
  }
};

export const checkRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        const error = new Error('Authentication required') as ApiError;
        error.statusCode = 401;
        throw error;
      }

      // Here you would typically check the user's role from the database
      // For now, we'll leave it as a template
      // const user = await User.findById(req.user.userId);
      // if (!user || !roles.includes(user.role)) {
      //   const error = new Error('Access denied - insufficient permissions') as ApiError;
      //   error.statusCode = 403;
      //   throw error;
      // }

      next();
    } catch (err) {
      next(err);
    }
  };
};