# Test Account Setup Guide

## Quick Test Account Credentials

**Email:** `johnphilipgallana@gmail.com`  
**Password:** `Applesarered6`

## How to Create This Account

### Option 1: Via the Sign Up Modal (Recommended)

1. Go to `http://localhost:3000/welcome`
2. Click "Get Started" button on the first slide
3. Click the "Sign Up" tab
4. Fill in the form with:
   - **Full Name:** John Philip Gallana
   - **Email:** johnphilipgallana@gmail.com
   - **Password:** Applesarered6
   - **Confirm Password:** Applesarered6
   - **Phone:** +63 917 1234567
5. Click "Sign Up"
6. You'll be redirected to the dashboard

### Option 2: Using Supabase Console (For Pre-populated Data)

1. Go to your Supabase project dashboard
2. Navigate to `Authentication > Users`
3. Click "Add User"
4. Fill in:
   - **Email:** johnphilipgallana@gmail.com
   - **Password:** Applesarered6
   - **Confirm password:** Applesarered6
   - Check "Auto confirm user"
5. Click "Create User"

### Option 3: Direct SQL in Supabase

If you want to create the user with all dashboard data populated, execute these SQL commands in the SQL Editor:

```sql
-- 1. Create auth user (if using custom auth method)
-- Note: Supabase Auth handles this automatically via API

-- 2. Create member record with sample data
INSERT INTO members (
  user_id,
  full_name,
  email,
  phone,
  status,
  join_date,
  total_sessions,
  sessions_left,
  total_paid
) VALUES (
  '<user_id_from_auth>',
  'John Philip Gallana',
  'johnphilipgallana@gmail.com',
  '+63 917 1234567',
  'active',
  CURRENT_DATE,
  12,
  8,
  15000
);

-- 3. Create sample sessions
INSERT INTO sessions (member_id, date, time, type, duration) VALUES
  ('<member_id>', '2026-03-10', '06:00', 'Strength', 60),
  ('<member_id>', '2026-03-12', '06:30', 'Cardio', 45),
  ('<member_id>', '2026-03-14', '07:00', 'Functional', 60);
```

## Dashboard Data for Test Account

When you log in, the dashboard should display:

- **Member Name:** John Philip Gallana
- **Email:** johnphilipgallana@gmail.com
- **Phone:** +63 917 1234567
- **Gym Branch:** Malingap (or any of your branches)
- **Total Sessions:** 12
- **Sessions Left:** 8
- **Total Amount Paid:** ₱15,000

## Testing the Login Flow

1. **First Time (New Account):**
   - Visit `/welcome`
   - Click "Get Started"
   - Sign up with new credentials
   - Should create account and show dashboard

2. **Returning User:**
   - Visit `/welcome` (or go directly to `/member/dashboard`)
   - Click "Get Started"
   - Click "Login" tab
   - Enter: `johnphilipgallana@gmail.com` / `Applesarered6`
   - Should redirect to dashboard with populated data

3. **Test Assessment Form:**
   - On the Free Assessment slide, click "Get Started – Free Assessment"
   - Fill in the form with test data:
     - Name: John Philip Gallana
     - Email: johnphilipgallana@gmail.com
     - Phone: +63 917 1234567
     - Address: 123 Fitness Street, Cainta
     - Branch: Malingap
     - Assessment Date: Pick a date
     - Goals: "Build strength and improve fitness"
   - Should show confirmation message and redirect

## Troubleshooting

### "Email already exists" error
- The account already exists in Supabase
- Use the Login tab instead of Sign Up

### "Cannot fetch member data" error
- The members table might not exist yet
- This is normal - the app handles gracefully
- Data will show once table is created

### Password doesn't work
- Make sure you're entering exactly: `Applesarered6`
- Check for typos (case-sensitive)
- Password includes: numbers, uppercase, lowercase, special char

## Next Steps

1. ✅ Create the test account using one of the methods above
2. ✅ Log in to verify it works
3. ✅ Test the dashboard and all features
4. ✅ Test the assessment form and swipe navigation

---

**Note:** Once you've created this account, it will persist in Supabase. You can use it anytime to test the login flow.
