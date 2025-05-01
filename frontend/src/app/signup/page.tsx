'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function SignUp() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password validation states
  const [hasLength, setHasLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasCapital, setHasCapital] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);

  const validatePassword = (value: string) => {
    setHasLength(value.length >= 8);
    setHasNumber(/[0-9]/.test(value));
    setHasCapital(/[A-Z]/.test(value));
    setHasSymbol(/[!@#$%^&*(),.?":{}|<>]/.test(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate all password requirements
    if (!hasLength || !hasNumber || !hasCapital || !hasSymbol) {
      setError('Please meet all password requirements');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });
      
      if (response.user) {
        // Set success message for signin page
        localStorage.setItem('registrationSuccess', 'Registration successful! Please sign in with your credentials.');
        router.replace('/signin'); // Use replace instead of push
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Create your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
            <span className="block sm:inline text-sm">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
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
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-base"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Password requirements */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${hasLength ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={hasLength ? 'text-green-500' : 'text-red-500'}>
                At least 8 characters long
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${hasNumber ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={hasNumber ? 'text-green-500' : 'text-red-500'}>
                Contains a number
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${hasCapital ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={hasCapital ? 'text-green-500' : 'text-red-500'}>
                Contains a capital letter
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${hasSymbol ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={hasSymbol ? 'text-green-500' : 'text-red-500'}>
                Contains a symbol (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>

          <div className="text-base text-center">
            <Link href="/signin" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}