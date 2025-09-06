import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClientWithServiceRole } from '@/lib/supabase';
import { supabaseService } from '@/lib/supabase-service';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing required payment information'
      }, { status: 400 });
    }

    // Validate Razorpay configuration
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!razorpayKeySecret) {
      return NextResponse.json({
        success: false,
        error: 'Razorpay is not configured properly'
      }, { status: 500 });
    }

    // Verify payment signature
    const shasum = crypto.createHmac('sha256', razorpayKeySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed'
      }, { status: 400 });
    }

    // Get the supabase client with service role
    const supabase = createClientWithServiceRole();

    // Fetch order details from database using razorpay_order_id
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (orderError || !order) {
      console.error('Order not found for razorpay_order_id:', razorpay_order_id);
      // If order doesn't exist in database, we need to create it
      // This would happen in a proper implementation where we store order info before Razorpay checkout
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully'
      });
    }

    // Update order with payment details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'paid',
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update order'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order updated successfully'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    }, { status: 500 });
  }
}