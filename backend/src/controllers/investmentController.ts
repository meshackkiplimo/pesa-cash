import { Response } from 'express';
import { Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import { mpesaService } from '../services/mpesa';
import { Investment } from '../models/Investment';
import { User } from '../models/User';

interface InvestmentRequest {
  amount: number;
  phoneNumber: string;
}

const calculateReturns = async (investment: any) => {
  if (investment.status !== 'active') return;

  const now = new Date();
  const startDate = investment.date;
  const lastUpdate = investment.lastReturnsUpdate;
  const totalDaysElapsed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  let cycleDays = 0;
  let ratePerMinute = 0;
  
  // Define cycle days and rates based on investment amount
  if (investment.amount === 1) {
    cycleDays = 3;
    ratePerMinute = 5; // 5 bob per minute
  } else if (investment.amount === 5) {
    cycleDays = 6;
    ratePerMinute = 8; // 8 bob per minute
  } else if (investment.amount === 10) {
    cycleDays = 8;
    ratePerMinute = 15; // 15 bob per minute
  }

  // Only calculate returns if within cycle period
  if (totalDaysElapsed <= cycleDays) {
    // Calculate total returns up to now based on total minutes since start
    const totalMinutesElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
    const expectedTotalReturns = ratePerMinute * totalMinutesElapsed;
    
    // Set returns to expected total (this handles offline periods)
    if (expectedTotalReturns > investment.returns) {
      investment.returns = expectedTotalReturns;
      investment.lastReturnsUpdate = now;
    }
  } else {
    // Complete the investment if cycle is over
    if (!investment.status || investment.status === 'active') {
      investment.status = 'completed';
      
      // Ensure final returns are set correctly
      const totalMinutes = cycleDays * 24 * 60; // Convert days to minutes
      investment.returns = ratePerMinute * totalMinutes;
    }
  }

  await investment.save();
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

      // Set daily return and cycle days based on investment amount
      let dailyReturn = 0;
      let cycleDays = 0;
      
      if (amount === 1) {
        dailyReturn = 7200; // 5 bob per minute = 7200 per day
        cycleDays = 3;
      } else if (amount === 5) {
        dailyReturn = 11520; // 8 bob per minute = 11520 per day
        cycleDays = 6;
      } else if (amount === 10) {
        dailyReturn = 21600; // 15 bob per minute = 21600 per day
        cycleDays = 8;
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid investment amount. Only 1, 5, or 10 bob investments are allowed.'
        });
      }

      const investment = new Investment({
        userId,
        amount,
        status: 'pending',
        dailyReturn,
        cycleDays,
        transactionDetails: {
          phoneNumber
        }
      });
      await investment.save();

      const stkPushResponse = await mpesaService.initiateSTKPush(phoneNumber, amount);

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

        investment.status = 'active';
        investment.lastReturnsUpdate = new Date(); // Set initial returns update time
        
        // Initialize returns to 0 for all investments
        investment.returns = 0;
        
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
      
      // Get all investments
      const investments = await Investment.find({ userId });
      
      // Calculate stats directly from investments
      const activeInvestments = investments.filter(inv => inv.status === 'active');
      
      const stats = {
        totalDeposits: activeInvestments.reduce((sum, inv) => sum + inv.amount, 0),
        totalReturns: investments
          .filter(inv => inv.status === 'active' || inv.status === 'completed')
          .reduce((sum, inv) => sum + inv.returns, 0),
        returns: investments
          .filter(inv => inv.status === 'active' || inv.status === 'completed')
          .reduce((sum, inv) => sum + inv.returns, 0),
        totalInvestments: investments.length,
        activeInvestments: activeInvestments.length,
        projectedReturns: activeInvestments.reduce((sum, inv) => {
          const totalExpectedReturns = inv.dailyReturn * inv.cycleDays;
          const remainingReturns = totalExpectedReturns - inv.returns;
          return sum + (remainingReturns > 0 ? remainingReturns : 0);
        }, 0)
      };

      res.json({
        status: 'success',
        data: stats
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
      // Get all investments
      const allInvestments = await Investment.find();
      const activeInvestments = allInvestments.filter(inv => inv.status === 'active');

      // Get all users
      const users = await User.find();
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.isActive).length;

      // Calculate investment statistics
      const totalDeposits = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      const totalReturns = allInvestments.reduce((sum, inv) => sum + (inv.returns || 0), 0);
      const projectedReturns = activeInvestments.reduce((sum, inv) => {
        const totalExpectedReturns = inv.dailyReturn * inv.cycleDays;
        const remainingReturns = totalExpectedReturns - (inv.returns || 0);
        return sum + (remainingReturns > 0 ? remainingReturns : 0);
      }, 0);

      console.log('Calculated platform statistics:', {
        totalUsers,
        activeUsers,
        totalDeposits,
        totalReturns,
        activeInvestments: activeInvestments.length,
        totalInvestments: allInvestments.length,
        projectedReturns
      });

      res.json({
        status: 'success',
        data: {
          totalUsers,
          activeUsers,
          totalDeposits,
          totalReturns,
          activeInvestments: activeInvestments.length,
          totalInvestments: allInvestments.length,
          projectedReturns,
          returns: totalReturns // For backward compatibility
        }
      });
    } catch (error) {
      console.error('Get investment stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch investment statistics'
      });
    }
  },

  async deleteInvestment(req: AuthRequest, res: Response) {
    try {
      const { investmentId } = req.params;

      if (!investmentId) {
        return res.status(400).json({
          status: 'error',
          message: 'Investment ID is required'
        });
      }

      const investment = await Investment.findById(investmentId);

      if (!investment) {
        return res.status(404).json({
          status: 'error',
          message: 'Investment not found'
        });
      }

      await Investment.findByIdAndDelete(investmentId);

      res.json({
        status: 'success',
        message: 'Investment deleted successfully'
      });
    } catch (error) {
      console.error('Delete investment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete investment'
      });
    }
  }
};