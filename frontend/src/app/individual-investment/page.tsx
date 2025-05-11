'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { investmentService } from '@/services/investment';
import { Investment, TransactionDetails, InvestmentStats } from '@/types/investment';
import IndividualInvestmentNavbar from '@/components/IndividualInvestmentNavbar';
import TransactionDetailsModal from '@/components/TransactionDetailsModal';
import InvestmentTimer from '@/components/InvestmentTimer';

export default function IndividualInvestmentPage() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPastInvestments, setShowPastInvestments] = useState(false);

  const filteredInvestments = investments.filter(inv =>
    showPastInvestments ? inv.status === 'completed' : inv.status !== 'completed'
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [investmentsData, statsData] = await Promise.all([
          investmentService.getInvestments(),
          investmentService.getUserStats()
        ]);
        setInvestments(investmentsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <IndividualInvestmentNavbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Your Investment Details</h1>
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
            {filteredInvestments.length === 0 ? (
              <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700 text-center">
                <p className="text-gray-400">
                  {showPastInvestments
                    ? "No past investments found. Your investments will appear here when they complete their cycle."
                    : "No active investments found. Start investing to see your investments here."}
                </p>
              </div>
            ) : (
              filteredInvestments.map((investment) => (
              <div
                key={investment._id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
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
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          investment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : investment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : investment.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
                      {investment.status === 'completed' && (
                        <svg
                          className="w-5 h-5 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Returns</p>
                    <p className="text-green-400 font-semibold">
                      KES {investment.returns.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Expected Returns</p>
                    <p className="text-purple-400 font-semibold">
                      KES {(investment.dailyReturn * investment.cycleDays).toLocaleString()}
                    </p>
                  </div>
                  {investment.status === 'active' && (
                    <div className="col-span-6 mt-4">
                      <p className="text-gray-400 text-sm mb-2">Duration</p>
                      <div className="bg-gray-900/50 rounded-lg p-3 inline-block">
                        <InvestmentTimer
                          startDate={new Date(investment.date)}
                          durationDays={investment.cycleDays}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    {investment.transactionDetails && (
                      <button
                        onClick={() => {
                          if (investment.transactionDetails) {
                            setSelectedTransaction(investment.transactionDetails);
                            setIsModalOpen(true);
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Transaction
                      </button>
                    )}
                  </div>
                </div>
              </div>
              ))
            )}

            {investments.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400">No investments found</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {selectedTransaction && isModalOpen && (
        <TransactionDetailsModal
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTransaction(null);
          }}
          transactionDetails={selectedTransaction}
        />
      )}
    </div>
  );
}