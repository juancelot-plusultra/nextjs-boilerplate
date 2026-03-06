-- This script creates a test user in Supabase Auth
-- You need to manually create this user through the Supabase dashboard:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User"
-- 3. Email: johnphilipgallana@gmail.com
-- 4. Password: (set a password)
-- 5. Mark as "Confirm email" 

-- After creating the user, run this to create the member profile:
-- First, get the user_id from the auth.users table and replace YOUR_USER_ID below

INSERT INTO members (
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
)
VALUES (
  -- Replace with actual user_id from auth.users
  (SELECT id FROM auth.users WHERE email = 'johnphilipgallana@gmail.com' LIMIT 1),
  'John Philip Gallana',
  'johnphilipgallana@gmail.com',
  '0917-123-4567',
  'active',
  CURRENT_DATE,
  0,
  24,
  25200.00,
  'default',
  '',
  '1'
)
ON CONFLICT (email) DO UPDATE SET
  status = 'active',
  full_name = 'John Philip Gallana'
RETURNING *;
