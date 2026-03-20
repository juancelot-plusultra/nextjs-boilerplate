# Auth Flow Testing Guide

## Complete Workflow Test

### Step 1: Start at Welcome Page
- URL: `/welcome`
- You should see the BearFit welcome slides with a countdown timer and "Get Started" button

### Step 2: Open Auth Modal
- Click the orange **"Get Started"** button (bottom left of welcome video)
- The auth modal should open with a login form

### Step 3: Test Sign Up
1. Click the **"Sign Up"** tab
2. Fill in the form:
   - **Full Name**: `John Fitness`
   - **Phone** (optional): `+1 (555) 123-4567`
   - **Email**: `john@example.com`
   - **Password**: `Test@1234` (must be 6+ chars)
   - **Confirm Password**: `Test@1234`
3. Click **"Create Account"**
4. You should see: `"Account created successfully! You can now sign in."`
5. Modal should switch to Login tab automatically

### Step 4: Test Login
1. Modal should already be on "Login" tab
2. Fill in:
   - **Email**: `john@example.com`
   - **Password**: `Test@1234`
3. Click **"Sign In"**
4. You should see: `"Login successful! Redirecting..."`
5. After 800ms, you'll be redirected to `/member/dashboard`

### Step 5: Verify Dashboard Access
- URL should change to `/member/dashboard`
- Dashboard should load with user data
- You should see member information (name, email, etc.)

### Step 6: Verify Session Persistence
1. Refresh the page (F5)
2. Dashboard should still be there (session maintained via cookies)
3. You should NOT be redirected to `/welcome`

### Step 7: Test Logout
- Look for a sign out button on the dashboard
- Click it
- You should be redirected to `/welcome`
- Session cookies should be cleared

---

## Error Cases to Test

### Invalid Email Format
- Try signing up with `notemail`
- Should show error: "Invalid email format"

### Password Too Short
- Try password: `123` (less than 6 chars)
- Should show error: "Password must be at least 6 characters"

### Passwords Don't Match
- Password: `Test@1234`
- Confirm: `Test@9999`
- Should show error: "Passwords do not match"

### Email Already Exists
- Try signing up with an email that's already registered
- Should show error from Supabase

### Wrong Password
- Go to login
- Enter correct email but wrong password
- Should show: "Invalid login credentials" or similar

---

## Browser Developer Tools Checks

### Network Tab:
1. Watch POST requests to `/api/auth/signin` and `/api/auth/signup`
2. Response should be JSON with user data
3. Look for Set-Cookie headers for session management

### Application Tab → Cookies:
1. Should see Supabase session cookies after login:
   - `sb-access-token`
   - `sb-refresh-token`
2. These should persist across page refreshes
3. Should be cleared after logout

### Console:
1. Should not see any auth-related errors
2. May see debug logs (these are optional)

---

## API Response Examples

### Successful Sign Up Response:
```json
{
  "user": {
    "id": "uuid-here",
    "email": "john@example.com"
  },
  "message": "Account created successfully. Please sign in."
}
```

### Successful Sign In Response:
```json
{
  "user": {
    "id": "uuid-here",
    "email": "john@example.com"
  },
  "session": {
    "access_token": "token-here",
    "refresh_token": "token-here",
    "expires_in": 3600
  }
}
```

---

## Troubleshooting

### Issue: "Email and password are required"
- Make sure both fields are filled
- Check that input wasn't cleared by accident

### Issue: "User not found" on login
- Verify you created an account first (sign up)
- Check that email is spelled correctly
- Password is case-sensitive

### Issue: Stays on auth modal after login
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Check network tab for failed API requests

### Issue: Redirects to /welcome after logging in
- Session might not be established
- Check cookies in browser (Application tab)
- Verify middleware is running

### Issue: "Sign up failed" error
- Check that email isn't already registered
- Verify Supabase database connection
- Check `members` table exists and has correct schema

---

**All Systems Ready!** ✅ The auth flow is complete and ready to test.
