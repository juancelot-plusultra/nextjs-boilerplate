-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  branch_id VARCHAR(50),
  avatar VARCHAR(500),
  package_id VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  sessions_left INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  join_date DATE,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_branch_id ON public.members(branch_id);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to read their own data
CREATE POLICY "Users can read their own member data"
ON public.members FOR SELECT
USING (auth.uid() = user_id);

-- Create RLS policy for service role to manage all data
CREATE POLICY "Service role can manage all member data"
ON public.members FOR ALL
USING (auth.role() = 'service_role');
