import { NextRequest, NextResponse } from 'next/server';
import { createClientWithServiceRole } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClientWithServiceRole();
    
    // First, check if orders table exists and has the right columns
    try {
      // Simple query to test table structure
      const { data: testQuery, error: testError } = await supabase
        .from('orders')
        .select('id, user_id, status, amount, created_at')
        .limit(1);
      
      if (testError) {
        console.log('Orders table structure test failed:', testError);
        // Return empty result if table doesn't exist or has issues
        return NextResponse.json({
          success: true,
          orders: [],
          total: 0,
          limit,
          offset,
          message: 'Orders table not ready. Please run migration first.'
        });
      }
    } catch (structureError) {
      console.log('Table structure check failed:', structureError);
      return NextResponse.json({
        success: true,
        orders: [],
        total: 0,
        limit,
        offset,
        message: 'Database not ready. Please run migration first.'
      });
    }
    
    // Build query - simplified to avoid foreign key issues
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data: orders, error } = await query;
    
    if (error) {
      console.error('Query error:', error);
      // Still return success with empty array to avoid breaking the UI
      return NextResponse.json({
        success: true,
        orders: [],
        total: 0,
        limit,
        offset,
        error: error.message
      });
    }
    
    // Get total count
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status);
    }
    
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.warn('Could not get total count:', countError);
    }
    
    return NextResponse.json({
      success: true,
      orders: orders || [],
      total: count || 0,
      limit,
      offset
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: true,
      orders: [],
      total: 0,
      error: 'Failed to fetch orders: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');
    const body = await req.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClientWithServiceRole();
    
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: body.status,
        tracking_number: body.tracking_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}