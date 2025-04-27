import axios from 'axios';
import { config } from '../config';

class MPesaService {
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  private async getAccessToken(): Promise<string> {
    // Return existing token if still valid
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token as string; // We know it's valid here
    }

    const auth = Buffer.from(`${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`).toString('base64');
    
    try {
      const baseUrl = config.mpesa.environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      const response = await axios.get(
        `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      const token = response.data.access_token;
      if (!token) {
        throw new Error('Received empty token from MPesa');
      }
      
      this.token = token;
      // Token expires in 1 hour
      this.tokenExpiry = new Date(Date.now() + 3600000);
      
      return token;
    } catch (error) {
      console.error('Failed to get MPesa access token:', error);
      throw new Error('Failed to get MPesa access token');
    }
  }

  async initiateSTKPush(phoneNumber: string, amount: number): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${config.mpesa.shortcode}${config.mpesa.passkey}${timestamp}`
      ).toString('base64');

      const baseUrl = config.mpesa.environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      // Ensure phone number starts with 254
      const formattedPhone = phoneNumber
        .replace(/^\+/, '')  // Remove leading + if present
        .replace(/^0/, '254'); // Replace leading 0 with 254

      const response = await axios.post(
        `${baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: config.mpesa.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: config.mpesa.shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: `${config.baseUrl}/api/mpesa/callback`,
          AccountReference: 'Investment Payment',
          TransactionDesc: 'Investment Payment',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to initiate STK push:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  // Verify transaction status
  async checkTransactionStatus(checkoutRequestId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${config.mpesa.shortcode}${config.mpesa.passkey}${timestamp}`
      ).toString('base64');

      const baseUrl = config.mpesa.environment === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';

      const response = await axios.post(
        `${baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: config.mpesa.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to check transaction status:', error);
      throw new Error('Failed to check transaction status');
    }
  }
}

export const mpesaService = new MPesaService();