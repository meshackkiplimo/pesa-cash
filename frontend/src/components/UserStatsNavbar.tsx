'use client';

import { useEffect, useState } from 'react';
import { investmentService } from '@/services/investment';
import { InvestmentStats } from '@/types/investment';

export default function UserStatsNavbar() {
  const [stats, setStats] = useState<InvestmentStats>({ totalDeposits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const investmentStats = await investmentService.getStats();
        setStats(investmentStats);
      } catch (error) {
        console.error('Failed to fetch investment stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Investment Statistics</h1>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-sm">Total Deposits</span>
              {loading ? (
                <div className="animate-pulse h-6 w-24 bg-gray-200 rounded mt-1"></div>
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  KES {stats.totalDeposits.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}