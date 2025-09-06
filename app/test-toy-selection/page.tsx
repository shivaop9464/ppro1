'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

export default function TestToySelectionPage() {
  const { selectedPlan, items, selectPlan, addToCart, removeFromCart } = useCartStore();
  const router = useRouter();
  const [testToy, setTestToy] = useState({
    id: 'test-toy-1',
    name: 'Test Toy',
    description: 'A test toy for debugging',
    age_group: '3-5 years',
    category: 'Educational',
    image_url: '',
    brand: 'PlayPro',
    price: 299,
    stock: 10
  });

  // Set up a test plan
  useEffect(() => {
    if (!selectedPlan) {
      const testPlan = {
        id: 'basic',
        name: 'Basic',
        toysPerMonth: 1,
        price: 699,
        features: ['1 toy per month'],
        popular: false,
        deposit_amount: 1000
      };
      selectPlan(testPlan);
    }
  }, [selectedPlan, selectPlan]);

  const handleSelectToy = async () => {
    try {
      console.log('Selecting toy:', testToy);
      await addToCart(testToy);
      console.log('Toy selected successfully');
    } catch (error) {
      console.error('Error selecting toy:', error);
    }
  };

  const handleRemoveToy = async () => {
    try {
      console.log('Removing toy:', testToy.id);
      await removeFromCart(testToy.id);
      console.log('Toy removed successfully');
    } catch (error) {
      console.error('Error removing toy:', error);
    }
  };

  const handleProceedToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Toy Selection</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
          {selectedPlan ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">Plan: {selectedPlan.name}</p>
              <p className="text-green-800">Toys per month: {selectedPlan.toysPerMonth}</p>
            </div>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">No plan selected</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Toy</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{testToy.name}</h3>
              <p className="text-gray-600">₹{testToy.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSelectToy}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Select Toy
              </button>
              <button
                onClick={handleRemoveToy}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove Toy
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Status</h2>
          <div className="mb-4">
            <p className="text-gray-700">Items in cart: {items.length}</p>
            {items.map((item, index) => (
              <div key={index} className="mt-2 p-2 bg-gray-100 rounded">
                <p className="text-gray-800">{item.toy.name} - Qty: {item.quantity}</p>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleProceedToCart}
            disabled={items.length === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              items.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Proceed to Cart ({items.length} items)
          </button>
        </div>
      </div>
    </div>
  );
}