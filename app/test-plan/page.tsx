'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

export default function TestPlanPage() {
  const { selectedPlan, selectPlan } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    // Test with a sample plan
    const testPlan = {
      id: 'basic',
      name: 'Basic',
      toysPerMonth: 1,
      price: 699,
      features: [
        "1 toy per month",
        "Age-appropriate selection",
        "Free shipping & returns",
        "Sanitized & safe toys",
        "Flexible pausing"
      ],
      popular: false
    };
    
    console.log('Setting test plan:', testPlan);
    selectPlan(testPlan);
    
    // Redirect to cart page after setting the plan
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  }, [selectPlan, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Testing Plan Selection</h1>
        <p className="text-gray-600">Setting up test plan and redirecting to cart...</p>
      </div>
    </div>
  );
}
