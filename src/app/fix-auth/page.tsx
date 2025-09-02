'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

// Default users for fallback authentication
const DEFAULT_USERS = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@playpro.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    id: 'demo-001',
    name: 'Demo User',
    email: 'demo@playpro.com',
    password: 'demo123',
    isAdmin: false
  }
];

export default function FixAuthPage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const [status, setStatus] = useState('Initializing authentication system...');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize default users in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('playpro_users', JSON.stringify(DEFAULT_USERS));
          localStorage.removeItem('playpro_current_user');
          setUsers(DEFAULT_USERS);
          setStatus('Authentication system initialized successfully!');
          console.log('Default users initialized');
          
          // Re-initialize the auth store
          await initialize();
        }
      } catch (error) {
        console.error('Error initializing auth system:', error);
        setStatus('Error initializing authentication system');
      }
    };

    initAuth();
  }, [initialize]);

  const handleLogin = (email: string, password: string) => {
    // Store current user in localStorage
    const user = DEFAULT_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('playpro_current_user', JSON.stringify(user));
      // Refresh the page to trigger auth state update
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🧸 PlayPro
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Fix
          </h2>
          <p className="text-sm text-gray-600">
            {status}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-strong bg-white/80 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Default Users</h3>
            
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-sm text-gray-500">Password: {user.password}</div>
                  <div className="text-sm text-gray-500">Admin: {user.isAdmin ? "Yes" : "No"}</div>
                  <div className="mt-2">
                    <button
                      onClick={() => handleLogin(user.email, user.password)}
                      className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Login as {user.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => router.push('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Home Page
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>After logging in, you should see an "Admin" link in the navigation bar if you logged in as the Admin User.</p>
              <p className="mt-1">Click on the "Admin" link to access the admin panel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}