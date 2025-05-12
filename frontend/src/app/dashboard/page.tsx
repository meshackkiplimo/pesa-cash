'use client';

import { useEffect, useState } from 'react';
import { investmentService } from '@/services/investment';
import { Investment, InvestmentStats } from '@/types/investment';
import InvestmentTimer from '@/components/InvestmentTimer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPastInvestments, setShowPastInvestments] = useState(false);

  const filteredInvestments = investments.filter(inv =>
    showPastInvestments ? inv.status === 'completed' : inv.status !== 'completed'
  );

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user stats and investments separately to better handle errors
        const statsData = await investmentService.getUserStats();
        if (statsData) {
          setStats(statsData);
        }

        const investmentsData = await investmentService.getInvestments();
        if (Array.isArray(investmentsData)) {
          setInvestments(investmentsData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Don't set empty investments array on error to avoid false "no investments" state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  // Show loading state
  if (loading) {
    return <div className="text-slate-600 text-center py-8">Loading...</div>;
  }

  // Show error state if data couldn't be loaded
  if (!stats || !investments) {
    return <div className="text-slate-600 text-center py-8">Unable to load dashboard data. Please refresh the page.</div>;
  }

  // Show first investment card only if we successfully loaded data and there are no investments
  if (investments.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-900">Welcome to Your Investment Journey</h1>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Start Your Investment Journey</h2>
                <p className="text-white text-opacity-90 mb-8">
                  Begin your path to financial growth today. Invest in your future with our secure and reliable investment platform.
                </p>
                <a
                  href="/investment"
                  className="inline-block bg-white text-purple-600 font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Make Your First Investment
                </a>
              </div>
              <div className="bg-black bg-opacity-10 p-6">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-white text-opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Safe and secure investments</span>
                  </div>
                  <div className="flex items-center text-white text-opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>High return potential</span>
                  </div>
                  <div className="flex items-center text-white text-opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Professional portfolio management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Your Investment Dashboard</h1>
          <div className="text-sm text-slate-600">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Investments Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Investments Overview</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">
                KES {stats.totalDeposits.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Total invested amount
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Investments</span>
                <span className="font-medium text-slate-900">
                  {stats.totalInvestments ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Active Investments Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Active Investments</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">
                {stats.activeInvestments}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Currently active investments
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Projected Returns</span>
                <span className="font-medium text-slate-900">
                  KES {stats.projectedReturns.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Returns Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Returns Overview</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">
                KES {stats.returns.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Current returns
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Returns</span>
                <span className="font-medium text-slate-900">
                  KES {stats.totalReturns ? stats.totalReturns.toLocaleString() : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Investment Card */}
        <div className="mt-8 mb-12">
          <a href="/investment" className="block">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Add Another Investment</h3>
                  <p className="text-white text-opacity-90">Grow your portfolio with a new investment</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Investment History Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Investment History</h2>
            <button
              onClick={() => setShowPastInvestments(!showPastInvestments)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPastInvestments
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              {showPastInvestments ? 'Show Active' : 'Show Past Investments'}
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Returns
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Expected Returns
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-slate-500">
                      {showPastInvestments
                        ? "No past investments found. Your investments will appear here when they complete their cycle."
                        : "No active investments found. Start investing to see your investments here."}
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((investment) => (
                  <tr key={investment._id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(investment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      KES {investment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : investment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-green-600">
                      +KES {investment.returns.toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-purple-600">
                      KES {(investment.dailyReturn * investment.cycleDays).toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {investment.status === 'active' ? (
                        <InvestmentTimer
                          startDate={new Date(investment.date)}
                          durationDays={investment.cycleDays}
                        />
                      ) : (
                        <span>Complete</span>
                      )}
                    </td>
                  </tr>
                )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;