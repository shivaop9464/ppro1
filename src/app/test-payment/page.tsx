'use client';

import { useState } from 'react';
import { useRazorpay } from '@/lib/useRazorpay';

export default function TestPaymentPage() {
  const { initializePayment, loading, scriptLoading } = useRazorpay();
  const [result, setResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleTestPayment = async () => {
    try {
      // Check if Razorpay keys are configured
      const isRazorpayConfigured = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
                                   process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== 'your_public_key_here';
      
      if (!isRazorpayConfigured) {
        setResult('Razorpay is not properly configured');
        setIsSuccess(false);
        return;
      }

      const paymentResult = await initializePayment({
        amount: 100, // ₹1.00
        currency: 'INR',
        description: 'Test Payment',
        customerName: 'Test User',
        customerEmail: 'test@example.com'
      });

      if (paymentResult.success) {
        setResult(`Payment successful! Payment ID: ${paymentResult.paymentId}`);
        setIsSuccess(true);
      } else {
        setResult(`Payment failed: ${paymentResult.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Test Payment Gateway</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Razorpay Configuration</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Public Key ID:</span>{' '}
                {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 
                  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.substring(0, 10) + '...' : 
                  'Not configured'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Status: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
                         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== 'your_public_key_here' ? 
                         'Configured' : 'Not configured'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTestPayment}
            disabled={loading || scriptLoading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(loading || scriptLoading) ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Processing...
              </div>
            ) : (
              'Test Payment (₹1.00)'
            )}
          </button>

          {result && (
            <div className={`p-4 rounded-lg ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                {result}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p className="font-medium">Note:</p>
            <p>This is a test transaction. No actual money will be charged when using test keys.</p>
          </div>
        </div>
      </div>
    </div>
  );
}