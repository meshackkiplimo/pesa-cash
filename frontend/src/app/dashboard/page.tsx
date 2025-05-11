'use client';

import { useEffect, useState } from 'react';
import { investmentService } from '@/services/investment';
import { Investment, InvestmentStats } from '@/types/investment';

const DashboardPage = () => {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPastInvestments, setShowPastInvestments] = useState(false);

  const filteredInvestments = investments.filter(inv =>
    showPastInvestments ? inv.status === 'completed' : inv.status !== 'completed'
  );

  useEffect(() => {
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
  }, []);
// Show investment card if loading, error, or no investments
// Show loading state
if (loading) {
  return <div className="text-white text-center py-8">Loading...</div>;
}

// Show error state if data couldn't be loaded
if (!stats || !investments) {
  return <div className="text-white text-center py-8">Unable to load dashboard data. Please refresh the page.</div>;
}

// Show first investment card only if we successfully loaded data and there are no investments
if (investments.length === 0) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Welcome to Your Investment Journey</h1>
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
  );
}

return (
  <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Your Investment Dashboard</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Invested Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-5 sm:p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Invested</h3>
          <p className="text-xl sm:text-2xl font-bold text-white">
            KES {stats.totalDeposits.toLocaleString()}
          </p>
        </div>

        {/* Returns Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-5 sm:p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Current Returns</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-400">
            KES {stats.returns.toLocaleString()}
          </p>
        </div>

        {/* Active Investments Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-5 sm:p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Active Investments</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-400">
            {stats.activeInvestments}
          </p>
        </div>

        {/* Projected Returns Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-5 sm:p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Projected Returns</h3>
          <p className="text-xl sm:text-2xl font-bold text-purple-400">
            KES {stats.projectedReturns.toLocaleString()}
          </p>
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
          <h2 className="text-2xl font-bold text-white">Investment History</h2>
          <button
            onClick={() => setShowPastInvestments(!showPastInvestments)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showPastInvestments
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {showPastInvestments ? 'Show Active' : 'Show Past Investments'}
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Returns
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Expected Returns
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 sm:px-6 py-8 text-center text-gray-400">
                    {showPastInvestments
                      ? "No past investments found. Your investments will appear here when they complete their cycle."
                      : "No active investments found. Start investing to see your investments here."}
                  </td>
                </tr>
              ) : (
                filteredInvestments.map((investment) => (
                <tr key={investment._id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(investment.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    KES {investment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      investment.status === 'active'
                        ? 'bg-green-900/50 text-green-400'
                        : investment.status === 'pending'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-gray-900/50 text-gray-400'
                    }`}>
                      {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-green-400">
                    +KES {investment.returns.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-purple-400">
                    KES {(investment.dailyReturn * investment.cycleDays).toLocaleString()}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;