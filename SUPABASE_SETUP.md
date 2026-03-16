# Supabase Connection Setup Guide

## ✅ Environment Variables Configured

Your Supabase credentials have been successfully added:
- `NEXT_PUBLIC_SUPABASE_URL` = https://yctjcxtwbaaeigawfxkl.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (configured)
- `SUPABASE_SERVICE_KEY` = (configured)

These are now available in your project environment.

## 📋 Database Setup Instructions

The app requires 4 tables. Follow these steps to create them:

### Step 1: Access Supabase SQL Editor
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Migration Scripts
Copy and paste each SQL script below into the SQL Editor and click **Run**. Execute them in order:

#### Migration 1: Create Members Table
```sql
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

CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_branch_id ON public.members(branch_id);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own member data"
ON public.members FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all member data"
ON public.members FOR ALL
USING (auth.role() = 'service_role');
```

#### Migration 2: Create Staff Table
```sql
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

CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_branch_id ON public.staff(branch_id);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read their own data"
ON public.staff FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all staff data"
ON public.staff FOR ALL
USING (auth.role() = 'service_role');
```

#### Migration 3: Create Sessions Table
```sql
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

CREATE INDEX IF NOT EXISTS idx_sessions_member_id ON public.sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_sessions_staff_id ON public.sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_date ON public.sessions(session_date);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own sessions"
ON public.sessions FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM public.members WHERE id = member_id)
  OR
  auth.uid() IN (SELECT user_id FROM public.staff WHERE id = staff_id)
);

CREATE POLICY "Service role can manage all sessions"
ON public.sessions FOR ALL
USING (auth.role() = 'service_role');
```

#### Migration 4: Create Transactions Table
```sql
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL,
  package_id VARCHAR(50),
  branch_id VARCHAR(50),
  amount DECIMAL(10, 2),
  transaction_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON public.transactions(transaction_date);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
ON public.transactions FOR SELECT
USING (
  auth.uid() IN (SELECT user_id FROM public.members WHERE id = member_id)
);

CREATE POLICY "Service role can manage all transactions"
ON public.transactions FOR ALL
USING (auth.role() = 'service_role');
```

### Step 3: Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `members`
   - `staff`
   - `sessions`
   - `transactions`

## 🔐 Security Features Configured

All tables have:
- **Row Level Security (RLS)** enabled
- **Indexes** on frequently queried columns
- **Foreign key constraints** for data integrity
- **Automatic timestamps** (created_at, updated_at)
- **Service role bypass** for backend operations

## 🧪 Test the Connection

1. Start your Next.js dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Try signing up with a test account
4. Your user data should be saved in the Supabase `members` table

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Table does not exist" error | Run all 4 SQL migrations in order |
| "Permission denied" error | Check RLS policies are created correctly |
| "Foreign key constraint failed" | Ensure the `members` or `staff` table has the user_id |
| Connection fails | Verify environment variables in project Settings > Vars |
| Auth not working | Check that Supabase Auth is enabled in your project |

## 📁 Files Created for Reference

Migration scripts are available in `/scripts`:
- `01_create_members_table.sql`
- `02_create_staff_table.sql`
- `03_create_sessions_table.sql`
- `04_create_transactions_table.sql`
