'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function TestGSTPage() {
  const { selectedPlan, selectPlan, getMonthlyPlanAmount, getGSTAmount, getPlanPriceWithGST } = useCartStore();
  const [testPlans] = useState([
    {
      id: 'basic',
      name: 'Basic',
      toysPerMonth: 1,
      price: 699,
      features: ['1 toy per month'],
      popular: false,
      deposit_amount: 1000
    },
    {
      id: 'pro',
      name: 'Pro',
      toysPerMonth: 3,
      price: 1299,
      features: ['3 toys per month'],
      popular: true,
      deposit_amount: 3000
    },
    {
      id: 'premium',
      name: 'Premium',
      toysPerMonth: 5,
      price: 2199,
      features: ['5 toys per month'],
      popular: false,
      deposit_amount: 6000
    }
  ]);

  const [calculations, setCalculations] = useState({
    monthlyPlanAmount: 0,
    gstAmount: 0,
    planPriceWithGST: 0
  });

  useEffect(() => {
    if (selectedPlan) {
      setCalculations({
        monthlyPlanAmount: getMonthlyPlanAmount(),
        gstAmount: getGSTAmount(),
        planPriceWithGST: getPlanPriceWithGST()
      });
    }
  }, [selectedPlan, getMonthlyPlanAmount, getGSTAmount, getPlanPriceWithGST]);

  const handleSelectPlan = (plan: any) => {
    selectPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">GST Calculation Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPlan?.id === plan.id 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectPlan(plan)}
              >
                <h3 className="font-medium text-gray-900">{plan.name}</h3>
                <p className="text-primary-600 font-semibold">₹{plan.price}/month</p>
                <p className="text-sm text-gray-600">Deposit: ₹{plan.deposit_amount}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedPlan && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">GST Calculation Results</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Plan Price (incl. GST)</span>
                <span className="font-medium">₹{calculations.planPriceWithGST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Monthly Plan Amount (excl. GST)</span>
                <span className="font-medium">₹{calculations.monthlyPlanAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{calculations.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 bg-gray-50 rounded-lg px-4 mt-4">
                <span className="font-semibold text-gray-900">Verification:</span>
                <span className="font-semibold">
                  ₹{(calculations.monthlyPlanAmount + calculations.gstAmount).toFixed(2)} = ₹{calculations.planPriceWithGST.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <p>Calculation formula:</p>
                <p className="font-mono">Plan Amount (excl. GST) = Plan Price / 1.18</p>
                <p className="font-mono">GST Amount = Plan Amount (excl. GST) × 0.18</p>
              </div>
            </div>
          </div>
        )}

        {!selectedPlan && (
          <div className="bg-yellow-50 rounded-lg shadow-lg p-8 text-center">
            <p className="text-yellow-800">Select a plan to see GST calculations</p>
          </div>
        )}
      </div>
    </div>
  );
}