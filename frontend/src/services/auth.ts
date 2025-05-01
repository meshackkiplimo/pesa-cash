import { SignUpData, SignInData, AuthResponse, User, ForgotPasswordData, ResetPasswordData, ForgotPasswordResponse, ResetPasswordResponse } from '@/types/auth';

interface ValidationError {
  msg: string;
}
import { API_URL } from '@/config';
import Cookies from 'js-cookie';

class AuthService {
  private token: string | null = null;

  constructor() {
    // Initialize token from cookie if available
    if (typeof window !== 'undefined') {
      this.token = Cookies.get('token') || null;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}/auth${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      if (errorData.error && errorData.error.errors) {
        // Handle validation errors
        const validationErrors = errorData.error.errors
          .map((err: ValidationError) => err.msg)
          .join(', ');
        throw new Error(validationErrors);
      }
      
      throw new Error(errorData.error?.message || errorData.message || 'Something went wrong');
    }

    return response.json();
  }

  async register(data: SignUpData): Promise<AuthResponse> {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data && response.data.token) {
      this.token = response.data.token;
      // Set cookie with token (expires in 7 days)
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    
    return response.data;
  }

  async login(data: SignInData): Promise<AuthResponse> {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.data && response.data.token) {
      this.token = response.data.token;
      // Set cookie with token (expires in 7 days)
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    return await this.request('/me');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } finally {
      this.token = null;
      Cookies.remove('token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.request('/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword
      }),
    });
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ForgotPasswordResponse> {
    const response = await this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async resetPassword(token: string, data: ResetPasswordData): Promise<ResetPasswordResponse> {
    const response = await this.request(`/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.data && response.data.token) {
      this.token = response.data.token;
      Cookies.set('token', response.data.token, { expires: 7 });
    }

    return response;
  }
}

export const authService = new AuthService();