# Manual Supabase Setup Instructions

Since the sandbox cannot access external services, you'll need to complete this setup manually in your Supabase dashboard. Follow these steps:

## Step 1: Create Database Tables

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor** → Click **New Query**
4. Copy and paste the entire SQL script below and click **Run**:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  UNIQUE(user_id)
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  UNIQUE(user_id)
);

-- Create sessions table
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

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  package_id VARCHAR(50),
  branch_id VARCHAR(50),
  amount DECIMAL(10, 2),
  transaction_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'completed',
  transaction_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sessions INT,
  price DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert package data
INSERT INTO public.packages (id, name, sessions, price, description) VALUES
('full24', 'Full 24', 24, 10000, 'Full 24-hour access'),
('staggered24', 'Staggered 24', 24, 8500, 'Staggered 24-hour access'),
('personal', 'Personal Training', 10, 15000, 'Personal training sessions'),
('full48', 'Full 48+', 48, 18000, 'Full 48+ sessions'),
('staggered48', 'Staggered 48', 48, 15500, 'Staggered 48 sessions'),
('pilates', 'Pilates', 12, 9000, 'Pilates classes')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Members policies
CREATE POLICY "Members can view their own data" ON public.members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can update their own data" ON public.members
  FOR UPDATE USING (auth.uid() = user_id);

-- Staff policies
CREATE POLICY "Staff can view their own data" ON public.staff
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Staff can update their own data" ON public.staff
  FOR UPDATE USING (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY "Users can view their sessions" ON public.sessions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.members WHERE id = sessions.member_id
      UNION
      SELECT user_id FROM public.staff WHERE id = sessions.staff_id
    )
  );

-- Transactions policies
CREATE POLICY "Members can view their transactions" ON public.transactions
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.members WHERE id = transactions.member_id));
```

## Step 2: Create Test Users in Supabase Auth

1. In your Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** and create these 5 users:

**Member Users:**
- Email: `alex@email.com` | Password: `password123`
- Email: `maria@email.com` | Password: `password123`
- Email: `john@email.com` | Password: `password123`

**Staff Users:**
- Email: `joaquin@bearfit.com` | Password: `password123`
- Email: `maria@bearfit.com` | Password: `password123`

**Keep track of each user's UUID** (shown in the users table) - you'll need them for Step 3.

## Step 3: Populate Member and Staff Data

After creating the users, you'll need to populate the members and staff tables. Go back to **SQL Editor** and run these INSERT statements. **Replace the UUIDs** with the actual UUIDs from Step 2:

```sql
-- Insert members data (replace the UUID values with actual user IDs from auth)
INSERT INTO public.members (user_id, email, full_name, phone, package_id, status, sessions_left, total_sessions, join_date, total_paid) VALUES
('REPLACE_WITH_ALEX_UUID', 'alex@email.com', 'Alex Cruz', '0917-123-4567', 'full48', 'active', 19, 48, '2025-01-01', 47500),
('REPLACE_WITH_MARIA_UUID', 'maria@email.com', 'Maria Santos', '0917-234-5678', 'full24', 'active', 12, 24, '2025-02-15', 25000),
('REPLACE_WITH_JOHN_UUID', 'john@email.com', 'John Doe', '0917-345-6789', 'personal', 'expiring', 2, 10, '2025-01-20', 30000);

-- Insert staff data (replace the UUID values with actual staff user IDs from auth)
INSERT INTO public.staff (user_id, email, full_name, phone, role, status, clients_count, rating, total_sessions) VALUES
('REPLACE_WITH_JOAQUIN_UUID', 'joaquin@bearfit.com', 'Joaquin Reyes', '0917-456-7890', 'Trainer', 'online', 15, 4.8, 156),
('REPLACE_WITH_MARIA_STAFF_UUID', 'maria@bearfit.com', 'Maria Lopez', '0917-567-8901', 'Pilates Instructor', 'online', 8, 4.9, 89);

-- Insert sample sessions
INSERT INTO public.sessions (member_id, staff_id, session_type, session_date, start_time, duration_minutes, status) VALUES
((SELECT id FROM public.members WHERE email = 'alex@email.com'), (SELECT id FROM public.staff WHERE email = 'joaquin@bearfit.com'), 'Full Body Workout', '2025-03-15', '06:00:00', 60, 'done'),
((SELECT id FROM public.members WHERE email = 'alex@email.com'), (SELECT id FROM public.staff WHERE email = 'joaquin@bearfit.com'), 'Upper Body Training', '2025-03-16', '18:00:00', 60, 'now'),
((SELECT id FROM public.members WHERE email = 'alex@email.com'), (SELECT id FROM public.staff WHERE email = 'joaquin@bearfit.com'), 'Lower Body Strength', '2025-03-17', '06:00:00', 60, 'soon');

-- Insert sample transactions
INSERT INTO public.transactions (member_id, package_id, amount, transaction_type, status) VALUES
((SELECT id FROM public.members WHERE email = 'alex@email.com'), 'full48', 47500, 'package_purchase', 'completed'),
((SELECT id FROM public.members WHERE email = 'maria@email.com'), 'full24', 25000, 'package_purchase', 'completed'),
((SELECT id FROM public.members WHERE email = 'john@email.com'), 'personal', 30000, 'package_purchase', 'completed');
```

## Step 4: Test Your Setup

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. Sign in with one of the test user accounts (e.g., `alex@email.com` / `password123`)
4. Navigate to `/member/dashboard` 
5. Your dashboard should now display:
   - Your user data (name, package, sessions left)
   - Your upcoming sessions
   - Your transaction history
   - Your profile information

## Environment Variables

Your `.env.local` is already configured with:
```
NEXT_PUBLIC_SUPABASE_URL=https://yctjcxtwbaaefgawfxkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_H_AFLOYp9BeNmAySp9Sc4w_mNEryGcn
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c
```

No additional configuration needed!

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permission denied" when querying | Check RLS policies are created correctly |
| No data showing in dashboard | Verify member record exists for your user_id |
| 404 errors on dashboard | Make sure you're logged in first |
| Foreign key errors | Ensure all referenced user_ids exist in auth.users |
| Can't create users | Check you have proper Auth permissions in Supabase |

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase dashboard logs under **Logs** → **API** section
3. Verify all UUIDs match between auth.users and your data tables
