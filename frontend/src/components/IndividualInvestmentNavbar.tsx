'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { investmentService } from '@/services/investment';
import { InvestmentStats } from '@/types/investment';
import Link from 'next/link';

export default function IndividualInvestmentNavbar() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InvestmentStats>({
    totalDeposits: 0,
    totalReturns: 0,
    returns: 0,
    activeInvestments: 0,
    totalInvestments: 0,
    projectedReturns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        if (user) {
          const userStats = await investmentService.getUserStats();
          setStats(userStats);
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  if (!user) return null;

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="text-gray-300">
              Welcome, <span className="font-medium">{user.firstName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Total Deposits Card */}
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Deposits</p>
                  {loading ? (
                    <div className="animate-pulse h-4 w-20 bg-gray-700 rounded"></div>
                  ) : (
                    <p className="text-lg font-semibold text-green-400">
                      KES {stats.totalDeposits.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Returns Card */}
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Returns</p>
                  {loading ? (
                    <div className="animate-pulse h-4 w-20 bg-gray-700 rounded"></div>
                  ) : (
                    <p className="text-lg font-semibold text-blue-400">
                      KES {stats.totalReturns.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Active Investments Card */}
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active Investments</p>
                  {loading ? (
                    <div className="animate-pulse h-4 w-8 bg-gray-700 rounded"></div>
                  ) : (
                    <p className="text-lg font-semibold text-purple-400">
                      {stats.activeInvestments}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/investment"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              New Investment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}