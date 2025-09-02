-- Update existing plans with new pricing
UPDATE public.plans 
SET 
  price = 699.00,
  toys_per_month = 1,
  features = ARRAY['1 toy per month', 'Age-appropriate selection', 'Free shipping & returns', 'Sanitized & safe toys', 'Flexible pausing']
WHERE name = 'Basic';

UPDATE public.plans 
SET 
  price = 1299.00,
  toys_per_month = 3,
  features = ARRAY['3 toys per month', 'Age-appropriate selection', 'Free shipping & returns', 'Sanitized & safe toys', 'Flexible pausing', 'Priority customer support', 'Educational activity guides'],
  is_popular = true
WHERE name = 'Pro';

UPDATE public.plans 
SET 
  price = 2199.00,
  toys_per_month = 5,
  features = ARRAY['5 toys per month', 'Age-appropriate selection', 'Free shipping & returns', 'Sanitized & safe toys', 'Flexible pausing', 'Priority customer support', 'Educational activity guides', 'Exclusive premium toys', 'Dedicated toy consultant'],
  is_popular = false
WHERE name = 'Premium';

-- If the plans don't exist, insert them
INSERT INTO public.plans (name, description, price, toys_per_month, features, is_popular)
SELECT 'Basic', 'Perfect for getting started with quality toys', 699.00, 1, ARRAY['1 toy per month', 'Age-appropriate selection', 'Free shipping & returns', 'Sanitized & safe toys', 'Flexible pausing'], false
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Basic');

INSERT INTO public.plans (name, description, price, toys_per_month, features, is_popular)
SELECT 'Pro', 'Most popular choice for families', 1299.00, 3, ARRAY['3 toys per month', 'Age-appropriate selection', 'Free shipping & returns', 'Sanitized & safe toys', 'Flexible pausing', 'Priority customer support', 'Educational activity guides'], true
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Pro');

INSERT INTO public.plans (name, description, price, toys_per_month, features, is_popular)
SELECT 'Premium', 'Ultimate toy experience for your child', 2199.00, 5, ARRAY['5 toys per month', 'Age-appropriate selection', 'Free shipping & returns', 'Sanitized & safe toys', 'Flexible pausing', 'Priority customer support', 'Educational activity guides', 'Exclusive premium toys', 'Dedicated toy consultant'], false
WHERE NOT EXISTS (SELECT 1 FROM public.plans WHERE name = 'Premium');