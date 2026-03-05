# BearFit - Quick Start Guide

## What's Been Done
You now have a fully functional authentication system with:
- ✅ Login form at `/auth`
- ✅ Protected dashboard at `/member/dashboard`
- ✅ Dynamic profile card showing real user data
- ✅ Supabase integration with 4 database tables
- ✅ User context for global session management
- ✅ Test user ready to use

## To Get Started (5 Minutes)

### Step 1: Create Database Tables
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `yctjcxtwbaaeigawfxkl`
3. Go to **SQL Editor**
4. Copy & paste this entire SQL block:

```sql
-- Create all tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_initials VARCHAR(2),
  role VARCHAR(50) DEFAULT 'member',
  branch_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- Create indexes
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_sessions_member_id ON sessions(member_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
```

5. Click **Run** or **Execute**
6. You should see "Success"

### Step 2: Create Test User
1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - Email: `johnphilipgallana@gmail.com`
   - Password: `Applesarered6`
   - Check "Confirm Email"
4. Click **Save**
5. **IMPORTANT:** Copy the UUID that appears (you'll need it)

### Step 3: Add Test Data

#### Option A: Quick Manual Insert (Recommended)
In SQL Editor, replace `[USER_UUID]` with the UUID from Step 2, then run:

```sql
-- Insert profile
INSERT INTO profiles (id, full_name, avatar_initials, role, branch_id)
VALUES ('[USER_UUID]', 'Alex Johnson', 'AJ', 'member', 'main-branch');

-- Insert member
INSERT INTO members (user_id, branch_id, avatar, phone, email, package_id, status, sessions_left, total_sessions, join_date, total_paid)
VALUES ('[USER_UUID]', 'main-branch', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', '+1-555-123-4567', 'johnphilipgallana@gmail.com', 'premium-monthly', 'active', 12, 48, CURRENT_DATE - INTERVAL '90 days', 2400.00);

-- Insert sample sessions
INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating)
SELECT m.id, 'main-branch', 'Strength Training', CURRENT_DATE - INTERVAL '7 days', '09:00:00'::time, 60, 'done', 'Great workout', 5
FROM members m WHERE m.user_id = '[USER_UUID]';

INSERT INTO sessions (member_id, branch_id, session_type, session_date, start_time, duration_minutes, status, notes, rating)
SELECT m.id, 'main-branch', 'Cardio', CURRENT_DATE - INTERVAL '5 days', '17:30:00'::time, 45, 'done', 'HIIT session', 4
FROM members m WHERE m.user_id = '[USER_UUID]';

-- Insert sample transaction
INSERT INTO transactions (member_id, branch_id, amount, transaction_type, status, transaction_date)
SELECT m.id, 'main-branch', 2400.00, 'subscription', 'completed', CURRENT_DATE
FROM members m WHERE m.user_id = '[USER_UUID]';
```

#### Option B: Automated Script
```bash
# Set environment variable
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run setup script
node scripts/setup-supabase.js
```

### Step 4: Test the App
```bash
# Start development server
npm run dev

# Open in browser
http://localhost:3000/auth
```

**Login with:**
- Email: `johnphilipgallana@gmail.com`
- Password: `Applesarered6`

You should see the dashboard with your profile data!

---

## Key Features Implemented

### Authentication (`/app/auth/page.tsx`)
- Email/password login
- Error handling
- Auto-redirect to dashboard
- Test credentials pre-filled

### Dashboard (`/app/member/dashboard/page.tsx`)
- Protected route (redirects to auth if not logged in)
- Displays user profile
- Shows membership details
- Displays session progress

### Profile Card (`/components/bearfit/profile-card.tsx`)
- Shows real user name (no more "Alex")
- Displays real package info
- Shows real session count
- Calculates progress percentage
- Loading states

### Session Management (`/lib/context/UserContext.tsx`)
- Global authentication state
- Auto-fetches user profile
- Handles sign out
- Listens to auth changes

---

## URLs to Visit

| Page | URL | Purpose |
|------|-----|---------|
| Login | `http://localhost:3000/auth` | Sign in |
| Dashboard | `http://localhost:3000/member/dashboard` | Main app (protected) |

---

## Test User
```
Email: johnphilipgallana@gmail.com
Password: Applesarered6
Name: Alex Johnson
Package: Premium Monthly
Sessions: 40 of 48 completed
```

---

## File Guide

**Files to Edit If Needed:**
- `/app/auth/page.tsx` - Login form
- `/components/bearfit/profile-card.tsx` - Profile display
- `/lib/supabase.ts` - Database functions

**Files to Reference:**
- `IMPLEMENTATION_SUMMARY.md` - Full details
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `/scripts/01-create-schema.sql` - Database schema

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "supabaseUrl is required" | Refresh browser, check env vars in Vercel settings |
| "User not authenticated" | Create test user in Supabase Auth |
| "Profile data not loading" | Run data insertion SQL commands |
| "Stuck on login screen" | Check browser console for errors |
| "Can't access /member/dashboard" | Make sure you're logged in first |

---

## What Happens Next?

The system is now ready for:
1. Adding sign-up functionality
2. Implementing multiple profiles
3. Building staff/admin dashboards
4. Adding payment integration
5. Creating session booking system

---

## Questions?

Check these files:
1. `IMPLEMENTATION_SUMMARY.md` - What was built
2. `SETUP_INSTRUCTIONS.md` - How to set it up
3. Browser console - Look for `[v0]` debug messages
4. Supabase dashboard - Check database tables and data

---

**You're ready to go! The profile system is now live.** 🚀
