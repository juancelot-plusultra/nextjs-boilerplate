-- Create member profile for johnphilipgallana@gmail.com
-- First, get the user ID from auth.users table
-- Then insert into members table

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
) 
SELECT 
  id as user_id,
  'John Philip Gallana' as full_name,
  email,
  '+63917-123-4567' as phone,
  'active' as status,
  CURRENT_DATE as join_date,
  0 as total_sessions,
  24 as sessions_left,
  0.00 as total_paid,
  'main-branch' as branch_id,
  '' as avatar,
  '1' as package_id
FROM auth.users 
WHERE email = 'johnphilipgallana@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.members 
    WHERE user_id = auth.users.id
  )
ON CONFLICT DO NOTHING;
