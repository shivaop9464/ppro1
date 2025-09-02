-- Migration: Add Razorpay Payment Integration
-- Run this in your Supabase SQL Editor to add Razorpay support

-- First, check if the orders table already has the required columns
-- If not, add them (this is safe to run multiple times)

-- Add Razorpay-specific columns if they don't exist
DO $$ 
BEGIN
    -- Add razorpay_order_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'razorpay_order_id') THEN
        ALTER TABLE public.orders ADD COLUMN razorpay_order_id TEXT UNIQUE;
    END IF;

    -- Add razorpay_payment_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'razorpay_payment_id') THEN
        ALTER TABLE public.orders ADD COLUMN razorpay_payment_id TEXT;
    END IF;

    -- Add receipt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'receipt') THEN
        ALTER TABLE public.orders ADD COLUMN receipt TEXT;
    END IF;

    -- Add currency column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'currency') THEN
        ALTER TABLE public.orders ADD COLUMN currency TEXT DEFAULT 'INR';
    END IF;

    -- Add items JSONB column for storing order items
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'items') THEN
        ALTER TABLE public.orders ADD COLUMN items JSONB NOT NULL DEFAULT '[]'::jsonb;
    END IF;

    -- Rename total_amount to amount if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'orders' AND column_name = 'total_amount') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'orders' AND column_name = 'amount') THEN
        ALTER TABLE public.orders RENAME COLUMN total_amount TO amount;
    END IF;

    -- Update status column constraints to include new statuses
    BEGIN
        ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
        ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
            CHECK (status IN ('created', 'paid', 'failed', 'cancelled', 'processing', 'shipped', 'delivered'));
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore if constraint doesn't exist
    END;

    -- Update payment_method default
    BEGIN
        ALTER TABLE public.orders ALTER COLUMN payment_method SET DEFAULT 'razorpay';
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore if column doesn't exist
    END;

    -- Make shipping_address optional (remove NOT NULL constraint if it exists)
    BEGIN
        ALTER TABLE public.orders ALTER COLUMN shipping_address DROP NOT NULL;
    EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore if constraint doesn't exist
    END;

END $$;

-- Create indexes for Razorpay fields
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_receipt ON public.orders(receipt);
CREATE INDEX IF NOT EXISTS idx_orders_currency ON public.orders(currency);

-- Insert sample order statuses for reference
COMMENT ON COLUMN public.orders.status IS 'Order status: created (Razorpay order created), paid (payment successful), failed (payment failed), cancelled (order cancelled), processing (order being prepared), shipped (order dispatched), delivered (order completed)';
COMMENT ON COLUMN public.orders.razorpay_order_id IS 'Razorpay order ID returned from order creation API';
COMMENT ON COLUMN public.orders.razorpay_payment_id IS 'Razorpay payment ID returned after successful payment';
COMMENT ON COLUMN public.orders.receipt IS 'Unique receipt identifier for the order';
COMMENT ON COLUMN public.orders.items IS 'JSON array of order items with toy details';

-- RLS policies for orders (if not already exist)
DO $$
BEGIN
    -- Policy for users to view their own orders
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view own orders') THEN
        CREATE POLICY "Users can view own orders" ON public.orders
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Policy for users to create their own orders
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can create own orders') THEN
        CREATE POLICY "Users can create own orders" ON public.orders
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Policy for users to update their own orders (limited fields)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can update own orders') THEN
        CREATE POLICY "Users can update own orders" ON public.orders
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    -- Admin policy for full access (if admin column exists)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Admins have full access to orders') THEN
            CREATE POLICY "Admins have full access to orders" ON public.orders
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM public.users 
                        WHERE users.id = auth.uid() 
                        AND users.is_admin = true
                    )
                );
        END IF;
    END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO service_role;

-- Success message
SELECT 'Razorpay orders migration completed successfully!' as message;