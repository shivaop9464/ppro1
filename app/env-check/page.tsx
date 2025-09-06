'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EnvCheckPage() {
  // Check environment variables on the client side
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const isClerkConfigured = clerkPublishableKey && 
                           clerkSecretKey && 
                           !clerkPublishableKey.includes('YOUR_PUBLISHABLE_KEY') && 
                           !clerkSecretKey.includes('YOUR_SECRET_KEY');

  const isSupabaseConfigured = supabaseUrl && 
                              supabaseAnonKey && 
                              !supabaseUrl.includes('your-project') && 
                              !supabaseAnonKey.includes('your-anon-key');

  const isRazorpayConfigured = razorpayKeyId && 
                              !razorpayKeyId.includes('rzp_');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Environment Configuration Check</h1>
          
          <div className="space-y-6">
            <div className="p-4 rounded-lg border">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Clerk Authentication</h2>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${isClerkConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={isClerkConfigured ? 'text-green-700' : 'text-red-700'}>
                  {isClerkConfigured ? 'Configured' : 'Not configured properly'}
                </span>
              </div>
              {!isClerkConfigured && (
                <div className="mt-3 p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                  <p>To enable Clerk authentication:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Sign up at <a href="https://dashboard.clerk.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Clerk Dashboard</a></li>
                    <li>Get your API keys</li>
                    <li>Update <code className="bg-gray-100 px-1 rounded">.env.local</code> with real keys</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg border">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Supabase Database</h2>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${isSupabaseConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={isSupabaseConfigured ? 'text-green-700' : 'text-red-700'}>
                  {isSupabaseConfigured ? 'Configured' : 'Not configured properly'}
                </span>
              </div>
              {!isSupabaseConfigured && (
                <div className="mt-3 p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                  <p>To enable Supabase:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Sign up at <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a></li>
                    <li>Create a new project</li>
                    <li>Get your project URL and anon key</li>
                    <li>Update <code className="bg-gray-100 px-1 rounded">.env.local</code> with real values</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg border">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Razorpay Payments</h2>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${isRazorpayConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={isRazorpayConfigured ? 'text-green-700' : 'text-red-700'}>
                  {isRazorpayConfigured ? 'Configured' : 'Using test keys'}
                </span>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <p>Razorpay is ready for processing payments. The application will use test mode until you replace with live keys.</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Note</h3>
              <p className="text-blue-700">
                Even with some services not configured, you can still use the application with demo accounts and local storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}