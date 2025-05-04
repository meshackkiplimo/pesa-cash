export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}


export interface ResetPasswordData {
  password: string;
}
export interface ResetPasswordResponse {
  message: string;
  token: string;
}
export interface ForgotPasswordData {
  email: string;
}
export interface ForgotPasswordResponse {
  message: string;
  token: string;
}
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}