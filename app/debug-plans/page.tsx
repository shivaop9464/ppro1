'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

export default function DebugPlansPage() {
  const { selectedPlan, selectPlan } = useCartStore();
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    // Fetch actual plans data
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans');
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: any) => {
    console.log('Selecting plan:', plan);
    selectPlan(plan);
    router.push('/debug-plans');
  };

  const handleClearPlan = () => {
    selectPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Debug Plans</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Selected Plan</h2>
          {selectedPlan ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedPlan.id}</p>
              <p><strong>Name:</strong> {selectedPlan.name}</p>
              <p><strong>Toys per Month:</strong> {selectedPlan.toysPerMonth}</p>
              <p><strong>Price:</strong> ₹{selectedPlan.price}</p>
              <p><strong>Deposit Amount:</strong> ₹{selectedPlan.deposit_amount || 0}</p>
              <p><strong>Popular:</strong> {selectedPlan.popular ? 'Yes' : 'No'}</p>
              <p><strong>Features:</strong> {selectedPlan.features?.join(', ')}</p>
            </div>
          ) : (
            <p className="text-gray-500">No plan selected</p>
          )}
          <button 
            onClick={handleClearPlan}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Plan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-2">₹{plan.price}/month</p>
                <p className="text-gray-600 mb-2">{plan.toysPerMonth} toys per month</p>
                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}