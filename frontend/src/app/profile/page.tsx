'use client';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { authService } from '@/services/auth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl leading-6 font-semibold text-white">
            Profile Information
          </h3>
        </div>
        <div className="border-t border-gray-700">
          <dl>
            <div className="bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">First Name</dt>
              <dd className="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">
                {user.firstName}
              </dd>
            </div>
            <div className="bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">
                {user.lastName}
              </dd>
            </div>
            <div className="bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-300">Email</dt>
              <dd className="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">
                {user.email}
              </dd>
            </div>
          </dl>
        </div>

        {/* Password Change Form */}
        <div className="border-t border-gray-700 mt-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-xl leading-6 font-semibold text-white">
              Change Password
            </h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-2 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-900/50 border border-green-700 text-green-100 px-4 py-2 rounded-md">
                  {success}
                </div>
              )}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}