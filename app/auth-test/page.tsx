'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';

export default function AuthTestPage() {
  const { user, isAuthenticated, login, signup, logout, loading } = useAuthStore();
  const [testEmail, setTestEmail] = useState('test@playpro.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [testName, setTestName] = useState('Test User');
  const [message, setMessage] = useState('');

  const handleTestSignup = async () => {
    setMessage('Testing signup...');
    const success = await signup(testName, testEmail, testPassword);
    if (success) {
      setMessage('✅ Signup successful! User credentials stored in Supabase.');
    } else {
      setMessage('❌ Signup failed. Please check console for errors.');
    }
  };

  const handleTestLogin = async () => {
    setMessage('Testing login...');
    const success = await login(testEmail, testPassword);
    if (success) {
      setMessage('✅ Login successful! User authenticated from Supabase.');
    } else {
      setMessage('❌ Login failed. Please check credentials.');
    }
  };

  const handleLogout = async () => {
    await logout();
    setMessage('👋 Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔐 Supabase Authentication Test
          </h1>
          
          {/* Current User Status */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Current User Status</h2>
            {isAuthenticated ? (
              <div className="text-green-600">
                <p>✅ Authenticated</p>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Admin:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-red-600">❌ Not authenticated</p>
            )}
          </div>

          {/* Test Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Name
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Password
              </label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test password"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleTestSignup}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Signup'}
              </button>

              <button
                onClick={handleTestLogin}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Message Display */}
            {message && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{message}</p>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              📝 How It Works
            </h3>
            <ul className="text-yellow-700 space-y-2 text-sm">
              <li>• <strong>Signup:</strong> Creates a new user account in Supabase Auth and stores profile in the users table</li>
              <li>• <strong>Login:</strong> Authenticates user with Supabase Auth and retrieves profile data</li>
              <li>• <strong>Data Storage:</strong> User credentials are securely stored in Supabase backend</li>
              <li>• <strong>Fallback:</strong> If Supabase is unavailable, falls back to localStorage for demo purposes</li>
            </ul>
          </div>

          {/* Environment Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Environment Info</h4>
            <p className="text-sm text-gray-600">
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Not configured'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Not configured'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}