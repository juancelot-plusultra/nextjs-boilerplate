# 1. Create Tables in Supabase

## Instructions:

1. **Go to:** https://app.supabase.com/
2. **Select your project:** yctjcxtwbaaeigawfxkl
3. **Click:** SQL Editor (left sidebar)
4. **Click:** New Query
5. **Copy the entire SQL below** into the editor
6. **Click:** Run

---

## SQL Code (Copy & Paste Everything):

```sql
-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  package_id VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  sessions_left INT DEFAULT 0,
  total_sessions INT DEFAULT 0,
  join_date DATE,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50),
  status VARCHAR(50) DEFAULT 'online',
  clients_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for members
CREATE POLICY "Users can read own member data"
  ON public.members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own member data"
  ON public.members FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for staff
CREATE POLICY "Users can read own staff data"
  ON public.staff FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own staff data"
  ON public.staff FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 2. Create Test Users in Supabase Auth

1. **Go to:** https://app.supabase.com/ → Your Project
2. **Click:** Authentication (left sidebar)
3. **Click:** Users
4. **Click:** Add user (top right button)
5. **Fill in and create each user:**

### User 1 - Member
- Email: `alex@email.com`
- Password: `Test@1234`
- Auto-generate password: OFF
- Click: Create user

### User 2 - Member
- Email: `maria@email.com`
- Password: `Test@1234`
- Click: Create user

### User 3 - Member
- Email: `john@email.com`
- Password: `Test@1234`
- Click: Create user

### User 4 - Staff
- Email: `joaquin@bearfit.com`
- Password: `Test@1234`
- Click: Create user

### User 5 - Staff
- Email: `maria@bearfit.com`
- Password: `Test@1234`
- Click: Create user

---

## 3. Create Member/Staff Profiles

1. **Go back to:** SQL Editor
2. **Create a new query**
3. **Copy and paste the SQL below** to create profiles for each user
4. **Note:** Replace the `user_id` values with actual IDs from Step 2

```sql
-- After creating users in Auth, insert their profiles
-- IMPORTANT: Replace the user_id values below with actual UUIDs from Authentication > Users

INSERT INTO public.members (user_id, email, full_name, phone, package_id, status, sessions_left, total_sessions, join_date, total_paid)
VALUES
  ('USER_ID_HERE_1', 'alex@email.com', 'Alex Cruz', '0917-123-4567', 'full48', 'active', 48, 48, '2025-01-01', 47500),
  ('USER_ID_HERE_2', 'maria@email.com', 'Maria Santos', '0917-234-5678', 'full48', 'active', 32, 48, '2025-02-01', 47500),
  ('USER_ID_HERE_3', 'john@email.com', 'John Doe', '0917-345-6789', 'staggered24', 'active', 15, 24, '2025-01-15', 25000);

INSERT INTO public.staff (user_id, email, full_name, phone, role, status, clients_count, rating, total_sessions)
VALUES
  ('USER_ID_HERE_4', 'joaquin@bearfit.com', 'Joaquin Garcia', '0917-456-7890', 'instructor', 'online', 8, 4.9, 150),
  ('USER_ID_HERE_5', 'maria@bearfit.com', 'Maria Lopez', '0917-567-8901', 'instructor', 'online', 6, 4.7, 120);
```

---

## 4. How to Get User IDs

After creating users in Authentication:

1. **Click:** Users
2. **Click on each user** to see their UUID
3. **Copy the UUID** and replace `USER_ID_HERE_1`, `USER_ID_HERE_2`, etc. in the SQL above

---

## 5. Test Your Setup

1. **Go to:** http://localhost:3000/member/dashboard
2. **Sign in with:** 
   - Email: `alex@email.com`
   - Password: `Test@1234`
3. You should see the dashboard with your profile data!

---

**Everything is ready - just follow these 5 steps!**
