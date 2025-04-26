'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/signin');
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">InvestPro</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {isAuthenticated && (
            <Link
              href="/investment"
              className="text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Investment
            </Link>
          )}
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                  <div className="py-1" role="menu">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/signup"
                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}