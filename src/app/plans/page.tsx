'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

// Define the Plan interface to match the data structure
interface Plan {
  id: string;
  name: string;
  toysPerMonth: number;
  price: number;
  features: string[];
  popular: boolean;
  deposit_amount?: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectPlan } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    // Fetch plans data
    const fetchPlans = async () => {
      try {
        console.log('Fetching plans data...');
        // Use the API route instead of direct JSON file access
        const response = await fetch('/api/plans');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Plans data received:', data);
        
        if (!data || !data.plans || !Array.isArray(data.plans)) {
          throw new Error('Invalid plans data format');
        }
        
        // Map the plans to ensure correct toy limits
        const mappedPlans = data.plans.map((plan: any) => {
          let toysPerMonth = plan.toysPerMonth;
          
          // Ensure correct toy limits based on price
          if (plan.price === 699) {
            toysPerMonth = 1;
          } else if (plan.price === 1299) {
            toysPerMonth = 3;
          } else if (plan.price === 2199) {
            toysPerMonth = 5;
          }
          
          return {
            ...plan,
            toysPerMonth
          };
        });
        
        setPlans(mappedPlans);
        setError(null);
      } catch (err) {
        console.error('Error loading plans:', err);
        setError('Failed to load plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan selection
  const handleSelectPlan = (plan: Plan) => {
    console.log('Plan selected in plans page:', plan);
    
    // Create a plan object that matches the Plan interface in cart store
    const planForCart: Plan = {
      id: plan.id,
      name: plan.name,
      toysPerMonth: plan.toysPerMonth || 0,
      price: plan.price,
      features: plan.features || [],
      popular: plan.popular || false,
      deposit_amount: plan.deposit_amount || 0
    };
    
    // Add deposit amount based on plan price
    if (planForCart.price === 699) {
      planForCart.deposit_amount = 1000;
      planForCart.toysPerMonth = planForCart.toysPerMonth || 1;  // Ensure correct toy limit
    } else if (planForCart.price === 1299) {
      planForCart.deposit_amount = 3000;
      planForCart.toysPerMonth = planForCart.toysPerMonth || 3;  // Ensure correct toy limit
    } else if (planForCart.price === 2199) {
      planForCart.deposit_amount = 6000;
      planForCart.toysPerMonth = planForCart.toysPerMonth || 5;  // Ensure correct toy limit
    }
    
    console.log('Plan being sent to cart store:', planForCart);
    
    // Use the cart store's selectPlan function to properly set the plan
    selectPlan(planForCart);
    
    // Navigate to the toys page with plan information
    router.push(`/toys?plan=${plan.id}&toysPerMonth=${planForCart.toysPerMonth}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-36 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Plans</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-600 mb-4">No Plans Available</h2>
          <p className="text-gray-600">We couldn't find any subscription plans at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-indigo-600">Subscription Plans</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect toy subscription plan for your child and unlock a world of play, learning, and fun
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`
                bg-white rounded-2xl shadow-lg overflow-hidden
                ${plan.popular ? 'ring-2 ring-indigo-600 transform md:-translate-y-4' : ''}
              `}
            >
              {plan.popular && (
                <div className="bg-indigo-600 text-white text-center py-2 font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
                
                <p className="text-indigo-600 font-semibold mb-6">
                  {plan.toysPerMonth} {plan.toysPerMonth === 1 ? 'toy' : 'toys'} per month
                </p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handleSelectPlan(plan)}
                  className={`
                    block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors
                    ${plan.popular 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                  `}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-4">
              All plans include a refundable security deposit that will be returned when you end your subscription.
              Basic Plan requires ₹1,000 deposit, Pro Plan requires ₹3,000 deposit, and Premium Plan requires ₹6,000 deposit.
            </p>
            <p className="text-gray-600">
              Toys are sanitized and safe for your child. You can exchange toys at any time or keep them by paying the retail price minus the rental amount you've already paid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}