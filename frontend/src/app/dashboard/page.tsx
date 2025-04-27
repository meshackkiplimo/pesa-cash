'use client';

import { useEffect, useState } from 'react';
import { investmentService } from '@/services/investment';
import { Investment, InvestmentStats } from '@/types/investment';

const DashboardPage = () => {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, investmentsData] = await Promise.all([
          investmentService.getStats().catch(() => null),
          investmentService.getInvestments().catch(() => [])
        ]);
        
        if (statsData && Array.isArray(investmentsData)) {
          setStats(statsData);
          setInvestments(investmentsData);
        }
      } catch (error) {
        // Silently handle errors, keeping UI clean
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
// Show investment card if loading, error, or no investments
if (loading || !stats || investments.length === 0) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Investment Journey</h1>
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
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Your Investment Dashboard</h1>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Invested Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Invested</h3>
          <p className="text-2xl font-bold text-gray-900">
            KES {stats.totalInvested.toLocaleString()}
          </p>
        </div>

        {/* Returns Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Current Returns</h3>
          <p className="text-2xl font-bold text-green-600">
            KES {stats.returns.toLocaleString()}
          </p>
        </div>

        {/* Active Investments Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Active Investments</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.activeInvestments}
          </p>
        </div>

        {/* Projected Returns Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Projected Returns</h3>
          <p className="text-2xl font-bold text-purple-600">
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
        <h2 className="text-2xl font-bold mb-6">Investment History</h2>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Returns
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(investment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {investment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      investment.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : investment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">
                    +KES {investment.returns.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;