-- This script creates a test user in Supabase Auth
-- You must run this in the Supabase SQL Editor in your Supabase Dashboard

-- NOTE: You cannot directly create users in the auth.users table via SQL
-- Instead, you must use the Supabase Dashboard or API

-- STEPS TO CREATE TEST USER:
-- 1. Go to your Supabase Dashboard
-- 2. Click "Authentication" in the left sidebar
-- 3. Click "Users" tab
-- 4. Click "Add user" button
-- 5. Fill in:
--    Email: johnphilipgallana@gmail.com
--    Password: Applesarered6
--    Check "Auto confirm user" (for testing)
-- 6. Click "Create user"

-- After creating the user in Auth, run this SQL to create their member profile:

INSERT INTO public.members (
  user_id,
  full_name,
  email,
  phone,
  status,
  join_date,
  total_sessions,
  sessions_left,
  total_paid,
  branch_id,
  avatar,
  package_id
) VALUES (
  -- Use the user_id from the created user
  -- You can find it in Supabase Dashboard > Authentication > Users > click the user
  (SELECT id FROM auth.users WHERE email = 'johnphilipgallana@gmail.com' LIMIT 1),
  'John Philip Gallana',
  'johnphilipgallana@gmail.com',
  '+63917-123-4567',
  'active',
  CURRENT_DATE,
  12,
  12,
  25200.00,
  'main-branch',
  '',
  'premium'
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = 'John Philip Gallana',
  email = 'johnphilipgallana@gmail.com',
  phone = '+63917-123-4567',
  status = 'active',
  total_sessions = 12,
  sessions_left = 12,
  total_paid = 25200.00,
  package_id = 'premium';
