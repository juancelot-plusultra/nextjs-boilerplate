# Supabase Setup Instructions

## Overview
You need to manually create the database tables in your Supabase project. Follow these steps:

## Step 1: Go to Supabase Dashboard
1. Visit https://app.supabase.com/
2. Select your project: `yctjcxtwbaae1gawfxkl`
3. Navigate to the **SQL Editor** section

## Step 2: Create Members Table
Copy and paste this SQL in the SQL Editor and click "Run":

```sql
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Step 3: Create Staff Table
```sql
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
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
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Step 4: Create Sessions Table
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
```

## Step 5: Create Transactions Table
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
```

## Step 6: Test Your Setup
1. In the app, go to the welcome page (`/welcome`)
2. Click on "Sign In / Sign Up" button
3. Create a new account - this will automatically create a member record in Supabase
4. Sign in and access the dashboard

## Troubleshooting
- If tables don't exist error: Make sure to run all SQL commands above
- If foreign key error: Check that the auth.users table exists (it's created automatically with Supabase)
- If member data not showing: Clear browser localStorage and try signing up again
