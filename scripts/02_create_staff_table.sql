-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  branch_id VARCHAR(50),
  avatar VARCHAR(500),
  role VARCHAR(50),
  status VARCHAR(50) DEFAULT 'online',
  clients_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_branch_id ON public.staff(branch_id);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Staff can read their own data"
ON public.staff FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all staff data"
ON public.staff FOR ALL
USING (auth.role() = 'service_role');
