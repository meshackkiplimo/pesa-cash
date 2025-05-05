import { Response } from 'express';
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mpesaService } from '../services/mpesa';
import { Investment } from '../models/Investment';

interface InvestmentRequest {
  amount: number;
  phoneNumber: string;
}

export const investmentController = {
  async createInvestment(req: AuthRequest, res: Response) {
    try {
      const { amount, phoneNumber }: InvestmentRequest = req.body;
      const userId = req.user?.userId;

      if (!amount || !phoneNumber) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount and phone number are required'
        });
      }

      const investment = new Investment({
        userId,
        amount,
        status: 'pending',
        transactionDetails: {
          phoneNumber
        }
      });
      await investment.save();

      const stkPushResponse = await mpesaService.initiateSTKPush(phoneNumber, amount);
      
      console.log('M-Pesa STK Push Response:', JSON.stringify(stkPushResponse, null, 2));

      if (!stkPushResponse.CheckoutRequestID || !stkPushResponse.MerchantRequestID) {
        console.error('Invalid M-Pesa response:', stkPushResponse);
        throw new Error('Invalid M-Pesa response');
      }

      investment.transactionDetails = {
        ...investment.transactionDetails,
        checkoutRequestId: stkPushResponse.CheckoutRequestID,
        merchantRequestId: stkPushResponse.MerchantRequestID,
      };
      await investment.save();

      res.status(200).json({
        status: 'success',
        message: 'Payment initiated',
        data: {
          investmentId: investment._id,
          checkoutRequestId: stkPushResponse.CheckoutRequestID,
          merchantRequestId: stkPushResponse.MerchantRequestID
        }
      });
    } catch (error) {
      console.error('Investment creation error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process investment payment'
      });
    }
  },

  async mpesaCallback(req: Request, res: Response) {
    try {
      const { Body } = req.body;
      const { stkCallback } = Body;

      const investment = await Investment.findOne({
        'transactionDetails.checkoutRequestId': stkCallback.CheckoutRequestID
      });

      if (!investment) {
        console.error('Investment not found for checkout request ID:', stkCallback.CheckoutRequestID);
        return res.status(404).json({
          status: 'error',
          message: 'Investment not found'
        });
      }

      if (stkCallback.ResultCode === 0) {
        const mpesaReceiptNumber = stkCallback.CallbackMetadata?.Item?.find(
          (item: any) => item.Name === 'MpesaReceiptNumber'
        )?.Value;

        if (!mpesaReceiptNumber) {
          console.error('M-Pesa receipt number not found in callback data');
        }

        investment.status = 'active';
        investment.transactionDetails = {
          ...investment.transactionDetails,
          mpesaReceiptNumber: mpesaReceiptNumber || 'NOT_PROVIDED',
          transactionDate: new Date()
        };
        await investment.save();

        res.json({
          status: 'success',
          message: 'Payment processed successfully'
        });
      } else {
        investment.status = 'failed';
        await investment.save();

        res.json({
          status: 'error',
          message: stkCallback.ResultDesc
        });
      }
    } catch (error) {
      console.error('M-Pesa callback error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process M-Pesa callback'
      });
    }
  },

  async checkPaymentStatus(req: Request, res: Response) {
    try {
      const { checkoutRequestId } = req.params;

      if (!checkoutRequestId) {
        return res.status(400).json({
          status: 'error',
          message: 'Checkout request ID is required'
        });
      }

      const investment = await Investment.findOne({
        'transactionDetails.checkoutRequestId': checkoutRequestId
      });

      if (!investment) {
        return res.status(404).json({
          status: 'error',
          message: 'Investment not found'
        });
      }

      const mpesaResponse = await mpesaService.checkTransactionStatus(checkoutRequestId);

      let status = investment.status;
      
      if (Number(mpesaResponse.ResultCode) === 0) {
        status = 'active';
      } else {
        status = 'failed';
      }

      if (status !== investment.status) {
        await Investment.findByIdAndUpdate(investment._id, {
          status,
          'transactionDetails.lastChecked': new Date()
        });
      }

      res.json({
        status: 'success',
        data: {
          status,
          mpesaStatus: mpesaResponse.ResultDesc,
          ResultCode: Number(mpesaResponse.ResultCode)
        }
      });
    } catch (error) {
      console.error('Payment status check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to check payment status'
      });
    }
  },

  async getInvestments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const investments = await Investment.find({ userId })
        .sort({ date: -1 });

      res.json({
        status: 'success',
        data: investments
      });
    } catch (error) {
      console.error('Get investments error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch investments'
      });
    }
  },

  async getUserStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      
      const stats = await Investment.aggregate([
        { 
          $match: { 
            userId: userId,
            status: { $in: ['active', 'completed'] }
          }
        },
        {
          $group: {
            _id: null,
            totalDeposits: { $sum: '$amount' },
            totalReturns: { $sum: '$returns' },
            totalInvestments: { $sum: 1 },
            activeInvestments: {
              $sum: {
                $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalDeposits: 1,
            totalReturns: 1,
            totalInvestments: 1,
            activeInvestments: 1
          }
        }
      ]);

      const defaultStats = {
        totalDeposits: 0,
        totalReturns: 0,
        totalInvestments: 0,
        activeInvestments: 0
      };

      res.json({
        status: 'success',
        data: stats[0] || defaultStats
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch user statistics'
      });
    }
  },

  async getStats(req: AuthRequest, res: Response) {
    try {
      const investments = await Investment.find({});
      const totalDeposits = investments.reduce((sum, inv) => sum + inv.amount, 0);

      console.log('Found total investments:', investments.length);
      console.log('Calculated total deposits:', totalDeposits);

      res.json({
        status: 'success',
        data: {
          totalDeposits
        }
      });
    } catch (error) {
      console.error('Get investment stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch investment statistics'
      });
    }
  }
};