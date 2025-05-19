import { User } from '@/types/auth';
import { Investment } from '@/types/investment';
import { API_URL } from '@/config';

export interface AdminUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}
const BASE_URL = `${API_URL}/admin`;

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalInvestments: number;
  activeInvestments: number;
  totalDeposits: number;
  totalReturns: number;
  monthlyInvestments: {
    month: string;
    amount: number;
  }[];
  monthlyReturns: {
    month: string;
    amount: number;
  }[];
  userGrowth: {
    month: string;
    count: number;
  }[];
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await fetch(`${BASE_URL}/dashboard-stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard statistics');
    }

    return response.json();
  },

  async getUsers(): Promise<AdminUser[]> {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async updateUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
    const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user status');
    }

    return response.json();
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<AdminUser> {
    const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return response.json();
  },

  async getInvestments(): Promise<Investment[]> {
    const response = await fetch(`${BASE_URL}/investments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investments');
    }

    return response.json();
  },

  async deleteInvestment(investmentId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/investments/${investmentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete investment');
    }
  }
};