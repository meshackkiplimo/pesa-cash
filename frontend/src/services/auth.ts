import { SignUpData, SignInData, AuthResponse, User } from '@/types/auth';
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
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  }

  async register(data: SignUpData): Promise<AuthResponse> {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.token = response.token;
    // Set cookie with token (expires in 7 days)
    Cookies.set('token', response.token, { expires: 7 });
    
    return response;
  }

  async login(data: SignInData): Promise<AuthResponse> {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.token = response.token;
    // Set cookie with token (expires in 7 days)
    Cookies.set('token', response.token, { expires: 7 });
    
    return response;
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
}

export const authService = new AuthService();