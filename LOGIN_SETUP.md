# How to Create Your Test User & Login

Follow these steps to create the test user and login successfully.

## Step 1: Create User in Supabase Auth

1. **Open your Supabase Dashboard**
2. **Click "Authentication"** in the left sidebar (looks like a person icon)
3. **Click "Users"** tab
4. **Click "Add user"** button (top right, orange button)
5. **Fill in the form**:
   - **Email**: `johnphilipgallana@gmail.com`
   - **Password**: `Applesarered6`
   - **Checkbox**: Check "Auto confirm user" (important for testing!)
6. **Click "Create user"** button

You should see a success message. **Copy the user ID** from the user details - you'll need it next.

## Step 2: Create Member Profile (Optional but Recommended)

Once the user is created, go to **SQL Editor** in Supabase and run this command:

```sql
INSERT INTO public.members (
  user_id,
  full_name,
  email,
  phone,
  status,
  join_date,
  total_sessions,
  sessions_left,
  total_paid,
  branch_id,
  avatar,
  package_id
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'johnphilipgallana@gmail.com' LIMIT 1),
  'John Philip Gallana',
  'johnphilipgallana@gmail.com',
  '+63917-123-4567',
  'active',
  CURRENT_DATE,
  12,
  12,
  25200.00,
  'main-branch',
  '',
  'premium'
);
```

This creates your profile with sample data that will display on the dashboard.

## Step 3: Login to Your Dashboard

1. **Make sure your app is running**: `npm run dev`
2. **Go to login page**: `http://localhost:3000/login` or click login modal
3. **Enter credentials**:
   - Email: `johnphilipgallana@gmail.com`
   - Password: `Applesarered6`
4. **Click "Sign In"**

## Step 4: See Your Dashboard

You should now see:
- ✅ Redirect to `/member/dashboard`
- ✅ Your profile information loaded
- ✅ Your member data displayed
- ✅ All your details from the database

## Troubleshooting

### "Invalid login credentials" error
- Make sure you created the user in Supabase Auth (not just the member profile)
- Check the email is exactly: `johnphilipgallana@gmail.com`
- Check the password is exactly: `Applesarered6`
- Make sure "Auto confirm user" was checked

### Dashboard doesn't load
- Check browser console (F12) for errors
- Verify user is logged in (session should exist)
- Check if member profile exists in Supabase

### Can't see member data
- Run the SQL from Step 2 to create the member profile
- Refresh the page after creating the profile

## What Happens When You Login

1. **You enter email & password** on `/login`
2. **Browser authenticates with Supabase** using the browser client
3. **Session is created** and stored in secure HTTP-only cookies
4. **You're redirected to `/member/dashboard`**
5. **Dashboard fetches your user info** from `auth.getUser()`
6. **Dashboard fetches your member profile** from the database based on your user_id
7. **All your data is displayed** (name, email, sessions, payments, etc.)

Each user can **only see their own data** thanks to Row Level Security (RLS) policies in Supabase.

## Next Steps

Once logged in, you can:
- View your profile
- See your sessions
- Check your payments
- Update your preferences
- Logout and login again

The dashboard is fully functional and pulls real data from Supabase!
