-- Create users/auth.users table (Supabase handles this, but we'll reference it)
-- This script sets up the necessary tables for the BearFit application

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  join_date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  sessions_left INTEGER DEFAULT 0,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  branch_id TEXT,
  avatar TEXT,
  package_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  specialization TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  salary DECIMAL(10, 2),
  hire_date DATE NOT NULL,
  branch_id TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sessions INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER,
  benefits TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES staff(id),
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  session_type TEXT DEFAULT 'training',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES packages(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for members
CREATE POLICY "Users can view their own member profile" ON members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own member profile" ON members
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for sessions
CREATE POLICY "Members can view their own sessions" ON sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM members WHERE members.id = sessions.member_id AND members.user_id = auth.uid())
  );

-- Create RLS policies for payments
CREATE POLICY "Members can view their own payments" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM members WHERE members.id = payments.member_id AND members.user_id = auth.uid())
  );

-- Create RLS policies for activity logs
CREATE POLICY "Users can view their own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM members WHERE id = activity_logs.member_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_member_id ON sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_date ON sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- Insert sample packages
INSERT INTO packages (name, description, sessions, price, duration_days, benefits)
VALUES 
  ('Starter', 'Perfect for beginners', 4, 1999.00, 30, ARRAY['1 Month Access', 'Basic Training']),
  ('Premium', 'Most popular plan', 12, 5999.00, 90, ARRAY['3 Months Access', 'Unlimited Training', 'Nutrition Counseling']),
  ('Unlimited', 'Best value plan', 999, 12999.00, 365, ARRAY['1 Year Access', 'Unlimited Sessions', 'Personal Trainer', 'Nutrition Plans'])
ON CONFLICT DO NOTHING;
