'use client';
import { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats } from '@/services/admin';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (loading) {
    return <div className="text-slate-600 text-center py-8">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-slate-600 text-center py-8">Unable to load dashboard data. Please refresh the page.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="text-sm text-slate-600">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Total Users</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
              <p className="text-sm text-slate-600 mt-2">Active Users: {stats.activeUsers}</p>
            </div>
          </div>

          {/* Total Investments Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Investments</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stats.totalInvestments}</p>
              <p className="text-sm text-slate-600 mt-2">Active Investments: {stats.activeInvestments}</p>
            </div>
          </div>

          {/* Total Deposits Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Total Deposits</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">KES {stats.totalDeposits.toLocaleString()}</p>
            </div>
          </div>

          {/* Total Returns Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Total Returns</h3>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">KES {stats.totalReturns.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/admin/investments" className="block bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Manage Investments</h3>
                <p className="text-slate-600">View and manage all user investments</p>
              </div>
            </div>
          </a>

          <a href="/admin/statistics" className="block bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">View Statistics</h3>
                <p className="text-slate-600">Detailed platform statistics and analytics</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;