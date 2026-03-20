# BearFit App Setup Instructions

## Environment Variables

The following environment variables must be set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://yctjcxtwbaaeigawfxkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdGpjeHR3YmFhZWlnYXdmeGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTc2MTgsImV4cCI6MjA4Mzk5MzYxOH0.CaE8kIDhe3ghER2w4ixn11McFkkURjO6ppAUICv0iX4
```

## Database Setup

The following SQL schema needs to be executed in your Supabase database:

1. Run the migration script at `/scripts/setup-schema.sql` in the Supabase SQL editor
2. This will create all necessary tables and Row Level Security policies

## Authentication Flow

### Sign Up (Testing)
1. Navigate to `/welcome`
2. Click "Get Started" button
3. Click "Sign Up" tab
4. Enter test credentials:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+1-555-0123` (optional)
   - Password: `password123`
5. Click "Create Account"
6. You'll be redirected to login
7. Sign in with the same credentials

### Sign In (Testing)
1. Navigate to `/welcome`
2. Click "Get Started" button
3. Enter test credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In"
5. You'll be redirected to `/member/dashboard`

## File Changes Made

- `/lib/supabase/client.ts` - Fixed environment variable from `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `/lib/supabase/server.ts` - Fixed environment variable from `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `/app/api/auth/signin/route.ts` - Implemented complete sign-in logic with Supabase Auth
- `/app/api/auth/signup/route.ts` - Implemented complete sign-up logic with user and member table creation

## Deployment

The app is ready to deploy to Vercel:

1. Ensure environment variables are set in Vercel project settings
2. Push to GitHub or deploy directly
3. Vercel will automatically build and deploy

## Testing Credentials

After first sign up:
- Email: `test@example.com`
- Password: `password123`

You can create additional test accounts by repeating the sign-up flow with different emails.
