'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

export default function SocialLoginSetupPage() {
  const steps = [
    {
      title: "Access Clerk Dashboard",
      description: "Go to the Clerk Dashboard at https://dashboard.clerk.com/",
      action: "Sign in with your Clerk account"
    },
    {
      title: "Select Your Application",
      description: "Choose the application you created for PlayPro",
      action: "Click on your application name"
    },
    {
      title: "Navigate to Social Connections",
      description: "Go to User & Authentication > Social Connections",
      action: "Find the Social Connections section in the left sidebar"
    },
    {
      title: "Enable Google Only",
      description: "Enable only Google and configure the OAuth credentials",
      action: "Toggle on Google and configure OAuth settings"
    },
    {
      title: "Disable Other Providers",
      description: "Ensure all other social providers are disabled",
      action: "Turn off Facebook, GitHub, and any other social providers"
    },
    {
      title: "Configure Redirect URLs",
      description: "Set the correct redirect URLs for your application",
      action: "Add your domain to the allowed redirect URLs"
    }
  ];

  const googleConfig = {
    clientId: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET"
  };

  const redirectUrls = [
    "http://localhost:3000",
    "http://localhost:3000/sign-in",
    "http://localhost:3000/sign-up",
    "https://your-domain.com",
    "https://your-domain.com/sign-in",
    "https://your-domain.com/sign-up"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Social Login Setup</h1>
          <p className="text-gray-600">
            Follow these steps to configure Google social login with Clerk while preserving existing admin and demo logins
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Configuration Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Preserve Existing Logins</h3>
                <p className="text-sm text-blue-700">
                  Admin and demo logins will continue to work through the existing authentication system
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Google Social Login</h3>
                <p className="text-sm text-green-700">
                  New users can sign up and log in using their Google accounts
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Hybrid Authentication</h3>
                <p className="text-sm text-purple-700">
                  Both authentication systems work side-by-side without conflicts
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> This setup only configures the Clerk Dashboard. 
                    The application code is already configured to work with Google social login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Step-by-Step Setup</h2>
          </div>
          <div className="p-6">
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-700">Action: {step.action}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Google OAuth Configuration</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">OAuth Credentials</h3>
              <p className="text-gray-600 mb-4">
                You'll need to create OAuth credentials in the Google Cloud Console:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Google Cloud Console</a></li>
                <li>Create a new project or select an existing one</li>
                <li>Navigate to APIs &amp; Services {`>`} Credentials</li>
                <li>Click &quot;Create Credentials&quot; {`>`} &quot;OAuth client ID&quot;</li>
                <li>Select &quot;Web application&quot; as the application type</li>
                <li>Add the following redirect URIs:</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Redirect URIs:</h4>
              <ul className="space-y-1">
                {redirectUrls.map((url, index) => (
                  <li key={index} className="text-sm font-mono text-gray-700 break-all">
                    {url}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                <div className="bg-gray-50 p-3 rounded-md font-mono text-sm text-gray-700">
                  {googleConfig.clientId}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
                <div className="bg-gray-50 p-3 rounded-md font-mono text-sm text-gray-700">
                  {googleConfig.clientSecret}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Testing the Setup</h2>
          </div>
          <div className="p-6">
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Complete all the steps above in the Clerk Dashboard</li>
              <li>Restart your development server: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
              <li>Visit the login page and click on the "Continue with Google" option</li>
              <li>Test that existing admin/demo logins still work by using the email/password forms</li>
              <li>Verify that new users can sign up with Google and existing users can log in with Google</li>
            </ol>
            
            <div className="mt-6 flex justify-center">
              <Link 
                href="/login" 
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
              >
                Test Login Page
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}