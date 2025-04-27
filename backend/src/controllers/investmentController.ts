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

      // Validate request
      if (!amount || !phoneNumber) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount and phone number are required'
        });
      }

      // Create a pending investment
      const investment = new Investment({
        userId,
        amount,
        status: 'pending',
        transactionDetails: {
          phoneNumber
        }
      });
      await investment.save();

      // Initiate STK Push
      const stkPushResponse = await mpesaService.initiateSTKPush(phoneNumber, amount);
      
      console.log('M-Pesa STK Push Response:', JSON.stringify(stkPushResponse, null, 2));

      if (!stkPushResponse.CheckoutRequestID || !stkPushResponse.MerchantRequestID) {
        console.error('Invalid M-Pesa response:', stkPushResponse);
        throw new Error('Invalid M-Pesa response');
      }

      // Update investment with transaction details
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

  // Callback URL for M-Pesa
  async mpesaCallback(req: Request, res: Response) {
    try {
      const { Body } = req.body;
      const { stkCallback } = Body;

      // Find investment by CheckoutRequestID
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
        // Payment successful
        console.log('M-Pesa Callback Data:', JSON.stringify(stkCallback, null, 2));

        // Extract M-Pesa receipt number from callback metadata
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

        // Send acknowledgment to Safaricom
        res.json({
          status: 'success',
          message: 'Payment processed successfully'
        });
      } else {
        // Payment failed
        investment.status = 'failed';
        await investment.save();

        console.error('Payment failed:', stkCallback.ResultDesc);
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

  // Check payment status
  async checkPaymentStatus(req: Request, res: Response) {
    try {
      const { checkoutRequestId } = req.params;

      if (!checkoutRequestId) {
        return res.status(400).json({
          status: 'error',
          message: 'Checkout request ID is required'
        });
      }

      const status = await mpesaService.checkTransactionStatus(checkoutRequestId);

      res.json({
        status: 'success',
        data: status
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
        .sort({ date: -1 }); // Sort by date in descending order

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

  async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const investments = await Investment.find({ userId });

      const stats = {
        totalInvested: 0,
        returns: 0,
        activeInvestments: 0,
        projectedReturns: 0
      };

      investments.forEach(investment => {
        // Calculate total invested amount
        stats.totalInvested += investment.amount;

        // Calculate current returns
        stats.returns += investment.returns;

        // Count active investments
        if (investment.status === 'active') {
          stats.activeInvestments += 1;
        }

        // Calculate projected returns (example: 10% return on active investments)
        if (investment.status === 'active') {
          stats.projectedReturns += investment.amount * 0.1;
        }
      });

      res.json({
        status: 'success',
        data: stats
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