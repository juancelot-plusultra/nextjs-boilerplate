-- ============================================================================
-- SEED TEST USER DATA
-- This script should be run AFTER the schema is created
-- ============================================================================

-- NOTE: The auth.users table is managed by Supabase Auth
-- You need to create the user through Supabase Auth first with:
-- Email: johnphilipgallana@gmail.com
-- Password: Applesarered6
-- Then use the created user's ID below

-- Replace 'user_id_from_auth' with the actual UUID from auth.users
-- For example: '550e8400-e29b-41d4-a716-446655440000'

-- Insert profile for the test user
INSERT INTO profiles (id, full_name, avatar_initials, role, branch_id, created_at, updated_at)
VALUES (
  'user_id_from_auth',
  'Alex Johnson',
  'AJ',
  'member',
  'main-branch',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert member data for the test user
INSERT INTO members (user_id, branch_id, avatar, phone, email, package_id, status, sessions_left, total_sessions, join_date, total_paid, created_at, updated_at)
VALUES (
  'user_id_from_auth',
  'main-branch',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  '+1-555-123-4567',
  'johnphilipgallana@gmail.com',
  'premium-monthly',
  'active',
  12,
  48,
  CURRENT_DATE - INTERVAL '90 days',
  2400.00,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Insert sample sessions for the test user
-- First, get the member_id from the members table
INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating, created_at, updated_at)
SELECT 
  m.id,
  'main-branch',
  'Strength Training',
  CURRENT_DATE - INTERVAL '7 days',
  '09:00:00'::time,
  60,
  'done',
  'Great chest and back workout',
  5,
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;

INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating, created_at, updated_at)
SELECT 
  m.id,
  'main-branch',
  'Cardio',
  CURRENT_DATE - INTERVAL '5 days',
  '17:30:00'::time,
  45,
  'done',
  'High intensity interval training',
  4,
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;

INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating, created_at, updated_at)
SELECT 
  m.id,
  'main-branch',
  'Flexibility',
  CURRENT_DATE - INTERVAL '2 days',
  '08:00:00'::time,
  30,
  'done',
  'Yoga and stretching session',
  5,
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;

INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating, created_at, updated_at)
SELECT 
  m.id,
  'main-branch',
  'Personal Training',
  CURRENT_DATE,
  '18:00:00'::time,
  60,
  'now',
  'Working on form improvement',
  NULL,
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;

-- Insert sample transactions for the test user
INSERT INTO transactions (member_id, package_id, branch_id, amount, transaction_type, status, transaction_date, created_at, updated_at)
SELECT 
  m.id,
  'premium-monthly',
  'main-branch',
  200.00,
  'subscription',
  'completed',
  CURRENT_DATE - INTERVAL '30 days',
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (member_id, package_id, branch_id, amount, transaction_type, status, transaction_date, created_at, updated_at)
SELECT 
  m.id,
  'personal-training-pack',
  'main-branch',
  800.00,
  'service',
  'completed',
  CURRENT_DATE - INTERVAL '15 days',
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;

INSERT INTO transactions (member_id, package_id, branch_id, amount, transaction_type, status, transaction_date, created_at, updated_at)
SELECT 
  m.id,
  'supplements',
  'main-branch',
  1400.00,
  'product',
  'completed',
  CURRENT_DATE,
  NOW(),
  NOW()
FROM members m
WHERE m.user_id = 'user_id_from_auth'
ON CONFLICT DO NOTHING;
