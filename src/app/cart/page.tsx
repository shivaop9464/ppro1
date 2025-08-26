'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatPriceSimple } from '@/lib/utils';

// Mock Razorpay payment function
const processPayment = (amount: number) => {
  return new Promise((resolve) => {
    // Simulate payment processing
    setTimeout(() => {
      resolve({ success: true, paymentId: `pay_${Date.now()}` });
    }, 2000);
  });
};

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, selectedPlan, updateQuantity, removeFromCart, clearCart, getTotalPrice, loading } = useCartStore();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleQuantityChange = async (toyId: string, newQuantity: number) => {
    await updateQuantity(toyId, newQuantity);
  };

  const handleRemoveItem = async (toyId: string) => {
    await removeFromCart(toyId);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const totalAmount = getTotalPrice();
      
      // Simulate Razorpay payment modal
      const paymentResult = await processPayment(totalAmount);
      
      if (paymentResult) {
        setPaymentSuccess(true);
        clearCart();
        
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const totalPrice = getTotalPrice();
  const itemsTotal = items.reduce((total, item) => total + (item.toy.price * item.quantity), 0);
  const planPrice = selectedPlan ? selectedPlan.price : 0;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your toys will be shipped soon!
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to homepage...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 && !selectedPlan ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Start by browsing our amazing toy collection!
            </p>
            <button
              onClick={() => router.push('/toys')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Toys
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {/* Selected Plan */}
                  {selectedPlan && (
                    <div className="p-6 bg-primary-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-primary-900">
                            {selectedPlan.name} Plan
                          </h3>
                          <p className="text-sm text-primary-700">
                            {selectedPlan.toys_per_month} toys per month
                          </p>
                          <p className="text-xs text-primary-600 mt-1">
                            Monthly subscription
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-900">
                            {formatPriceSimple(selectedPlan.price)}
                          </div>
                          <div className="text-sm text-primary-700">per month</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cart Items */}
                  {items.map((item) => (
                    <div key={item.toy.id} className="p-6">
                      <div className="flex items-center">
                        {/* Toy Image/Icon */}
                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden relative">
                          {item.toy.image_url ? (
                            <Image
                              src={item.toy.image_url}
                              alt={item.toy.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                              onError={(e) => {
                                // Fallback to category icon on error
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="text-3xl">${
                                    item.toy.category === 'Educational' ? '🧩' :
                                    item.toy.category === 'Creative' ? '🎨' :
                                    item.toy.category === 'STEM' ? '🔬' :
                                    item.toy.category === 'Role Play' ? '🏠' :
                                    item.toy.category === 'Musical' ? '🎵' :
                                    item.toy.category === 'Vehicles' ? '🚗' :
                                    item.toy.category === 'Games' ? '🎲' :
                                    item.toy.category === 'Construction' ? '🧱' :
                                    item.toy.category === 'Comfort' ? '🧸' : '🧸'
                                  }</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="text-3xl">
                              {item.toy.category === 'Educational' && '🧩'}
                              {item.toy.category === 'Creative' && '🎨'}
                              {item.toy.category === 'STEM' && '🔬'}
                              {item.toy.category === 'Role Play' && '🏠'}
                              {item.toy.category === 'Musical' && '🎵'}
                              {item.toy.category === 'Vehicles' && '🚗'}
                              {item.toy.category === 'Games' && '🎲'}
                              {item.toy.category === 'Construction' && '🧱'}
                              {item.toy.category === 'Comfort' && '🧸'}
                            </div>
                          )}
                        </div>

                        {/* Toy Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.toy.name}</h3>
                          <p className="text-sm text-gray-600">{item.toy.brand}</p>
                          <p className="text-sm text-primary-600">{item.toy.category} • {item.toy.age_group}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.toy.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={loading}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.toy.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={loading}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right ml-6">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPriceSimple(item.toy.price * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-500">
                              {formatPriceSimple(item.toy.price)} each
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.toy.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Items Subtotal */}
                  {items.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items Subtotal</span>
                      <span className="font-medium">{formatPriceSimple(itemsTotal)}</span>
                    </div>
                  )}

                  {/* Plan Subtotal */}
                  {selectedPlan && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Plan</span>
                      <span className="font-medium">{formatPriceSimple(planPrice)}</span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPriceSimple(totalPrice)}
                      </span>
                    </div>
                    {selectedPlan && (
                      <p className="text-sm text-gray-500 mt-1">
                        Monthly subscription + one-time toy purchases
                      </p>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessingPayment || loading}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Proceed to Payment
                      </>
                    )}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-sm text-gray-500 text-center">
                      You'll be asked to sign in before payment
                    </p>
                  )}

                  {/* Security Info */}
                  <div className="text-xs text-gray-500 text-center mt-4 space-y-1">
                    <p>🔒 Secure payments powered by Razorpay</p>
                    <p>💳 All major credit/debit cards accepted</p>
                    <p>📱 UPI and net banking supported</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}