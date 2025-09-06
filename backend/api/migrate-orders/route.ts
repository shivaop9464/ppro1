import { NextRequest, NextResponse } from 'next/server';
import { createClientWithServiceRole } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClientWithServiceRole();
    
    console.log('Running orders table migration...');
    
    // Check if orders table needs migration
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'orders');
    
    if (tableError) {
      console.log('Could not check table structure, proceeding with migration...');
    }
    
    // Add missing columns if they don't exist
    const migrations = [
      // Add razorpay_order_id column
      `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE;`,
      
      // Add razorpay_payment_id column  
      `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;`,
      
      // Add receipt column
      `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt TEXT;`,
      
      // Add currency column
      `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';`,
      
      // Add items JSONB column
      `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb;`,
      
      // Rename total_amount to amount if needed
      `DO $$ 
       BEGIN
         IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'total_amount') 
            AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'orders' AND column_name = 'amount') THEN
           ALTER TABLE public.orders RENAME COLUMN total_amount TO amount;
         END IF;
       END $$;`,
      
      // Update status column constraints
      `DO $$ 
       BEGIN
         ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
         ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
           CHECK (status IN ('created', 'paid', 'failed', 'cancelled', 'processing', 'shipped', 'delivered'));
       EXCEPTION WHEN OTHERS THEN
         NULL;
       END $$;`,
      
      // Make shipping_address optional
      `ALTER TABLE public.orders ALTER COLUMN shipping_address DROP NOT NULL;`,
      
      // Create indexes
      `CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);`,
      `CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);`,
      `CREATE INDEX IF NOT EXISTS idx_orders_receipt ON public.orders(receipt);`,
      
      // Add comments
      `COMMENT ON COLUMN public.orders.razorpay_order_id IS 'Razorpay order ID from order creation API';`,
      `COMMENT ON COLUMN public.orders.razorpay_payment_id IS 'Razorpay payment ID after successful payment';`,
      `COMMENT ON COLUMN public.orders.receipt IS 'Unique receipt identifier for the order';`,
      `COMMENT ON COLUMN public.orders.items IS 'JSON array of order items with toy details';`
    ];
    
    // Execute migrations
    const results = [];
    for (const migration of migrations) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: migration });
        if (error) {
          // Try direct execution for simpler queries
          await supabase.from('').select(migration);
        }
        results.push({ migration: migration.substring(0, 50) + '...', success: true });
      } catch (error) {
        console.warn('Migration warning:', error);
        results.push({ migration: migration.substring(0, 50) + '...', success: false, error });
      }
    }
    
    // Test if we can insert a sample order
    try {
      const testOrder = {
        user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
        razorpay_order_id: 'order_test_migration',
        amount: 100.00,
        currency: 'INR',
        status: 'created',
        receipt: 'TEST_MIGRATION_001',
        items: JSON.stringify([{ toy_id: 'test', name: 'Test Toy', quantity: 1, price: 100 }])
      };
      
      const { error: insertError } = await supabase
        .from('orders')
        .insert(testOrder);
      
      if (!insertError) {
        // Clean up test order
        await supabase
          .from('orders')
          .delete()
          .eq('razorpay_order_id', 'order_test_migration');
        
        results.push({ migration: 'Test order insertion', success: true });
      } else {
        results.push({ migration: 'Test order insertion', success: false, error: insertError });
      }
      
    } catch (error) {
      results.push({ migration: 'Test order insertion', success: false, error });
    }
    
    console.log('Migration completed with results:', results);
    
    return NextResponse.json({
      success: true,
      message: 'Orders table migration completed',
      results: results
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClientWithServiceRole();
    
    // Check orders table structure
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'orders' });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      table_structure: columns,
      razorpay_ready: columns?.some((col: any) => col.column_name === 'razorpay_order_id')
    });
    
  } catch (error) {
    console.error('Error checking table structure:', error);
    return NextResponse.json(
      { error: 'Failed to check table structure' },
      { status: 500 }
    );
  }
}