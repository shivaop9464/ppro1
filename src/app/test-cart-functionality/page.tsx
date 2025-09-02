'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart';

export default function TestCartFunctionality() {
  const { 
    selectedPlan, 
    selectPlan, 
    getTotalPrice, 
    getPlanPriceWithGST, 
    getGSTAmount, 
    getMonthlyPlanAmount 
  } = useCartStore();
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [planPriceWithGST, setPlanPriceWithGST] = useState(0);
  const [gstAmount, setGSTAmount] = useState(0);
  const [monthlyPlanAmount, setMonthlyPlanAmount] = useState(0);

  // Update calculations when selectedPlan changes
  useEffect(() => {
    setTotalPrice(getTotalPrice());
    setPlanPriceWithGST(getPlanPriceWithGST());
    setGSTAmount(getGSTAmount());
    setMonthlyPlanAmount(getMonthlyPlanAmount());
  }, [selectedPlan, getTotalPrice, getPlanPriceWithGST, getGSTAmount, getMonthlyPlanAmount]);

  // Test plan selection
  const testBasicPlan = () => {
    const basicPlan = {
      id: 'basic',
      name: 'Basic',
      toys_per_month: 1,
      price: 699,
      features: ['1 toy per month', 'Free shipping'],
      is_popular: false,
      deposit_amount: 1000
    };
    
    console.log('Selecting basic plan:', basicPlan);
    selectPlan(basicPlan);
  };

  const testProPlan = () => {
    const proPlan = {
      id: 'pro',
      name: 'Pro',
      toys_per_month: 3,
      price: 1299,
      features: ['3 toys per month', 'Free shipping'],
      is_popular: true,
      deposit_amount: 3000
    };
    
    console.log('Selecting pro plan:', proPlan);
    selectPlan(proPlan);
  };

  const clearPlan = () => {
    console.log('Clearing plan');
    selectPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Cart Functionality</h1>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test Controls */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={testBasicPlan}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Basic Plan (₹699)
                </button>
                
                <button 
                  onClick={testProPlan}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Select Pro Plan (₹1299)
                </button>
                
                <button 
                  onClick={clearPlan}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear Plan
                </button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                {selectedPlan ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>ID:</strong> {selectedPlan.id}</p>
                    <p><strong>Name:</strong> {selectedPlan.name}</p>
                    <p><strong>Price:</strong> ₹{selectedPlan.price}</p>
                    <p><strong>Toys per Month:</strong> {selectedPlan.toys_per_month}</p>
                    <p><strong>Deposit Amount:</strong> ₹{selectedPlan.deposit_amount}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No plan selected</p>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {selectedPlan ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span>Monthly Plan:</span>
                    <span className="font-medium">₹{monthlyPlanAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-medium">₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit Amount:</span>
                    <span className="font-medium">₹{selectedPlan.deposit_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">₹{totalPrice}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a plan to see order summary</p>
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
    </div>
  );
}