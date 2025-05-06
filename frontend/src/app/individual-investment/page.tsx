'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { investmentService } from '@/services/investment';
import { Investment } from '@/types/investment';
import IndividualInvestmentNavbar from '@/components/IndividualInvestmentNavbar';

export default function IndividualInvestmentPage() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInvestments = async () => {
      try {
        const data = await investmentService.getInvestments();
        setInvestments(data);
      } catch (error) {
        console.error('Failed to fetch investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInvestments();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <IndividualInvestmentNavbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Your Investment Details</h1>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-800 h-24 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Deposits Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">Total Deposits</h2>
              <p className="text-3xl font-bold text-green-400">
                KES {investments
                  .filter(inv => inv.status === 'active')
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </p>
            </div>

            {/* Individual Investments List */}
            {investments.map((investment) => (
              <div
                key={investment._id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="text-white font-semibold">
                      KES {investment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white">
                      {new Date(investment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        investment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : investment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Returns</p>
                    <p className="text-green-400 font-semibold">
                      KES {investment.returns.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {investments.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400">No investments found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}