-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_initials VARCHAR(10),
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'staff', 'leads', 'admin')),
  branch_id UUID,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  total_sessions INTEGER NOT NULL,
  price_pesos DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  avatar VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  package_id UUID REFERENCES packages(id),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired')),
  sessions_left INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  avatar VARCHAR(10),
  role VARCHAR(100),
  status VARCHAR(50) DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  phone VARCHAR(20),
  email VARCHAR(255),
  clients_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id),
  branch_id UUID REFERENCES branches(id),
  session_type VARCHAR(100),
  session_date DATE,
  start_time TIME,
  duration_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'soon' CHECK (status IN ('done', 'now', 'soon', 'cancelled')),
  notes TEXT,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  branch_id UUID REFERENCES branches(id),
  amount DECIMAL(10, 2),
  transaction_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_branch_id ON members(branch_id);
CREATE INDEX idx_staff_user_id ON staff(user_id);
CREATE INDEX idx_staff_branch_id ON staff(branch_id);
CREATE INDEX idx_sessions_member_id ON sessions(member_id);
CREATE INDEX idx_sessions_staff_id ON sessions(staff_id);
CREATE INDEX idx_sessions_branch_id ON sessions(branch_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for members table
CREATE POLICY "Members can view their own data"
  ON members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view members in their branch"
  ON members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.user_id = auth.uid()
      AND staff.branch_id = members.branch_id
    )
  );

-- RLS Policies for staff table
CREATE POLICY "Staff can view their own data"
  ON staff FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for sessions table
CREATE POLICY "Members can view their own sessions"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = sessions.member_id
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view sessions they conduct"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = sessions.staff_id
      AND staff.user_id = auth.uid()
    )
  );

-- RLS Policies for transactions table
CREATE POLICY "Members can view their own transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = transactions.member_id
      AND members.user_id = auth.uid()
    )
  );

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);
