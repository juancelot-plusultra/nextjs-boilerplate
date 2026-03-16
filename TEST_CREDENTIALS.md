# Test Credentials - Live Supabase Integration

## Your Supabase Project

**Project Name:** yctjcxtwbaaeigawfxkl  
**Project URL:** https://yctjcxtwbaaeigawfxkl.supabase.co

---

## API Keys (Stored in .env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://yctjcxtwbaaeigawfxkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTc2MTgsImV4cCI6MjA4Mzk5MzYxOH0.CaE8kIDhe3ghER2w4ixn11McFkkURjO6ppAUICv0iX4
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQxNzYxOCwiZXhwIjoyMDgzOTkzNjE4fQ.OAQE1p0He962mgRymKQEqY9M4nyC3cJuXEyNltlcV7c
```

---

## Test User Accounts

### Member Accounts (Standard Users)

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| alex.member@test.com | Test@1234 | Member | Member with active package |
| maria.member@test.com | Test@1234 | Member | Member with expiring package |
| john.member@test.com | Test@1234 | Member | Member with expired package |

### Staff Accounts (Trainers/Instructors)

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| trainer.joaquin@test.com | Test@1234 | Staff | Lead trainer with high rating |
| trainer.maria@test.com | Test@1234 | Staff | Trainer with active clients |

---

## How to Create Test Users

1. Go to your Supabase Dashboard: https://app.supabase.com/
2. Select your project: **yctjcxtwbaaeigawfxkl**
3. Go to **Authentication** → **Users**
4. Click **Add user** for each account above
5. Use the email and password provided
6. Note the **User UUID** for each user (you'll see it in the users table)

---

## Test Member Profile (After Database Setup)

When you create a test member user, the following data will populate:

```json
{
  "id": "uuid-of-member",
  "user_id": "uuid-from-auth",
  "email": "alex.member@test.com",
  "full_name": "Alex Cruz",
  "phone": "0917-123-4567",
  "branch_id": "manila",
  "package_id": "full48",
  "status": "active",
  "sessions_left": 19,
  "total_sessions": 48,
  "join_date": "2025-01-01",
  "total_paid": 47500
}
```

---

## Test Staff Profile (After Database Setup)

When you create a test staff user, the following data will populate:

```json
{
  "id": "uuid-of-staff",
  "user_id": "uuid-from-auth",
  "email": "trainer.joaquin@test.com",
  "full_name": "Joaquin Reyes",
  "phone": "0917-555-8888",
  "branch_id": "manila",
  "role": "trainer",
  "status": "online",
  "clients_count": 12,
  "rating": 4.8,
  "total_sessions": 156
}
```

---

## Testing the Connection

### 1. Sign Up
Go to the sign-up page and create a new member account using one of the test emails.

### 2. Sign In
Use your test credentials to sign in.

### 3. View Dashboard
After signing in, your dashboard should display:
- Your profile information
- Active sessions
- Package details
- Transaction history

### 4. Check Database
In Supabase Dashboard → **SQL Editor**, run:

```sql
SELECT * FROM public.members WHERE email = 'alex.member@test.com';
SELECT * FROM public.staff WHERE email = 'trainer.joaquin@test.com';
SELECT * FROM public.sessions LIMIT 5;
```

---

## Environment Variables Verified

✓ NEXT_PUBLIC_SUPABASE_URL - Configured  
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY - Configured  
✓ NEXT_PUBLIC_SUPABASE_SERVICE_KEY - Configured  

All environment variables are properly set in `.env.local` for development.

---

## Next Steps

1. Run `npm install` (if not done)
2. Start dev server: `npm run dev`
3. Go to http://localhost:3000
4. Sign up with a test account
5. Test the authentication and dashboard
6. Monitor browser console for any errors
