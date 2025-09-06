'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Plan, useCartStore } from '@/store/cart';
import { formatPriceSimple, ageGroups } from '@/lib/utils';
import plansData from '../../../data/plans.json';

export default function PricingPage() {
  const router = useRouter();
  const { selectPlan, setAgeGroup } = useCartStore();
  const [plans] = useState(plansData.plans);
  const [selectedAgeGroup, setSelectedAgeGroupLocal] = useState<string>('');

  const handlePlanSelection = (plan: any) => {
    // Convert plan to expected interface format
    const convertedPlan: Plan = {
      id: plan.id,
      name: plan.name,
      toys_per_month: plan.toysPerMonth,
      price: plan.price,
      features: plan.features
    };
    
    // Calculate deposit amount based on plan price
    let depositAmount = 0;
    if (plan.price === 699) {
      depositAmount = 1000;
    } else if (plan.price === 1299) {
      depositAmount = 3000;
    } else if (plan.price === 2199) {
      depositAmount = 6000;
    }
    
    // Select the plan
    selectPlan(convertedPlan);
    
    // Set age group if selected
    if (selectedAgeGroup) {
      setAgeGroup(selectedAgeGroup);
    }
    
    // Redirect to cart page
    router.push('/cart');
  };

  const handleAgeGroupSelection = (ageGroup: string) => {
    setSelectedAgeGroupLocal(ageGroup);
    setAgeGroup(ageGroup);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Flexible subscription plans designed to grow with your child. 
            All plans include free shipping, returns, and our safety guarantee.
          </p>
          
          {/* Age Group Selection */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              First, select your child's age group:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ageGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleAgeGroupSelection(group.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedAgeGroup === group.id
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="font-semibold">{group.label}</div>
                  <div className="text-xs opacity-75">{group.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                (plan as any).popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {formatPriceSimple(plan.price)}
                  </div>
                  <div className="text-gray-600">
                    {(plan as any).toysPerMonth} {(plan as any).toysPerMonth === 1 ? 'toy' : 'toys'} per month
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection(plan)}
                  disabled={!selectedAgeGroup}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    (plan as any).popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {selectedAgeGroup ? 'Choose Plan' : 'Select Age Group First'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Plans
            </h2>
            <p className="text-lg text-gray-600">
              See what's included in each subscription tier
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Features
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        <div className="flex flex-col items-center">
                          <span>{plan.name}</span>
                          {(plan as any).popular && (
                            <span className="text-xs text-primary-600 font-medium mt-1">
                              Most Popular
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Monthly Price
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-sm text-center">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPriceSimple(plan.price)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Toys per Month
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-sm text-center font-semibold">
                        {(plan as any).toysPerMonth}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Free Shipping & Returns
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Priority Support
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        {plan.id !== 'basic' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Educational Guides
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        {plan.id !== 'basic' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Exclusive Premium Toys
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        {plan.id === 'premium' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Dedicated Consultant
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        {plan.id === 'premium' ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change my plan anytime?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will take effect from your next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What if my child doesn't like a toy?
                </h3>
                <p className="text-gray-600">
                  No worries! You can return any toy for free, and we'll send a replacement. Our goal is 100% satisfaction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How are toys sanitized?
                </h3>
                <p className="text-gray-600">
                  All toys are thoroughly cleaned and sanitized using child-safe products before being shipped to you.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I pause my subscription?
                </h3>
                <p className="text-gray-600">
                  Absolutely! You can pause your subscription for up to 3 months without any fees. Perfect for vacations or breaks.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Do you ship nationwide?
                </h3>
                <p className="text-gray-600">
                  Yes, we deliver across India with free shipping on all orders. Most deliveries arrive within 2-3 business days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens when my child outgrows toys?
                </h3>
                <p className="text-gray-600">
                  Simply update your child's age in your account, and we'll start sending age-appropriate toys in your next box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}