import { Response } from 'express';
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mpesaService } from '../services/mpesa';
import { Investment } from '../models/Investment';

interface InvestmentRequest {
  amount: number;
  phoneNumber: string;
}

const calculateReturns = async (investment: any) => {
  if (investment.status !== 'active') return;

  const now = new Date();
  const lastUpdate = investment.lastReturnsUpdate;
  const minutesElapsed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60));

  let returnsToAdd = 0;
  
  if (investment.amount === 1) {
    // For 1 BOB investment:
    // 10 POP immediate return (handled in mpesaCallback)
    // No additional returns
    returnsToAdd = 0;
  } else if (investment.amount === 1000) {
    // 5 KES per minute for 1000 KES investment
    returnsToAdd = 5 * minutesElapsed;
  } else if (investment.amount === 9000) {
    // 90 KES per 5 minutes for 9000 KES investment
    const fiveMinutePeriods = Math.floor(minutesElapsed / 5);
    returnsToAdd = 90 * fiveMinutePeriods;
  }

  if (returnsToAdd > 0) {
    investment.returns += returnsToAdd;
    investment.lastReturnsUpdate = now;
    await investment.save();
  }
};

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

      const expectedReturns = amount === 1 ? 10 : 0; // 10 POP for 1 BOB
      res.status(200).json({
        status: 'success',
        message: 'Payment initiated',
        data: {
          investmentId: investment._id,
          checkoutRequestId: stkPushResponse.CheckoutRequestID,
          merchantRequestId: stkPushResponse.MerchantRequestID,
          expectedReturns
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
        const metadata = stkCallback.CallbackMetadata?.Item || [];
        const mpesaReceiptNumber = metadata.find(
          (item: any) => item.Name === 'MpesaReceiptNumber'
        )?.Value;
        const transactionTime = metadata.find(
          (item: any) => item.Name === 'TransactionDate'
        )?.Value;

        if (!mpesaReceiptNumber) {
          console.error('M-Pesa receipt number not found in callback data');
        }

        console.log('M-Pesa transaction metadata:', JSON.stringify(metadata, null, 2));

        investment.status = 'active';
        investment.lastReturnsUpdate = new Date(); // Set initial returns update time
        
        // Add immediate returns for 1 KES investment
        if (investment.amount === 1) {
          investment.returns = 10; // Immediate 10 POP return
        }
        
        investment.transactionDetails = {
          ...investment.transactionDetails,
          mpesaReceiptNumber: mpesaReceiptNumber || 'NOT_PROVIDED',
          transactionDate: transactionTime ? new Date(transactionTime) : new Date()
        };
        await investment.save();

        res.json({
          status: 'success',
          message: 'Payment processed successfully'
        });
      } else {
        // Delete the investment record if transaction fails
        await Investment.findByIdAndDelete(investment._id);

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
        // Update status to active if successful
        await Investment.findByIdAndUpdate(investment._id, {
          status: 'active',
          'transactionDetails.lastChecked': new Date()
        });

        res.json({
          status: 'success',
          data: {
            status: 'active',
            mpesaStatus: mpesaResponse.ResultDesc,
            ResultCode: Number(mpesaResponse.ResultCode)
          }
        });
      } else {
        // Delete the investment record if transaction failed
        await Investment.findByIdAndDelete(investment._id);

        res.json({
          status: 'error',
          data: {
            status: 'failed',
            mpesaStatus: mpesaResponse.ResultDesc,
            ResultCode: Number(mpesaResponse.ResultCode)
          }
        });
      }
    } catch (error) {
      console.error('Payment status check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to check payment status'
      });
    }
  },

  async updateReturns(req: Request, res: Response) {
    try {
      const investments = await Investment.find({ status: 'active' });
      
      for (const investment of investments) {
        await calculateReturns(investment);
      }

      res.json({
        status: 'success',
        message: 'Returns updated successfully'
      });
    } catch (error) {
      console.error('Update returns error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update returns'
      });
    }
  },

  async getInvestments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const investments = await Investment.find({ userId })
        .sort({ date: -1 });

      // Calculate returns for active investments before sending response
      for (const investment of investments) {
        if (investment.status === 'active') {
          await calculateReturns(investment);
        }
      }

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
      
      // Calculate total deposits for active investments
      const totalActiveDeposits = await Investment.aggregate([
        {
          $match: {
            userId: userId,
            status: 'active'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      // Then get other stats for active/completed investments only
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
            totalReturns: { $sum: '$returns' },
            returns: { $sum: '$returns' },  // Current returns is same as total returns for now
            totalInvestments: { $sum: 1 },
            activeInvestments: {
              $sum: {
                $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
              }
            },
            projectedReturns: {
              $sum: {
                $multiply: ['$amount', 0.15] // 15% projected returns
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalDeposits: 1,
            totalReturns: 1,
            returns: 1,
            totalInvestments: 1,
            activeInvestments: 1,
            projectedReturns: 1
          }
        }
      ]);

      // Combine the stats
      const defaultStats = {
        totalDeposits: totalActiveDeposits[0]?.total || 0,
        totalReturns: 0,
        returns: 0,
        totalInvestments: 0,
        activeInvestments: 0,
        projectedReturns: 0
      };

      const finalStats = stats[0]
        ? { ...stats[0], totalDeposits: totalActiveDeposits[0]?.total || 0 }
        : defaultStats;

      res.json({
        status: 'success',
        data: finalStats
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
      const investments = await Investment.find({ status: 'active' });
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