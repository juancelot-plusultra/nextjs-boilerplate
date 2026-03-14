-- Create Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_initials VARCHAR(10),
  role VARCHAR(50) DEFAULT 'member',
  branch_id VARCHAR(50),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create Members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  branch_id VARCHAR(50),
  avatar VARCHAR(500),
  phone VARCHAR(20),
  email VARCHAR(255),
  package_id VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  sessions_left INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  join_date DATE,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  branch_id VARCHAR(50),
  avatar VARCHAR(500),
  role VARCHAR(50),
  status VARCHAR(50) DEFAULT 'online',
  phone VARCHAR(20),
  email VARCHAR(255),
  clients_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  branch_id VARCHAR(50),
  session_type VARCHAR(100),
  session_date DATE,
  start_time TIME,
  duration_minutes INT,
  status VARCHAR(50) DEFAULT 'soon',
  notes TEXT,
  rating INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  package_id VARCHAR(50),
  branch_id VARCHAR(50),
  amount DECIMAL(10, 2),
  transaction_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  sessions INT,
  duration VARCHAR(50),
  description TEXT,
  active INT DEFAULT 0,
  bonuses JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample packages
INSERT INTO public.packages (id, name, price, sessions, duration, description, active, bonuses)
VALUES 
  ('full24', 'Full 24', 25200, 24, '90 days', '24 sessions + 1 free session + 1 hour recovery massage', 45, '["+ 1 free session", "1 hour recovery massage"]'::jsonb),
  ('staggered24', 'Staggered 24', 9200, 24, 'Flexible', 'Use sessions at your own pace, flexible scheduling', 30, '["Flexible scheduling"]'::jsonb),
  ('pt', 'Personal Training', 24000, 12, '30 days', 'One-on-one personalized training', 20, '["Custom workout plan", "Nutritional guidance"]'::jsonb),
  ('full48', 'Full 48 Package+', 47500, 48, '180 days', '48 sessions + 2 free sessions + 2 hour recovery massage', 60, '["+ 2 free sessions", "2 hour recovery massage", "Priority booking"]'::jsonb),
  ('staggered48', 'Staggered 48', 20500, 48, 'Flexible', 'Use 48 sessions at your own pace', 50, '["Flexible scheduling"]'::jsonb),
  ('pilates', 'Pilates', 12000, 12, '60 days', 'Pilates classes for core strength and flexibility', 15, '["Flexible scheduling"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Members can read their own data
CREATE POLICY "Members can read their own data" ON public.members
  FOR SELECT USING (user_id = auth.uid());

-- Staff can read their own data
CREATE POLICY "Staff can read their own data" ON public.staff
  FOR SELECT USING (user_id = auth.uid());

-- Sessions policy
CREATE POLICY "Users can read their sessions" ON public.sessions
  FOR SELECT USING (
    member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
    OR staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
  );

-- Transactions policy
CREATE POLICY "Users can read their transactions" ON public.transactions
  FOR SELECT USING (
    member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
  );
