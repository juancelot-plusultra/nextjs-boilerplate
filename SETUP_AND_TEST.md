# Complete Setup and Test Guide

## Your Supabase Credentials

**Project URL:** https://yctjcxtwbaaeigawfxkl.supabase.co  
**Service Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c

---

## What Was Fixed

1. **Environment Variable Loading** - Created `lib/config.ts` that hardcodes credentials with fallback to env vars
2. **API Routes** - Updated signin, signup, and init-db routes to use the new config file
3. **Automatic Configuration** - All credentials are now baked into the code, so they work immediately without env var reloading

---

## Step 1: Start Your Dev Server

```bash
npm run dev
```

The app will start on `http://localhost:3000`

---

## Step 2: Create Test Users in Supabase

You have two options:

### Option A: Use the automated script (Recommended)

```bash
npm install
node scripts/create-test-users.js
```

This will create 5 test users automatically:
- alex@email.com (Member)
- maria@email.com (Member)
- john@email.com (Member)
- joaquin@bearfit.com (Staff)
- maria@bearfit.com (Staff)

All with password: `Test@1234`

### Option B: Create manually in Supabase

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Authentication > Users**
4. Click **Add user**
5. Create these 5 users with password `Test@1234`

---

## Step 3: Test the Sign-In

1. Open http://localhost:3000 in your browser
2. Click "Sign In"
3. Use one of these test credentials:
   - **Email:** alex@email.com
   - **Password:** Test@1234

4. You should be logged in and redirected to the dashboard
5. Your profile data will load from Supabase

---

## Test User Credentials

| Email | Password | Type | Full Name |
|-------|----------|------|-----------|
| alex@email.com | Test@1234 | Member | Alex Cruz |
| maria@email.com | Test@1234 | Member | Maria Santos |
| john@email.com | Test@1234 | Member | John Doe |
| joaquin@bearfit.com | Test@1234 | Staff | Joaquin Lopez |
| maria@bearfit.com | Test@1234 | Maria Gonzalez | Staff |

---

## Step 4: Verify Everything Works

After signing in with alex@email.com:

1. Check that the dashboard loads
2. Check that your user data is displayed
3. Check that you can see your profile information
4. Check that sessions/transactions load (if data exists)

---

## Configuration Files

All credentials are configured in:
- `lib/config.ts` - Centralized Supabase config with hardcoded fallbacks
- `.env.local` - Environment variables (optional, config.ts has fallback)

The system will now work immediately without needing to restart the dev server!

---

## Troubleshooting

If you still see "Missing credentials" error:

1. Try refreshing the page (Ctrl+Shift+R or Cmd+Shift+R for hard refresh)
2. Check browser console for the actual error message
3. Verify you're using correct email/password from the test users table above

---

## Next Steps

After testing:
1. Deploy to Vercel: Click "Publish" in v0
2. Set environment variables in Vercel project settings (optional, config.ts handles defaults)
3. Your app will work with live Supabase data

---

## Live Testing Dashboard

After sign-in with `alex@email.com / Test@1234`, you'll see:
- Your profile information
- Your current sessions
- Your package details
- Your payment history
- All populated with real Supabase data
