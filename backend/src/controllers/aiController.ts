import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { aiService } from '../services/ai';
import { Investment } from '../models/Investment';

export const aiController = {
  async getInvestmentAdvice(req: AuthRequest, res: Response) {
    try {
      const { message } = req.body;
      const userId = req.user?.userId;

      if (!message) {
        return res.status(400).json({
          status: 'error',
          message: 'Message is required'
        });
      }

      // Get user's investment history
      const investments = await Investment.find({ userId })
        .sort({ date: -1 })
        .limit(5);

      const response = await aiService.getInvestmentAdvice(message, investments);

      res.json({
        status: 'success',
        data: {
          message: response
        }
      });
    } catch (error) {
      console.error('AI advice error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get investment advice'
      });
    }
  },

  async getInvestmentInsights(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      // Get user's investment history
      const investments = await Investment.find({ userId })
        .sort({ date: -1 })
        .limit(10);

      const insights = await aiService.predictInvestmentTrend(investments);

      res.json({
        status: 'success',
        data: {
          insights
        }
      });
    } catch (error) {
      console.error('AI insights error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get investment insights'
      });
    }
  }
};