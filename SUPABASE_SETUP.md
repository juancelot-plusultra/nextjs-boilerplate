# Supabase Manual Setup Guide

## Your Supabase Credentials

**Project URL:** `https://yctjcxtwbaaefgawfxkl.supabase.co`  
**Anon Key (Publishable):** `sb_publishable_H_AFLOYp9BeNmAySp9Sc4w_mNEryGcn`

Your credentials are already configured in `.env.local`

---

## Quick Start (3 Steps)

### Step 1: Create Database Tables

1. Go to https://app.supabase.com/
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy the entire contents from `scripts/setup-database.sql` in this project
5. Paste into the SQL Editor and click **Run**

This creates all the necessary tables: `users`, `members`, `staff`, `sessions`, `transactions`, and `packages`

### Step 2: Create Test Users in Supabase Auth

1. In your Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add user** and create these test users:

| Email | Password | Role |
|-------|----------|------|
| alex@email.com | password123 | Member |
| john@email.com | password123 | Member |
| maria@email.com | password123 | Member |
| joaquin@bearfit.com | password123 | Staff |
| maria@bearfit.com | password123 | Staff |

**Note down each user's UUID** (shown in the users table) - you'll need these in Step 3.

### Step 3: Seed Database with Member Data

1. Edit `scripts/seed-data.js` and replace the `user_id` values with the actual UUIDs from Step 2
2. Run this command in your terminal:

```bash
npm install
node scripts/seed-data.js
```

The script will populate your database with:
- Member profiles with package information
- Staff profiles with ratings and client counts
- Sample sessions and transactions

---

## Database Tables Created

### `members`
Stores member/client information:
- `id`, `user_id`, `full_name`, `email`, `phone`
- `package_id`, `status` (active/expiring/expired)
- `sessions_left`, `total_sessions`, `join_date`, `total_paid`

### `staff`
Stores instructor/staff information:
- `id`, `user_id`, `full_name`, `email`, `phone`
- `role`, `status` (online/offline), `clients_count`, `rating`, `total_sessions`

### `sessions`
Stores workout sessions:
- `id`, `member_id`, `staff_id`, `session_type`, `session_date`, `start_time`
- `duration_minutes`, `status` (done/now/soon/cancelled), `notes`, `rating`

### `transactions`
Stores payment transactions:
- `id`, `member_id`, `package_id`, `amount`, `transaction_type`
- `status` (completed/pending/failed), `transaction_date`

### `packages`
Stores package types (pre-populated):
- Full 24, Staggered 24, Personal Training, Full 48+, Staggered 48, Pilates

---

## Row Level Security (RLS)

The setup script automatically enables RLS with these policies:
- Users can only read their own profile
- Members can only read their own data
- Staff can only read their own data
- Users cannot see other users' sessions or transactions

---

## Testing Your Setup

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/member/dashboard`
3. The dashboard will:
   - Auto-fetch your user data from Supabase
   - Display your sessions (if you're a member)
   - Show your package info and sessions left
   - Display recent transactions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found" errors | Already fixed - middleware simplified |
| No data showing in dashboard | Make sure Step 1-3 completed, users exist in Auth |
| "Permission denied" errors | Check RLS policies in Supabase dashboard |
| Database tables not created | Run full `setup-database.sql` script |
| Seed script fails | Verify user UUIDs in `seed-data.js` match Supabase Auth |
| Data inconsistency | Check foreign key constraints - all user_ids must exist in Auth |

---

## Advanced: Manual Data Insert

If you prefer to manually insert data without the seed script:

```sql
-- Insert a member for a user
INSERT INTO public.members (user_id, email, full_name, phone, package_id, status, sessions_left, total_sessions, join_date, total_paid)
VALUES (
  'YOUR_USER_UUID_HERE',
  'alex@email.com',
  'Alex Cruz',
  '0917-123-4567',
  'full48',
  'active',
  19,
  48,
  '2025-01-01',
  47500
);
```

Replace `YOUR_USER_UUID_HERE` with actual UUID from Supabase Auth users table.

---

## Next Steps

After setup:
1. ✅ Tables created
2. ✅ Users in Auth
3. ✅ Data seeded
4. Test login with one of your test accounts
5. Navigate to dashboard and verify data loads
6. Deploy to Vercel when ready
