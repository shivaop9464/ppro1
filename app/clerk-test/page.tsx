'use client';

import { useUser, SignInButton, SignUpButton, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function ClerkTestPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Clerk Authentication Test</h1>
          
          <SignedIn>
            <div className="mb-8 p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-2">You are signed in!</h2>
              <p><strong>Name:</strong> {user?.fullName}</p>
              <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
            </div>
            
            <SignOutButton>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>
          
          <SignedOut>
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">You are not signed in</h2>
              <p className="text-blue-700">Sign in or sign up to test Clerk authentication</p>
            </div>
            
            <div className="flex space-x-4">
              <SignInButton mode="modal">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Click "Sign In" or "Sign Up" to test Clerk authentication</li>
              <li>You can use social login options (Google, Facebook, etc.)</li>
              <li>Your existing demo accounts will still work on other pages</li>
              <li>This is just a test page - Clerk integration is now active throughout the app</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}