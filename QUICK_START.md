# Quick Start Guide

## What's New?

### ✅ 1. Login / Sign Up Modal
- Located on the first slide of the welcome page
- Click "Sign In / Sign Up" button below "Better Form | Better Function | Better Fitness"
- Two tabs: Login and Sign Up
- Stores user data in Supabase automatically

### ✅ 2. Back Button on Slides
- All welcome slides now have a "← Back" button
- Navigate backward through the onboarding slides
- Disabled on the first slide

### ✅ 3. Supabase Integration
- All user data is stored in Supabase
- Members table automatically created on signup
- Dashboard fetches real user data

---

## Get Started in 3 Steps

### Step 1: Set Up Database (5 minutes)
1. Open `SUPABASE_SETUP.md` in the project root
2. Copy each SQL command
3. Go to your Supabase project → SQL Editor
4. Paste and run each command

**Expected Result**: 4 new tables created (members, staff, sessions, transactions)

---

### Step 2: Test Sign Up (2 minutes)
1. Go to: `http://localhost:3000/welcome`
2. Click the orange "Sign In / Sign Up" button
3. Click "Sign Up" tab
4. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Phone: (optional)
5. Click "Create Account"

**Expected Result**: 
- ✅ "Account created successfully! You can now sign in." message
- ✅ Form resets
- ✅ Can switch to Login tab

---

### Step 3: Test Sign In (2 minutes)
1. Click "Login" tab
2. Enter:
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result**:
- ✅ "Login successful! Redirecting..." message
- ✅ Redirected to `/member/dashboard`
- ✅ Dashboard loads with your member information

---

## File Structure

```
project/
├── app/
│   ├── welcome/page.tsx (Back button + Auth Modal integration)
│   ├── api/auth/
│   │   ├── signin/route.ts (Login API)
│   │   └── signup/route.ts (Signup API)
│   └── member/dashboard/page.tsx (Auth check + data fetch)
├── components/bearfit/
│   └── auth-modal.tsx (Login/Signup Modal)
├── .env.local (Supabase credentials)
├── SUPABASE_SETUP.md (Database setup instructions)
├── IMPLEMENTATION_SUMMARY.md (Detailed implementation docs)
└── QUICK_START.md (This file)
```

---

## Troubleshooting

### Issue: "Table does not exist" error
**Solution**: Run all SQL commands from `SUPABASE_SETUP.md` in Supabase SQL Editor

### Issue: Sign up works but can't sign in
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors (F12)
3. Verify email is correct

### Issue: Dashboard shows blank/error
**Solution**:
1. Make sure you're signed in (check localStorage in DevTools)
2. Check browser console for specific errors
3. Verify member table has your record in Supabase

### Issue: Back button doesn't work
**Solution**: Make sure you're on the welcome page at `/welcome`, not the root

---

## What's Happening Behind the Scenes?

### When you Sign Up:
1. Click "Create Account" button
2. Data sent to `/api/auth/signup` API
3. Supabase Auth creates user account
4. `members` table entry created automatically
5. Session stored in localStorage
6. Form resets and shows success message

### When you Sign In:
1. Click "Sign In" button
2. Data sent to `/api/auth/signin` API
3. Supabase Auth verifies credentials
4. Member data fetched from database
5. Session stored in localStorage
6. Redirected to `/member/dashboard`

### On Dashboard Load:
1. Page checks localStorage for session
2. If no session, redirects to `/welcome`
3. If session exists, fetches member data from Supabase
4. Displays dashboard with real user information

---

## Color Scheme

- Primary Orange: `#F37120` (buttons, highlights)
- Dark Background: `#0b0b0b` (modal, text areas)
- White Text: `#ffffff` (headings, main text)
- Gray Text: `rgba(255, 255, 255, 0.6)` (secondary text)

---

## API Endpoints

### Sign Up
```
POST /api/auth/signup
Body: {
  email: string,
  password: string,
  fullName: string,
  phone?: string
}
```

### Sign In
```
POST /api/auth/signin
Body: {
  email: string,
  password: string
}
```

---

## Next: Customize Your App

After testing, you can:
- Customize the dashboard to show real member data
- Add more fields to the signup form
- Implement email verification
- Add password reset functionality
- Set up role-based access (Member/Staff/Admin)

---

**Questions?** Check `IMPLEMENTATION_SUMMARY.md` for detailed technical documentation.
