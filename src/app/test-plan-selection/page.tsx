'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function TestPlanSelection() {
  const { selectedPlan, selectPlan, getTotalPrice, getPlanPriceWithGST, getGSTAmount, getMonthlyPlanAmount } = useCartStore();

  useEffect(() => {
    // Test plan selection
    const testPlan = {
      id: 'test-basic',
      name: 'Test Basic Plan',
      toys_per_month: 1,
      price: 699,
      features: ['1 toy per month', 'Free shipping'],
      is_popular: false,
      deposit_amount: 1000
    };

    console.log('Selecting test plan...');
    selectPlan(testPlan);
  }, [selectPlan]);

  // Calculate values
  const totalPrice = getTotalPrice();
  const planPriceWithGST = getPlanPriceWithGST();
  const gstAmount = getGSTAmount();
  const monthlyPlanAmount = getMonthlyPlanAmount();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Test Plan Selection</h1>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Selected Plan Details</h2>
          
          {selectedPlan ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Plan Name:</span>
                <span>{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span>₹{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Toys per Month:</span>
                <span>{selectedPlan.toys_per_month}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Deposit Amount:</span>
                <span>₹{selectedPlan.deposit_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Popular:</span>
                <span>{selectedPlan.is_popular ? 'Yes' : 'No'}</span>
              </div>
              
              <hr className="my-4" />
              
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monthly Plan:</span>
                  <span>₹{monthlyPlanAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Amount:</span>
                  <span>₹{selectedPlan.deposit_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No plan selected</p>
          )}
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