'use client';

import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';

export default function DebugPlanPage() {
  const { selectedPlan, items } = useCartStore();
  const [planInfo, setPlanInfo] = useState<any>(null);

  useEffect(() => {
    // Log the current plan information
    console.log('Current selected plan:', selectedPlan);
    console.log('Current items in cart:', items);
    
    if (selectedPlan) {
      setPlanInfo({
        id: selectedPlan.id,
        name: selectedPlan.name,
        toysPerMonth: selectedPlan.toysPerMonth,
        price: selectedPlan.price,
        itemsCount: items.length,
        canSelectMore: selectedPlan ? items.length < selectedPlan.toysPerMonth : true
      });
    }
  }, [selectedPlan, items]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Plan Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan Status</h2>
          {selectedPlan ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800">Plan Details</h3>
                <p className="text-green-800">ID: {selectedPlan.id}</p>
                <p className="text-green-800">Name: {selectedPlan.name}</p>
                <p className="text-green-800">Toys Per Month: {selectedPlan.toysPerMonth}</p>
                <p className="text-green-800">Price: ₹{selectedPlan.price}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800">Selection Status</h3>
                <p className="text-blue-800">Items Selected: {items.length}</p>
                <p className="text-blue-800">
                  Can Select More: {selectedPlan ? items.length < selectedPlan.toysPerMonth ? 'Yes' : 'No' : 'N/A'}
                </p>
              </div>
              
              {planInfo && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800">Derived Information</h3>
                  <p className="text-purple-800">ID: {planInfo.id}</p>
                  <p className="text-purple-800">Name: {planInfo.name}</p>
                  <p className="text-purple-800">Toys Per Month: {planInfo.toysPerMonth}</p>
                  <p className="text-purple-800">Items Count: {planInfo.itemsCount}</p>
                  <p className="text-purple-800">Can Select More: {planInfo.canSelectMore ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">No plan currently selected</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => console.log('Current plan:', selectedPlan)}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Log Plan to Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}