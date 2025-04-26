'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { AuthState, User } from '@/types/auth';

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

// Create auth context
interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  startLoading: () => void;
  setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth context provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User) => {
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const startLoading = () => {
    dispatch({ type: 'AUTH_START' });
  };

  const setError = (error: string) => {
    dispatch({ type: 'AUTH_ERROR', payload: error });
  };

  const value = {
    ...state,
    login,
    logout,
    startLoading,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}