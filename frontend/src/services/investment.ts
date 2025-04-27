import { Investment, InvestmentStats } from '@/types/investment';
import { API_URL } from '@/config';

export const investmentService = {
  async createInvestment(amount: number, phoneNumber: string): Promise<Investment> {
    const response = await fetch(`${API_URL}/investments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ amount, phoneNumber }),
    });

    if (!response.ok) {
      throw new Error('Failed to create investment');
    }

    return response.json();
  },

  async getInvestments(): Promise<Investment[]> {
    const response = await fetch(`${API_URL}/investments`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investments');
    }

    return response.json();
  },

  async getStats(): Promise<InvestmentStats> {
    const response = await fetch(`${API_URL}/investments/stats`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investment stats');
    }

    return response.json();
  },
};