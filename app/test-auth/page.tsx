'use client';

import { useUser } from '@clerk/nextjs';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { useEffect } from 'react';

export default function TestAuthPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { user: fallbackUser, isAuthenticated } = useAuthStore();

  // Initialize auth store
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Authentication Test</h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-medium text-blue-900 mb-2">Clerk Authentication</h2>
            {isLoaded ? (
              isSignedIn ? (
                <div className="space-y-2">
                  <p className="text-sm text-blue-700">Status: Signed in</p>
                  <p className="text-sm text-blue-700">Name: {user?.fullName}</p>
                  <p className="text-sm text-blue-700">Email: {user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              ) : (
                <p className="text-sm text-blue-700">Status: Not signed in</p>
              )
            ) : (
              <p className="text-sm text-blue-700">Loading...</p>
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-medium text-green-900 mb-2">Fallback Authentication</h2>
            {isAuthenticated ? (
              <div className="space-y-2">
                <p className="text-sm text-green-700">Status: Authenticated</p>
                <p className="text-sm text-green-700">Name: {fallbackUser?.name}</p>
                <p className="text-sm text-green-700">Email: {fallbackUser?.email}</p>
                {fallbackUser?.isAdmin && (
                  <p className="text-sm text-green-700">Role: Admin</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-green-700">Status: Not authenticated</p>
            )}
          </div>
          
          <div className="pt-4">
            <Link 
              href="/login" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}