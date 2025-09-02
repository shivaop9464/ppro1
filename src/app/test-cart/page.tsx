'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

export default function TestCartPage() {
  const { 
    selectedPlan, 
    selectPlan, 
    getTotalPrice, 
    getPlanPriceWithGST, 
    getGSTAmount, 
    getMonthlyPlanAmount 
  } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    // Test with a sample plan if none is selected
    if (!selectedPlan) {
      const testPlan = {
        id: 'test-basic',
        name: 'Test Basic Plan',
        toys_per_month: 1,
        price: 699,
        features: ['1 toy per month', 'Free shipping'],
        is_popular: false,
        deposit_amount: 1000
      };
      
      console.log('Selecting test plan:', testPlan);
      selectPlan(testPlan);
    }
  }, [selectedPlan, selectPlan]);

  // Calculate values
  const totalPrice = getTotalPrice();
  const planPriceWithGST = getPlanPriceWithGST();
  const gstAmount = getGSTAmount();
  const monthlyPlanAmount = getMonthlyPlanAmount();

  const handleSelectPlan = (planPrice: number) => {
    let plan;
    if (planPrice === 699) {
      plan = {
        id: 'basic',
        name: 'Basic Plan',
        toys_per_month: 1,
        price: 699,
        features: ['1 toy per month', 'Free shipping'],
        is_popular: false,
        deposit_amount: 1000
      };
    } else if (planPrice === 1299) {
      plan = {
        id: 'pro',
        name: 'Pro Plan',
        toys_per_month: 3,
        price: 1299,
        features: ['3 toys per month', 'Free shipping'],
        is_popular: true,
        deposit_amount: 3000
      };
    } else if (planPrice === 2199) {
      plan = {
        id: 'premium',
        name: 'Premium Plan',
        toys_per_month: 5,
        price: 2199,
        features: ['5 toys per month', 'Free shipping'],
        is_popular: false,
        deposit_amount: 6000
      };
    }
    
    if (plan) {
      selectPlan(plan);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Cart Functionality</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Plan</h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleSelectPlan(699)}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Basic Plan (₹699/month)
              </button>
              
              <button 
                onClick={() => handleSelectPlan(1299)}
                className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Pro Plan (₹1299/month)
              </button>
              
              <button 
                onClick={() => handleSelectPlan(2199)}
                className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Premium Plan (₹2199/month)
              </button>
              
              <button 
                onClick={() => selectPlan(null as any)}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Plan Selection
              </button>
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
            
            {selectedPlan ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Selected Plan:</span>
                  <span>{selectedPlan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Plan Price:</span>
                  <span>₹{selectedPlan.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Plan Amount:</span>
                  <span>₹{monthlyPlanAmount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">GST Amount:</span>
                  <span>₹{gstAmount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Plan Price with GST:</span>
                  <span>₹{planPriceWithGST}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Deposit Amount:</span>
                  <span>₹{selectedPlan.deposit_amount || 0}</span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="font-bold text-lg">₹{totalPrice}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={() => router.push('/cart')}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Go to Cart Page
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No plan selected</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Check the browser console for detailed logs about plan selection and calculation.
          </p>
        </div>
      </div>
    </div>
  );
}