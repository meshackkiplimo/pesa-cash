import express from 'express';
import { AuthController } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } from '../middleware/authValidation';

const router = express.Router();

// Register new user
router.post('/register', registerValidation, AuthController.register);

// Login user
router.post('/login', loginValidation, AuthController.login);

// Get current user
router.get('/me', auth, AuthController.getCurrentUser);

// Logout
router.post('/logout', auth, AuthController.logout);

// Forgot password
router.post('/forgot-password', forgotPasswordValidation, AuthController.forgotPassword);

// Reset password
router.put('/reset-password/:resetToken', resetPasswordValidation, AuthController.resetPassword);

export default router;