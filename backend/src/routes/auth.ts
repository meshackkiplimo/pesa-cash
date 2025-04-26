import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth';
import User from '../models/User';
import { validateRequest } from '../middleware/validate';
import { ApiError } from '../middleware/errorHandler';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  validateRequest
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

// Register new user
router.post('/register', registerValidation, async (req, res, next) => {
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
});

// Login user
router.post('/login', loginValidation, async (req, res, next) => {
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
});

// Get current user
router.get('/me', auth, async (req, res, next) => {
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
});

// Logout (just for completeness - actual logout happens on client)
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;