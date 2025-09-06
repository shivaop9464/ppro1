import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClientWithServiceRole } from '@/lib/supabase';
import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, description, shippingAddress } = await request.json();

    // Validate input
    if (!amount || !currency || !description) {
      return NextResponse.json({
        success: false,
        error: 'Amount, currency, and description are required'
      }, { status: 400 });
    }

    // Validate Razorpay configuration
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({
        success: false,
        error: 'Razorpay is not configured properly'
      }, { status: 500 });
    }

    // Create order in database first
    const supabaseService = createClientWithServiceRole();
    
    // Create a temporary order record
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Note: In a complete implementation, we would store the user ID and cart items here
    // For now, we'll create a placeholder that gets updated after payment
    
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        receipt: receipt,
        amount: amount,
        currency: currency,
        status: 'created',
        payment_status: 'pending',
        shipping_address: shippingAddress ? JSON.stringify(shippingAddress) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database order creation error:', orderError);
      // Continue with Razorpay order creation even if database insert fails
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Update the database order with Razorpay order ID
    if (order && !orderError) {
      const { error: updateError } = await supabaseService
        .from('orders')
        .update({
          razorpay_order_id: razorpayOrder.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order with Razorpay ID:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order'
    }, { status: 500 });
  }
}