import { Investment, InvestmentStats, InvestmentResponse } from '@/types/investment';
import { API_URL } from '@/config';
import Cookies from 'js-cookie';

class InvestmentService {
  private getHeaders(): HeadersInit {
    const token = Cookies.get('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async createInvestment(amount: number, phoneNumber: string): Promise<InvestmentResponse> {
    const response = await fetch(`${API_URL}/investments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create investment');
    }

    return response.json();
  }

  async getInvestments(): Promise<Investment[]> {
    const response = await fetch(`${API_URL}/investments`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch investments');
    }

    const result = await response.json();
    return result.data;
  }

  async getUserStats(): Promise<InvestmentStats> {
    const response = await fetch(`${API_URL}/investments/user-stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch investment stats');
    }

    const result = await response.json();
    return result.data;
  }

  async getStats(): Promise<InvestmentStats> {
    const response = await fetch(`${API_URL}/investments/admin/stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch admin investment stats');
    }

    const result = await response.json();
    return result.data;
  }

  async checkPaymentStatus(checkoutRequestId: string): Promise<any> {
    const response = await fetch(`${API_URL}/investments/payment-status/${checkoutRequestId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check payment status');
    }

    return response.json();
  }
}

export const investmentService = new InvestmentService();