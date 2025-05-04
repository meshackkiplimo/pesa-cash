import { User } from '@/types/auth';

const BASE_URL = '/api/admin';

export const adminService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user status');
    }

    return response.json();
  },

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return response.json();
  }
};