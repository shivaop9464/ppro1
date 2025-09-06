import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    address?: string;
  };
  theme?: {
    color?: string;
  };
}

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerContact?: string;
  shippingAddress?: any;
}

export const useRazorpay = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script is already loaded
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      // Wait for script to load
      existingScript.addEventListener('load', () => {
        setIsScriptLoaded(true);
        setScriptLoading(false);
      });
      return;
    }

    // Load script
    setScriptLoading(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
      setScriptLoading(false);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setScriptLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      if (document.getElementById('razorpay-script')) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializePayment = async (data: PaymentData): Promise<{ success: boolean; error?: string; paymentId?: string }> => {
    setLoading(true);

    try {
      // Check if Razorpay is configured
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey === 'your_public_key_here') {
        return {
          success: false,
          error: 'Razorpay is not configured properly'
        };
      }

      // Wait for script to load if still loading
      if (scriptLoading) {
        // Wait up to 5 seconds for script to load
        let attempts = 0;
        while (scriptLoading && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (scriptLoading) {
          return {
            success: false,
            error: 'Razorpay script failed to load'
          };
        }
      }

      // Check if script is loaded
      if (!isScriptLoaded && !window.Razorpay) {
        return {
          success: false,
          error: 'Razorpay script is not loaded'
        };
      }

      // Create order on backend
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          description: data.description,
          shippingAddress: data.shippingAddress
        }),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.success) {
        return {
          success: false,
          error: orderData.error || 'Failed to create order'
        };
      }

      // Prepare Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'PlayPro2',
        description: data.description,
        image: 'https://playpro2.vercel.app/logo.png',
        order_id: orderData.order.id,
        handler: function (response) {
          // This function will be called after payment completion
          console.log('Payment successful:', response);
        },
        prefill: {
          name: data.customerName || '',
          email: data.customerEmail || '',
        },
        notes: {
          address: data.shippingAddress ? `${data.shippingAddress.street}, ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipcode}` : ''
        },
        theme: {
          color: '#6366f1'
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      // Set up success and failure handlers
      return new Promise((resolve) => {
        options.handler = function (response) {
          // Verify payment on backend
          fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
          })
          .then(res => res.json())
          .then(verification => {
            if (verification.success) {
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id
              });
            } else {
              resolve({
                success: false,
                error: verification.error || 'Payment verification failed'
              });
            }
          })
          .catch(() => {
            resolve({
              success: false,
              error: 'Failed to verify payment'
            });
          });
        };

        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          resolve({
            success: false,
            error: response.error.description || 'Payment failed'
          });
        });

        rzp.open();
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize payment'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    initializePayment,
    loading,
    scriptLoading,
    isScriptLoaded
  };
};