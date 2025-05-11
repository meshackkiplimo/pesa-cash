'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Investment } from '@/types/investment';
import { adminService } from '@/services/admin';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInvestments();
      setInvestments(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch investments');
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchInvestments();
  }, [user, router]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Investment Management</h1>
          <div className="text-sm text-slate-600">
            Total: {investments.length} investments
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Returns
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {investments.map((investment) => (
                    <tr key={investment._id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">
                              {typeof investment.userId === 'object' 
                                ? investment.userId.email[0].toUpperCase() 
                                : '#'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm text-slate-900">
                              {typeof investment.userId === 'object' ? investment.userId.email : investment.userId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        KES {investment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(investment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            investment.status === 'active' ? 'bg-green-100 text-green-800' :
                            investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        KES {investment.returns.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this investment?')) {
                              setIsDeleting(true);
                              try {
                                await adminService.deleteInvestment(investment._id);
                                setInvestments(investments.filter(inv => inv._id !== investment._id));
                              } catch (error) {
                                setError('Failed to delete investment');
                                console.error('Error deleting investment:', error);
                              } finally {
                                setIsDeleting(false);
                              }
                            }
                          }}
                          disabled={isDeleting}
                          className="font-medium text-red-600 hover:text-red-800 disabled:text-red-300 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}