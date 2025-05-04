import express from 'express';
import { investmentController } from '../controllers/investmentController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', auth, investmentController.createInvestment);
router.get('/', auth, investmentController.getInvestments);
router.get('/stats', auth, adminAuth, investmentController.getStats);
router.get('/payment-status/:checkoutRequestId', auth, investmentController.checkPaymentStatus);

// M-Pesa callback URL (public)
router.post('/mpesa/callback', investmentController.mpesaCallback);

export default router;