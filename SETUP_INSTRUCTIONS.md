# BearFit Profile System - Setup Instructions

## Overview
This guide will walk you through setting up the BearFit profile authentication system with Supabase.

## Prerequisites
- Supabase project created (already done: yctjcxtwbaaeigawfxkl)
- Test user email: `johnphilipgallana@gmail.com`
- Test user password: `Applesarered6`

## Step 1: Create Database Tables

Go to your Supabase dashboard and navigate to the SQL Editor. Execute the SQL script at `/scripts/01-create-schema.sql`:

**Tables that will be created:**
- `profiles` - User profile information
- `members` - Gym membership details
- `staff` - Gym staff information
- `sessions` - Workout session history
- `transactions` - Payment history

The script also enables Row Level Security (RLS) policies for data protection.

### Quick SQL Setup
Run this in Supabase SQL Editor:

```sql
-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_initials VARCHAR(2),
  role VARCHAR(50) DEFAULT 'member',
  branch_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MEMBERS TABLE
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id VARCHAR(100),
  avatar VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  package_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  sessions_left INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  join_date DATE,
  total_paid DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  staff_id UUID,
  branch_id VARCHAR(100),
  session_type VARCHAR(100),
  session_date DATE,
  start_time TIME,
  duration_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'done',
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  package_id VARCHAR(100),
  branch_id VARCHAR(100),
  amount DECIMAL(10, 2),
  transaction_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  transaction_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can view own member data" ON members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own member data" ON members
  FOR UPDATE USING (user_id = auth.uid());
```

## Step 2: Create Test User in Supabase Auth

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** or **Invite User**
4. Enter:
   - Email: `johnphilipgallana@gmail.com`
   - Password: `Applesarered6`
   - Confirm Email: Yes (check this box)
5. Click **Save**

**Note:** Copy the user ID (UUID) that appears after creation. You'll need it for the next step.

## Step 3: Seed Test Data

After creating the test user, run the seed script to populate test data:

```bash
node scripts/setup-supabase.js
```

**Requirements:**
- `NEXT_PUBLIC_SUPABASE_URL` - Already set
- `SUPABASE_SERVICE_ROLE_KEY` - Add this to your environment variables

### Get Service Role Key
1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy the **Service Role Key** (secret-xxx...)
3. Add to your `.env.local` or Vercel project settings:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Manual Data Seeding (If script doesn't work)

If the Node script fails, you can manually insert test data via Supabase:

```sql
-- Replace 'USER_ID_HERE' with the UUID from Step 2

INSERT INTO profiles (id, full_name, avatar_initials, role, branch_id)
VALUES ('USER_ID_HERE', 'Alex Johnson', 'AJ', 'member', 'main-branch');

INSERT INTO members (user_id, branch_id, avatar, phone, email, package_id, status, sessions_left, total_sessions, join_date, total_paid)
VALUES (
  'USER_ID_HERE',
  'main-branch',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  '+1-555-123-4567',
  'johnphilipgallana@gmail.com',
  'premium-monthly',
  'active',
  12,
  48,
  CURRENT_DATE - INTERVAL '90 days',
  2400.00
);

INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating)
SELECT m.id, 'main-branch', 'Strength Training', CURRENT_DATE - INTERVAL '7 days', '09:00:00'::time, 60, 'done', 'Great chest and back workout', 5
FROM members m WHERE m.user_id = 'USER_ID_HERE';

INSERT INTO transactions (member_id, branch_id, amount, transaction_type, status, transaction_date)
SELECT m.id, 'main-branch', 2400.00, 'subscription', 'completed', CURRENT_DATE
FROM members m WHERE m.user_id = 'USER_ID_HERE';
```

## Step 4: Test the Application

1. **Development:**
   ```bash
   npm run dev
   ```

2. **Login Page:**
   - Navigate to `/auth`
   - The credentials are pre-filled:
     - Email: `johnphilipgallana@gmail.com`
     - Password: `Applesarered6`
   - Click "Sign In"

3. **Dashboard:**
   - You should be redirected to `/member/dashboard`
   - The profile card should display:
     - "Welcome, Alex"
     - Your membership package
     - Sessions progress
     - Membership details

## Architecture Overview

### Components
- **Auth Page** (`/app/auth/page.tsx`) - Login form
- **Dashboard** (`/app/member/dashboard/page.tsx`) - Main member view
- **ProfileCard** (`/components/bearfit/profile-card.tsx`) - Displays profile data
- **Member Layout** (`/app/member/layout.tsx`) - Protected route wrapper

### Context & State
- **UserContext** (`/lib/context/UserContext.tsx`) - Manages authentication state and user data
- **Supabase Client** (`/lib/supabase.ts`) - Database and auth utilities

### Database Schema
```
profiles (UUID)
├── id (links to auth.users)
├── full_name
├── avatar_initials
├── role
├── branch_id

members (UUID)
├── id
├── user_id (links to profiles.id)
├── status
├── sessions_left
├── total_sessions
├── total_paid

sessions (UUID)
└── member_id (links to members.id)

transactions (UUID)
└── member_id (links to members.id)
```

## Troubleshooting

### "supabaseUrl is required"
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel settings
- Check project settings → Vars

### "User not authenticated"
- Make sure the test user is created in Supabase Auth
- Verify email is confirmed (email_confirmed_at is set)
- Check RLS policies are correctly applied

### "Profile data not loading"
- Verify the profiles table has a row with the user's UUID
- Check Supabase logs for RLS policy errors
- Run the seed script or manually insert profile data

### Sessions not showing
- Ensure sessions table has data for the member
- Check the member_id foreign key references are correct

## Next Steps

1. ✅ Database schema created
2. ✅ Test user created
3. ✅ Auth system functional
4. ✅ Dashboard displays user profile
5. Implement admin dashboard for managing members
6. Add payment integration
7. Build staff scheduling system
8. Add real-time notifications

## Support

For issues:
1. Check the debug logs in the browser console (look for `[v0]` messages)
2. Review Supabase logs in the dashboard
3. Verify all environment variables are set correctly
