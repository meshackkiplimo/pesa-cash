import express from 'express';
import { investmentController } from '../controllers/investmentController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', auth, investmentController.createInvestment);
router.get('/', auth, investmentController.getInvestments);

// User stats - only requires auth
router.get('/user-stats', auth, investmentController.getUserStats);

// Admin stats - requires both auth and admin privileges
router.get('/stats', auth, adminAuth, investmentController.getStats);

// Payment status
router.get('/payment-status/:checkoutRequestId', auth, investmentController.checkPaymentStatus);

// M-Pesa callback URL (public)
router.post('/mpesa/callback', investmentController.mpesaCallback);

export default router;