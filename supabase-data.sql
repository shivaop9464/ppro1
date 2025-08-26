-- Data Migration Script - Insert your existing JSON data
-- Run this AFTER the schema setup

-- Insert existing toys data (based on your data/toys.json structure)
INSERT INTO public.toys (
  name, 
  description, 
  category, 
  brand, 
  price, 
  age_group, 
  image_url, 
  stock,
  tags
) VALUES
-- Educational Toys
('Learning Laptop', 'Interactive learning laptop with educational games and activities', 'Educational', 'LearnTech', 1299.00, '3-6 years', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 50, ARRAY['educational', 'electronic', 'learning']),
('Alphabet Blocks', 'Wooden alphabet blocks for early learning and creativity', 'Educational', 'WoodCraft', 699.00, '2-5 years', 'https://images.unsplash.com/photo-1572375992532-4a4cd7bb5136?w=400', 75, ARRAY['wooden', 'alphabet', 'blocks']),
('Counting Bears', 'Colorful counting bears for math and sorting activities', 'Educational', 'MathFun', 399.00, '3-7 years', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 100, ARRAY['counting', 'math', 'sorting']),

-- Building Toys
('LEGO Classic Set', 'Creative building blocks set with endless possibilities', 'Building', 'LEGO', 1599.00, '4-12 years', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', 30, ARRAY['lego', 'building', 'creative']),
('Magnetic Tiles', 'Colorful magnetic building tiles for 3D construction', 'Building', 'MagnaPlay', 999.00, '3-8 years', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400', 45, ARRAY['magnetic', 'tiles', '3d']),
('Wooden Block Set', 'Natural wooden blocks in various shapes and sizes', 'Building', 'WoodCraft', 799.00, '2-6 years', 'https://images.unsplash.com/photo-1572375992532-4a4cd7bb5136?w=400', 60, ARRAY['wooden', 'blocks', 'natural']),

-- Creative Toys
('Art Easel', 'Double-sided art easel with magnetic board and chalkboard', 'Creative', 'ArtMaster', 1899.00, '3-10 years', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', 25, ARRAY['art', 'easel', 'drawing']),
('Play Dough Set', 'Colorful play dough with tools and molds', 'Creative', 'CraftKids', 299.00, '2-8 years', 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400', 80, ARRAY['playdough', 'creative', 'molds']),
('Crayon Set', 'Premium crayon set with 64 vibrant colors', 'Creative', 'ColorWorks', 199.00, '3-12 years', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400', 120, ARRAY['crayons', 'coloring', 'art']),

-- Outdoor Toys
('Balance Bike', 'Lightweight balance bike for learning to ride', 'Outdoor', 'RideEasy', 2499.00, '2-5 years', 'https://images.unsplash.com/photo-1544966503-7ea2cd0cd52d?w=400', 15, ARRAY['bike', 'balance', 'outdoor']),
('Soccer Ball', 'High-quality soccer ball for kids', 'Outdoor', 'SportsFun', 399.00, '4-12 years', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 90, ARRAY['soccer', 'ball', 'sports']),
('Jump Rope', 'Colorful jump rope with comfortable handles', 'Outdoor', 'ActiveKids', 149.00, '5-12 years', 'https://images.unsplash.com/photo-1544966503-7ea2cd0cd52d?w=400', 150, ARRAY['jump', 'rope', 'exercise']),

-- Electronic Toys
('Robot Dog', 'Interactive robot dog with voice commands and tricks', 'Electronic', 'TechPets', 3499.00, '6-12 years', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', 10, ARRAY['robot', 'electronic', 'interactive']),
('Tablet for Kids', 'Educational tablet designed specifically for children', 'Electronic', 'KidsTech', 4999.00, '4-10 years', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 20, ARRAY['tablet', 'educational', 'electronic']),
('Electronic Keyboard', 'Mini electronic keyboard with learning modes', 'Electronic', 'MusicMaker', 1999.00, '4-12 years', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 35, ARRAY['keyboard', 'music', 'electronic']),

-- Puzzle Toys
('Jigsaw Puzzle 100pc', '100-piece jigsaw puzzle with beautiful artwork', 'Puzzle', 'PuzzleMaster', 299.00, '6-12 years', 'https://images.unsplash.com/photo-1551845041-63e8e76836d3?w=400', 70, ARRAY['puzzle', 'jigsaw', 'problem-solving']),
('Shape Sorter', 'Wooden shape sorting toy for early development', 'Puzzle', 'SmartToys', 599.00, '1-3 years', 'https://images.unsplash.com/photo-1572375992532-4a4cd7bb5136?w=400', 85, ARRAY['shapes', 'sorting', 'wooden']),
('Rubiks Cube', 'Classic 3x3 Rubiks Cube puzzle', 'Puzzle', 'CubeMaster', 399.00, '8-16 years', 'https://images.unsplash.com/photo-1551845041-63e8e76836d3?w=400', 95, ARRAY['rubiks', 'cube', 'logic']);

-- Create some sample reviews
INSERT INTO public.reviews (user_id, toy_id, rating, comment, is_verified_purchase) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1), -- Use first user or create a dummy user
  toys.id,
  (4 + RANDOM())::integer, -- Random rating between 4-5
  CASE 
    WHEN RANDOM() < 0.5 THEN 'Great toy! My child loves it.'
    ELSE 'Excellent quality and very engaging.'
  END,
  true
FROM public.toys 
WHERE RANDOM() < 0.3 -- Add reviews to ~30% of toys
LIMIT 5;

-- Add some sample contact messages
INSERT INTO public.contact_messages (name, email, subject, message) VALUES
('John Smith', 'john@example.com', 'General Inquiry', 'I would like to know more about your subscription plans.'),
('Sarah Johnson', 'sarah@example.com', 'Subscription Help', 'How do I pause my subscription temporarily?'),
('Mike Chen', 'mike@example.com', 'Toy Issues', 'One of the toys I received was damaged. How can I get a replacement?');

-- Add newsletter subscribers
INSERT INTO public.newsletter_subscribers (email) VALUES
('subscriber1@example.com'),
('subscriber2@example.com'),
('subscriber3@example.com');

-- Create admin user (if not exists through auth)
-- This will be handled by the trigger when someone signs up with admin@playpro.com

COMMIT;