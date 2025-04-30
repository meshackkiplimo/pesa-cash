"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            <span className="block">Invest Smarter</span>
            <span className="block text-blue-500">Grow Your Wealth</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Start your investment journey today with our secure platform. Earn up to 20% yearly returns on your investments.
          </p>
          {!isAuthenticated ? (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/signin"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-white tracking-tight">High Returns</h3>
                  <p className="mt-5 text-base text-gray-400">
                    Earn competitive returns of up to 20% yearly on your investments
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Secure Platform</h3>
                  <p className="mt-5 text-base text-gray-400">
                    Your investments are protected with bank-grade security measures
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-white tracking-tight">Easy Payments</h3>
                  <p className="mt-5 text-base text-gray-400">
                    Convenient M-Pesa integration for seamless transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Options Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Investment Packages
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Choose from our range of investment options
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { amount: '10K', returns: '12%' },
              { amount: '100K', returns: '15%' },
              { amount: '200K', returns: '18%' },
              { amount: '300K', returns: '20%' },
            ].map((option, index) => (
              <div key={index} className="bg-gray-800 rounded-lg px-6 py-8 border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="text-2xl font-bold text-white">KES {option.amount}</div>
                <div className="mt-2 text-blue-500 font-semibold">{option.returns} yearly returns</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to start investing?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Join thousands of investors growing their wealth with us
            </p>
            <div className="mt-8 flex justify-center">
              <div className="rounded-md shadow">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
