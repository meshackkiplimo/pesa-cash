import { Request, Response } from 'express';
import { mpesaService } from '../services/mpesa';

interface InvestmentRequest {
  amount: number;
  phoneNumber: string;
}

export const investmentController = {
  async createInvestment(req: Request, res: Response) {
    try {
      const { amount, phoneNumber }: InvestmentRequest = req.body;

      // Validate request
      if (!amount || !phoneNumber) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount and phone number are required'
        });
      }

      // Initiate STK Push
      const stkPushResponse = await mpesaService.initiateSTKPush(phoneNumber, amount);

      // Store the checkout request ID for later verification
      // You might want to store this in your database along with the investment details
      const checkoutRequestId = stkPushResponse.CheckoutRequestID;

      res.status(200).json({
        status: 'success',
        message: 'Payment initiated',
        data: {
          checkoutRequestId,
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

      if (Body.stkCallback.ResultCode === 0) {
        // Payment successful
        // Here you would typically:
        // 1. Update the investment status in your database
        // 2. Send notification to the user
        // 3. Update any relevant statistics

        // Send acknowledgment to Safaricom
        res.json({
          status: 'success',
          message: 'Payment processed successfully'
        });
      } else {
        // Payment failed
        console.error('Payment failed:', Body.stkCallback.ResultDesc);
        res.json({
          status: 'error',
          message: Body.stkCallback.ResultDesc
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
  }
};