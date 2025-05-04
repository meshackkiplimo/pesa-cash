'use client';
import { useEffect, useState } from 'react';
import { investmentService } from '@/services/investment';
import { InvestmentStats } from '@/types/investment';

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await investmentService.getStats();
        console.log('Received stats:', data); // Debug log
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading statistics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Statistics</h1>
        
        <div className="max-w-xl">
          {/* Total Deposits Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-medium text-blue-100 mb-4">Total Money Invested</h3>
            <p className="text-5xl font-bold text-white">
              KES {stats?.totalDeposits.toLocaleString() ?? 0}
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Total amount invested by all users in the platform
            </p>
            <div className="mt-4 text-xs text-blue-300">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}