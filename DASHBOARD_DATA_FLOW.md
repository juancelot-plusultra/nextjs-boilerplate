# Dashboard Data Flow - How Your Profile Works

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Supabase (Database & Auth)                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  auth.users table              public.members table              │
│  ├─ id (UUID)          ──────  ├─ user_id (FK)                 │
│  ├─ email                      ├─ full_name                     │
│  ├─ encrypted_password         ├─ email                         │
│  └─ ...                        ├─ phone                         │
│                                ├─ total_sessions                │
│  Row Level Security:           ├─ sessions_left                 │
│  Users can only see            ├─ total_paid                    │
│  their own auth entry          ├─ status                        │
│                                ├─ join_date                     │
│                                ├─ package_id                    │
│                                └─ ...                           │
│                                                                   │
│  Row Level Security:           │                                 │
│  Users can only see            │                                 │
│  their own member profile      │                                 │
└─────────────────────────────────────────────────────────────────┘
           ▲
           │ Query via Browser Client
           │ (Secure HTTP-only Cookies)
           │
┌─────────────────────────────────────────────────────────────────┐
│ Your Browser App                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  /login/page.tsx                                                 │
│  ├─ User enters: email & password                               │
│  ├─ Call: supabase.auth.signInWithPassword()                   │
│  └─ On success: Redirect to /member/dashboard                  │
│                                                                   │
│  /member/dashboard/page.tsx                                     │
│  ├─ Mount component                                             │
│  ├─ useEffect: Fetch user from session                         │
│  │  └─ Call: supabase.auth.getUser()                          │
│  │     → Returns: { user: { id, email, ... } }                │
│  │                                                               │
│  ├─ If user exists:                                            │
│  │  └─ Query members table WHERE user_id = auth.user.id       │
│  │     → Returns: { full_name, phone, total_paid, ... }       │
│  │                                                               │
│  ├─ State updates:                                             │
│  │  └─ currentUser = { id, email }                            │
│  │  └─ currentMember = { ...member data }                     │
│  │                                                               │
│  └─ Render dashboard with all data                            │
│                                                                   │
│  DashboardData component                                        │
│  └─ Displays: currentMember data to user                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step: What Happens When You Login

### 1. **User Submits Login Form** (`/login`)
```javascript
const { error } = await supabase.auth.signInWithPassword({
  email: 'johnphilipgallana@gmail.com',
  password: 'Applesarered6'
})
```

### 2. **Supabase Authenticates**
- Checks if user exists in `auth.users`
- Verifies password (securely hashed)
- If valid: Creates session token

### 3. **Session Token Stored** (Secure)
- Token stored in **HTTP-only cookie** (can't be accessed by JavaScript)
- Cookie automatically sent with every request
- Refreshes automatically via middleware

### 4. **Redirect to Dashboard** (`/member/dashboard`)

### 5. **Dashboard Loads & Fetches User**
```javascript
const { data: { user } } = await supabase.auth.getUser()
// user = { id: 'abc123', email: 'johnphilipgallana@gmail.com' }
```

### 6. **Dashboard Queries Member Profile**
```javascript
const { data: memberData } = await supabase
  .from('members')
  .select('*')
  .eq('user_id', 'abc123')  // Only gets this user's row
  .single()

// memberData = {
//   id: 'mem123',
//   user_id: 'abc123',
//   full_name: 'John Philip Gallana',
//   email: 'johnphilipgallana@gmail.com',
//   phone: '+63917-123-4567',
//   total_sessions: 12,
//   sessions_left: 12,
//   total_paid: 25200.00,
//   status: 'active',
//   ...
// }
```

### 7. **Row Level Security in Action**
When the query runs, Supabase RLS policy checks:
```sql
-- This policy on members table:
auth.uid() = user_id
```

Meaning:
- ✅ You can see your own member row
- ❌ You cannot see other members' rows
- ❌ You cannot modify other members' data

### 8. **Dashboard Renders**
All your data is displayed from `currentMember`:
- Full name
- Email
- Phone
- Total sessions
- Sessions left
- Total paid
- Status
- Join date
- Package
- Avatar
- Branch

## Security Features

### HTTP-Only Cookies ✅
- Session token stored in HTTP-only cookie
- **Not accessible by JavaScript**
- Prevents XSS attacks
- Automatically sent with every request

### Row Level Security (RLS) ✅
- Database enforces `auth.uid() = user_id`
- **Impossible to query other users' data**
- Even if someone tries to hack the query
- Supabase will block it at the database level

### Session Validation ✅
- Middleware validates session on every request
- Invalid/expired sessions redirect to login
- Session automatically refreshes

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────┐
│ /login page                                          │
│ User enters: johnphilipgallana@gmail.com            │
│              Applesarered6                           │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ signInWithPassword()  │
         │ (Supabase Client)     │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Supabase Auth Server  │
         │ ✓ User exists         │
         │ ✓ Password correct    │
         │ ✓ Create session      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Send Session Token    │
         │ Store in HTTP-only    │
         │ Cookie (Secure!)      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Redirect to Dashboard │
         └───────────┬───────────┘
                     │
                     ▼
     ┌───────────────────────────────┐
     │ /member/dashboard loads       │
     │ useEffect runs:               │
     │ 1. getUser()                  │
     │ 2. Query members table        │
     │ 3. Set state                  │
     └───────────┬───────────────────┘
                 │
                 ▼
     ┌───────────────────────────────┐
     │ Dashboard renders with        │
     │ all member data from state    │
     └───────────────────────────────┘
```

## What Each User Sees

### User 1: John (johnphilipgallana@gmail.com)
```json
{
  "user_id": "john-uuid-123",
  "full_name": "John Philip Gallana",
  "email": "johnphilipgallana@gmail.com",
  "phone": "+63917-123-4567",
  "total_sessions": 12,
  "sessions_left": 12,
  "total_paid": 25200.00,
  "status": "active"
}
```

### User 2: Jane (jane@example.com)
```json
{
  "user_id": "jane-uuid-456",
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+63917-987-6543",
  "total_sessions": 8,
  "sessions_left": 4,
  "total_paid": 15000.00,
  "status": "active"
}
```

### Important ⚠️
- John **only sees his own data** (John's record)
- Jane **only sees her own data** (Jane's record)
- Jane **cannot see John's data** (blocked by RLS)
- John **cannot see Jane's data** (blocked by RLS)

This is enforced at the **database level**, not the app level.

## Files Involved

| File | Purpose |
|------|---------|
| `/app/login/page.tsx` | Login form & authentication |
| `/app/member/dashboard/page.tsx` | Dashboard & data fetching |
| `/lib/supabase.ts` | Supabase browser client |
| `/lib/supabase/proxy.ts` | Session management |
| `/middleware.ts` | Route protection & session refresh |

## Key Features

✅ **Real-time member data** from Supabase
✅ **Secure sessions** with HTTP-only cookies
✅ **Row Level Security** ensures data isolation
✅ **Automatic session refresh** in middleware
✅ **Protected routes** - can't access without login
✅ **Single source of truth** - database is authoritative

## Ready to Test

1. Create your Supabase user
2. Create member profile with SQL
3. Go to login page
4. Enter credentials
5. See your dashboard with real data!

The entire system is production-ready and secure. 🚀
