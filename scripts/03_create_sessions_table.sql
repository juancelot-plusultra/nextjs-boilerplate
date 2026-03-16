-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL,
  staff_id UUID NOT NULL,
  branch_id VARCHAR(50),
  session_type VARCHAR(100),
  session_date DATE,
  start_time TIME,
  duration_minutes INT,
  status VARCHAR(50) DEFAULT 'soon',
  notes TEXT,
  rating INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_member_id ON public.sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_sessions_staff_id ON public.sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_date ON public.sessions(session_date);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own sessions"
ON public.sessions FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.members WHERE id = member_id
  )
  OR
  auth.uid() IN (
    SELECT user_id FROM public.staff WHERE id = staff_id
  )
);

CREATE POLICY "Service role can manage all sessions"
ON public.sessions FOR ALL
USING (auth.role() = 'service_role');
