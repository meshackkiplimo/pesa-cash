'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';
import { adminService } from '@/services/admin';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await fetchUsers(); // Refresh user list
      setError(null);
    } catch (error) {
      setError('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: boolean) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      await fetchUsers(); // Refresh user list
      setError(null);
    } catch (error) {
      setError('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  }, [user, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value as 'user' | 'admin')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                      onClick={() => handleUpdateStatus(user.id, !user.isActive)}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleUpdateStatus(user.id, !user.isActive)}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        user.isActive
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
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