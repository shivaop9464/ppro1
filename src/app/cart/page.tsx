'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, MapPin, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatPriceSimple } from '@/lib/utils';
import { useRazorpay } from '@/lib/useRazorpay';
import AddressForm from '@/components/AddressForm';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const cartStore = useCartStore();
  const { initializePayment, loading: paymentLoading, scriptLoading } = useRazorpay();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Destructure cart store values
  const { 
    items, 
    selectedPlan, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice, 
    getPlanPriceWithGST, 
    getGSTAmount, 
    getMonthlyPlanAmount, 
    loading, 
    shippingAddress, 
    setShippingAddress 
  } = cartStore;

  // Force re-render when cart store changes by using the store directly in a useEffect
  const [storeUpdate, setStoreUpdate] = useState(0);
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe(() => {
      setStoreUpdate(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Recalculate values when store updates
  const [calculatedValues, setCalculatedValues] = useState({
    totalPrice: 0,
    planPrice: 0,
    planPriceWithGST: 0,
    gstAmount: 0,
    monthlyPlanAmount: 0
  });

  useEffect(() => {
    setCalculatedValues({
      totalPrice: getTotalPrice(),
      planPrice: selectedPlan ? selectedPlan.price : 0,
      planPriceWithGST: selectedPlan ? getPlanPriceWithGST() : 0,
      gstAmount: selectedPlan ? getGSTAmount() : 0,
      monthlyPlanAmount: selectedPlan ? getMonthlyPlanAmount() : 0
    });
  }, [storeUpdate, selectedPlan, getTotalPrice, getPlanPriceWithGST, getGSTAmount, getMonthlyPlanAmount]);

  const handleQuantityChange = async (toyId: string, newQuantity: number) => {
    await updateQuantity(toyId, newQuantity);
  };

  const handleRemoveItem = async (toyId: string) => {
    await removeFromCart(toyId);
  };

  const handleAddressSubmit = (address: any) => {
    setShippingAddress(address);
    setShowAddressForm(false);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check if address is provided
    if (!shippingAddress) {
      setShowAddressForm(true);
      return;
    }

    // Clear any previous errors
    setPaymentError(null);
    setIsProcessing(true);

    try {
      const totalAmount = calculatedValues.totalPrice;
      
      // Validate minimum amount
      if (totalAmount < 1) {
        setPaymentError('Minimum order amount is ₹1.00');
        setIsProcessing(false);
        return;
      }

      // Check if Razorpay is configured - only check for public key in frontend
      const isRazorpayConfigured = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && 
                                   process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== 'your_public_key_here';
                                   
      if (!isRazorpayConfigured) {
        // Allow order placement without payment for testing
        setPaymentSuccess(true);
        setPaymentError(null);
        clearCart();
        
        // Show success message
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      // Prepare order description
      const itemsDescription = items.length > 0 
        ? `${items.length} toy${items.length > 1 ? 's' : ''}`
        : '';
      const planDescription = selectedPlan 
        ? `${selectedPlan.name} Plan`
        : '';
      const description = [itemsDescription, planDescription]
        .filter(Boolean)
        .join(' + ') || 'PlayPro2 Order';

      // Initialize Razorpay payment with shipping address
      const paymentResult = await initializePayment({
        amount: totalAmount,
        currency: 'INR',
        description: description,
        customerName: user?.name || 'Customer',
        customerEmail: user?.email || '',
        shippingAddress: shippingAddress
      });

      if (paymentResult.success) {
        // Payment successful
        setPaymentSuccess(true);
        setPaymentError(null);
        clearCart();
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        // Payment failed or cancelled
        setPaymentError(paymentResult.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render anything until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  // Debug logs to see what's happening
  console.log('Cart Page - selectedPlan:', selectedPlan);
  console.log('Cart Page - calculatedValues:', calculatedValues);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render the empty cart state consistently */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(items.length === 0 && !selectedPlan) ? (
            <div className="lg:col-span-3">
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
            </div>
          ) : (
            // Render the cart items and order summary when there are items or a plan
            <>
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
                              {selectedPlan.toysPerMonth} toys per month
                            </p>
                            <p className="text-xs text-primary-600 mt-1">
                              Monthly subscription
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary-900">
                              {formatPriceSimple(calculatedValues.planPrice)}
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
                    {/* Shipping Address Section */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Shipping Address
                        </h3>
                        <button
                          onClick={() => setShowAddressForm(!showAddressForm)}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          {shippingAddress ? 'Edit' : 'Add'}
                        </button>
                      </div>
                      
                      {showAddressForm ? (
                        <div className="mt-4">
                          <AddressForm 
                            onSubmit={handleAddressSubmit} 
                            initialData={shippingAddress || undefined} 
                          />
                        </div>
                      ) : shippingAddress ? (
                        <div className="mt-3 text-sm text-gray-600">
                          <p className="font-medium">{shippingAddress.fullName}</p>
                          <p>{shippingAddress.addressLine1}</p>
                          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                          <p>Phone: {shippingAddress.phone}</p>
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-gray-500">
                          <p>No address provided</p>
                        </div>
                      )}
                    </div>

                    {/* Items Subtotal */}
                    
                    {/* Plan Subtotal */}
                    {selectedPlan && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Plan</span>
                          <span className="font-medium">₹{calculatedValues.monthlyPlanAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">GST (18%)</span>
                          <span className="font-medium">₹{calculatedValues.gstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-gray-200 pt-2">
                          <span className="text-gray-900">Plan Total (incl. GST)</span>
                          <span className="text-gray-900">₹{calculatedValues.planPriceWithGST.toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    {/* Deposit Amount */}
                    {selectedPlan && selectedPlan.deposit_amount && selectedPlan.deposit_amount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit Amount</span>
                        <span className="font-medium">₹{selectedPlan.deposit_amount}</span>
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
                          {formatPriceSimple(calculatedValues.totalPrice)}
                        </span>
                      </div>
                      {selectedPlan && (
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedPlan.deposit_amount && selectedPlan.deposit_amount > 0 
                            ? `Monthly subscription + one-time toy purchases + ₹${selectedPlan.deposit_amount} refundable deposit`
                            : 'Monthly subscription + one-time toy purchases'}
                        </p>
                      )}
                    </div>

                    {/* Error Display */}
                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="text-red-800">
                            <p className="font-medium">Payment Error</p>
                            <p className="text-sm">{paymentError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing || paymentLoading || scriptLoading || !shippingAddress}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                        isProcessing || paymentLoading || scriptLoading || !shippingAddress
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {(isProcessing || paymentLoading || scriptLoading) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Proceed to Checkout
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}