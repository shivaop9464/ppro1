import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function GET() {
  try {
    // Check if Razorpay is configured
    const isRazorpayConfigured = process.env.RAZORPAY_KEY_ID && 
                                 process.env.RAZORPAY_KEY_SECRET &&
                                 process.env.RAZORPAY_KEY_ID !== 'your_key_id_here' &&
                                 process.env.RAZORPAY_KEY_SECRET !== 'your_key_secret_here';

    // Check if Razorpay instance is available
    const isRazorpayInitialized = !!razorpay;

    return NextResponse.json({
      success: true,
      razorpayConfigured: isRazorpayConfigured,
      razorpayInitialized: isRazorpayInitialized,
      publicKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null,
      privateKeyConfigured: !!process.env.RAZORPAY_KEY_SECRET,
      message: isRazorpayConfigured && isRazorpayInitialized 
        ? 'Razorpay is properly configured and initialized' 
        : 'Razorpay configuration issue detected'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check Razorpay configuration'
    }, { status: 500 });
  }
}