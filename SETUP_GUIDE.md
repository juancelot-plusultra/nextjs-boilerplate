# BearFit Dashboard Setup Guide

## Overview
This guide explains the complete authentication and user profile system for the BearFit fitness app.

## System Architecture

### Authentication Flow
1. **Login Page** (`/login`) - User enters email and password
2. **Sign-in API** (`/api/auth/signin`) - Backend authenticates with Supabase Auth
3. **Member Profile Creation** - If user is new, a member profile is automatically created
4. **Dashboard** (`/member/dashboard`) - User sees their profile and fitness data

### Database Tables

#### Members Table
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL (references auth.users),
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  avatar VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  join_date DATE,
  total_sessions INTEGER DEFAULT 0,
  sessions_left INTEGER DEFAULT 0,
  total_paid DECIMAL(10, 2) DEFAULT 0,
  branch_id VARCHAR(255),
  package_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing Credentials

**Email:** johnphilipgallana@gmail.com
**Password:** Applesarered6

### Testing Steps
1. Go to the login page: `/login`
2. Enter the email and password above
3. Click "Sign In"
4. You'll be redirected to `/member/dashboard`
5. Your profile information will display in the DashboardData component
6. Use the logout option to clear your session

## Key Features Implemented

### 1. Login Page (`/app/login/page.tsx`)
- Connects to `/api/auth/signin` endpoint
- Stores `user_id` and `user_email` in localStorage
- Displays error messages if login fails
- Redirects to dashboard on successful login

### 2. Sign-in API (`/app/api/auth/signin/route.ts`)
- Authenticates user with Supabase Auth
- Automatically creates a new member profile if user is new
- Returns user data and member profile in response
- Uses service key for admin operations

### 3. Dashboard (`/app/member/dashboard/page.tsx`)
- Checks localStorage for `user_id`
- Fetches member data from the database
- Displays user information
- Includes logout functionality

### 4. Profile Display (`/app/DashboardData.tsx`)
- Shows user's full name and email
- Displays member status
- Shows remaining/total sessions
- Displays total paid amount
- Shows member join date
- Displays branch and phone (if available)
- Gracefully handles missing profile data

## How to Use

### For End Users
1. Navigate to `/login`
2. Enter credentials
3. System automatically creates profile on first login
4. View dashboard with your member information
5. Click logout to exit

### For Developers
- Update signin route to add more fields during member creation
- Modify DashboardData component to show additional member information
- Add RLS (Row Level Security) policies for production
- Implement proper session management with HTTP-only cookies

## Security Notes

⚠️ **Important:** The current implementation uses localStorage for session management. For production:
1. Use HTTP-only cookies for session storage
2. Implement Row Level Security (RLS) policies in Supabase
3. Add CSRF protection
4. Validate all inputs server-side
5. Use secure password hashing (Supabase handles this)

## Troubleshooting

### Login fails with "Invalid credentials"
- Verify the user exists in Supabase Auth
- Check the email and password are correct
- Ensure Supabase service key has admin permissions

### Dashboard shows "No member data found"
- Check that the members table exists
- Verify the user_id matches the logged-in user
- Run the database setup script: `node scripts/setup-db.js`

### Cannot redirect to dashboard
- Clear localStorage and try logging in again
- Check browser console for error messages
- Verify `/member/dashboard` route exists

## Files Modified

- `/app/login/page.tsx` - Updated with real authentication
- `/app/api/auth/signin/route.ts` - Added member profile creation
- `/app/member/dashboard/page.tsx` - Updated to fetch user data from localStorage
- `/app/DashboardData.tsx` - Created new component to display member profile
- `/scripts/setup-db.js` - Updated members table schema

## Next Steps

1. ✅ Database setup complete
2. ✅ Authentication implemented
3. ✅ Profile creation working
4. ✅ Dashboard displaying user data
5. 📋 Add more member fields (preferences, notes, etc.)
6. 📋 Implement RLS policies for production
7. 📋 Add role-based access control (Admin, Staff, Member)
8. 📋 Create profile edit functionality
