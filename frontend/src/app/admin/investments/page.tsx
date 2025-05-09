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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Investment Management</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof investment.userId === 'object' ? investment.userId.email : investment.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {investment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(investment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.status === 'active' ? 'bg-green-100 text-green-800' :
                        investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KES {investment.returns.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                      className="text-red-600 hover:text-red-900 disabled:text-red-300"
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
    </div>
  );
}