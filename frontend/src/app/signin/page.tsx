'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth';

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for registration success message
    const registrationSuccess = localStorage.getItem('registrationSuccess');
    if (registrationSuccess) {
      setSuccess(registrationSuccess);
      localStorage.removeItem('registrationSuccess');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      const response = await authService.login({
        email,
        password,
      });
      
      login(response.token, response.user);
      router.replace('/'); // Use replace instead of push
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Sign in to your account
          </h2>
        </div>
        {success && (
          <div className="bg-green-900/50 border border-green-600 text-green-400 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline text-sm">{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline text-sm">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-base text-center">
            <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}