import express from 'express';
import { aiController } from '../controllers/aiController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Protected routes - require authentication
router.use(auth);

// Get AI investment advice
router.post('/advice', aiController.getInvestmentAdvice);

// Get AI investment insights
router.get('/insights', aiController.getInvestmentInsights);

export default router;