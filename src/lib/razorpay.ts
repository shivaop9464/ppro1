import Razorpay from 'razorpay'

// Server-side Razorpay instance with better error handling
let razorpayInstance: Razorpay | null = null;

try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('Razorpay keys are not configured. Payment functionality will not work.');
    razorpayInstance = null;
  } else {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
  razorpayInstance = null;
}

export const razorpay = razorpayInstance;

// Client-side Razorpay configuration
export const razorpayConfig = {
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
}

// Order creation options
export interface CreateOrderOptions {
  amount: number // amount in paise (INR)
  currency: string
  receipt: string
  notes?: Record<string, string>
}

// Payment verification data
export interface PaymentVerificationData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}