# How the Authentication System Works - Visual Guide

## Complete Login & Session Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER OPENS /login                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  LOGIN PAGE (Client Component)                                   │
│  - Email input                                                   │
│  - Password input                                                │
│  - "Sign In" button                                              │
│                                                                  │
│  Uses: createClient() from @supabase/ssr                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    User clicks "Sign In"
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER CLIENT CALLS:                                           │
│  supabase.auth.signInWithPassword({email, password})             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  SUPABASE AUTH                                                   │
│  - Validates email & password                                    │
│  - Checks if user exists                                         │
│  - Verifies credentials                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         SUCCESS              FAILURE
              │                         │
              ▼                         ▼
         Returns token         Shows error message
              │                    (stays on /login)
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│  HTTP-ONLY COOKIE CREATED                                        │
│  Browser cannot access (security feature)                        │
│  Sent with every request automatically                           │
│                                                                  │
│  Cookie names: sb-*-auth-token, sb-*-session                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  REDIRECT TO /member/dashboard                                   │
│  router.push('/member/dashboard')                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  MIDDLEWARE RUNS                                                 │
│  (/middleware.ts)                                                │
│                                                                  │
│  1. Checks if request is for /member/* route                     │
│  2. Creates server client                                        │
│  3. Calls supabase.auth.getUser()                                │
│  4. Validates session (reads HTTP-only cookie)                   │
│  5. Refreshes token if needed                                    │
│  6. Allows request to proceed                                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD PAGE LOADS                                            │
│  (/app/member/dashboard/page.tsx)                                │
│                                                                  │
│  useEffect: Fetches user and member data                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    Client           Server             Database
    Functions        Client             Query
        │                  │                  │
        │                  ▼                  │
        │  supabase.auth.getUser()            │
        │                  │                  │
        │                  ▼                  │
        │  Get current user ID (from token)   │
        │                                     │
        │  Query members table                │
        │                  │                  │
        │                  └──────────────────┤
        │                                     │
        └────────────────┬────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  SET STATE WITH USER DATA:         │
        │  - User ID                         │
        │  - Email                           │
        │  - Member profile                  │
        │  - Sessions, payments, etc.        │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  RENDER DASHBOARD WITH:            │
        │  - User name                       │
        │  - Profile information             │
        │  - Sessions remaining              │
        │  - Payment history                 │
        │  - All member details              │
        └────────────────────────────────────┘
```

---

## Cookie & Session Management

```
┌──────────────────────────────────────────────────────────────┐
│                    SUPABASE CREATES TOKENS                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Access Token (JWT)              Refresh Token              │
│  ├─ Expires in 1 hour            ├─ Expires in 7 days       │
│  └─ Used for API calls            └─ Used to get new token  │
│                                                               │
└──────────────┬─────────────────────────────┬─────────────────┘
               │                             │
               ▼                             ▼
    ┌──────────────────────────┐  ┌──────────────────────────┐
    │   HTTP-ONLY COOKIE #1    │  │   HTTP-ONLY COOKIE #2    │
    ├──────────────────────────┤  ├──────────────────────────┤
    │ Name: sb-*-auth-token    │  │ Name: sb-*-session       │
    │ HttpOnly: ✓              │  │ HttpOnly: ✓              │
    │ Secure: ✓ (HTTPS only)   │  │ Secure: ✓ (HTTPS only)   │
    │ SameSite: Strict         │  │ SameSite: Strict         │
    │ Expires: 1 hour          │  │ Expires: 7 days          │
    └──────────┬───────────────┘  └──────────┬───────────────┘
               │                             │
               └─────────────┬───────────────┘
                             │
                 ┌───────────┴────────────┐
                 │                        │
                 ▼ (Every Request)        ▼ (When needed)
            API Call              Refresh Access Token
            (Automatic)           (Automatic via proxy)
```

---

## Session Persistence

```
BROWSER MEMORY (Can be accessed by JavaScript)
┌────────────────────────────────────────┐
│ User object from getUser()              │ ← Current user info
│ Member data from database query         │ ← User profile
└────────────────────────────────────────┘
         (Lost on page close)

                    ↓↓↓

HTTP-ONLY COOKIES (Sent automatically, secure)
┌────────────────────────────────────────┐
│ sb-[project-id]-auth-token  (1 hour)   │ ← Auto-sent to API
│ sb-[project-id]-session     (7 days)   │ ← Auto-sent to middleware
└────────────────────────────────────────┘
         (Persists across tabs & browser restart)
```

---

## Route Protection Flow

```
User visits /member/dashboard
         │
         ▼
┌─────────────────────────────┐
│   Middleware executes       │
│   (on EVERY request)        │
└──────────┬──────────────────┘
           │
           ▼
    ┌──────────────────────────┐
    │ Is path /member/* ?      │
    └──┬───────────────────┬───┘
       │ YES               │ NO
       ▼                   ▼
   ┌────────────────┐   Allow request
   │ Get session    │   to proceed
   │ from cookie    │
   └────┬───────────┘
        │
        ▼
   ┌─────────────────┐
   │ Has valid auth? │
   └──┬──────────┬───┘
      │ YES      │ NO
      ▼          ▼
   Allow    Redirect to
   request  /login
```

---

## File Interactions

```
┌──────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  /login (Client Component)                                   │
│  ├─ imports: createClient from /lib/supabase                 │
│  ├─ creates: browser client                                  │
│  └─ calls: supabase.auth.signInWithPassword()                │
│                                                               │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  middleware.ts (Runs on every request)                       │
│  ├─ imports: updateSession from /lib/supabase/proxy          │
│  ├─ creates: server client                                   │
│  ├─ calls: supabase.auth.getUser()                           │
│  └─ result: refresh token if needed, allow/deny request      │
│                                                               │
│  /api/auth/signin (API Route)                                │
│  ├─ imports: createClient from /lib/supabase/server          │
│  ├─ creates: server client                                   │
│  ├─ calls: signInWithPassword() & member lookup              │
│  └─ returns: user data + member profile                      │
│                                                               │
│  /member/dashboard (Server Component with Client parts)      │
│  ├─ useEffect: creates browser client                        │
│  ├─ calls: getUser() & fetch member data                     │
│  └─ renders: dashboard with real data                        │
│                                                               │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTP Response
                     ▼
┌──────────────────────────────────────────────────────────────┐
│              SUPABASE (Auth + Database)                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  auth.users (Auth)                                           │
│  └─ Stores email, password hash, tokens                      │
│                                                               │
│  public.members (Database)                                   │
│  └─ Stores user profile, sessions, payments                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Token Refresh Mechanism (Proxy Pattern)

```
PAGE LOAD / NAVIGATION
         │
         ▼
    MIDDLEWARE
    (lib/supabase/proxy.ts)
         │
         ├─ Read request cookies
         ├─ Create server client
         ├─ Call supabase.auth.getUser()
         │  (Automatically checks and refreshes token if needed)
         │
         ├─ If token expired:
         │  └─ Use refresh token to get new access token
         │     (Automatic - user doesn't notice)
         │
         ├─ Update response cookies
         │  (Send new tokens back to browser)
         │
         └─ Return response to user

RESULT: User always has valid token,
        no manual refresh needed,
        seamless experience
```

---

## Security Features

| Feature | What It Does | Why It Matters |
|---------|-------------|----------------|
| HTTP-Only Cookies | Only sent to server, not JavaScript | Prevents XSS attacks |
| Secure Flag | Only sent over HTTPS | Prevents man-in-the-middle attacks |
| SameSite: Strict | Only sent to same domain | Prevents CSRF attacks |
| Token Expiration | Tokens expire automatically | Limits damage if compromised |
| Refresh Token Rotation | New token on refresh | Prevents replay attacks |
| Row Level Security | Database enforces who can access what | Prevents data breaches |
| Environment Variables | Secrets not in code | Prevents credential leaks |

---

## Error Handling

```
VARIOUS ERRORS
    │
    ├─ Invalid Credentials
    │  └─ Show: "Invalid email or password"
    │
    ├─ User Not Found
    │  └─ Show: "No account found with this email"
    │
    ├─ Network Error
    │  └─ Show: "Unable to connect. Check your connection."
    │
    ├─ Session Expired
    │  └─ Redirect to: /login
    │
    ├─ Unauthorized Access
    │  └─ Redirect to: /login
    │
    └─ Server Error
       └─ Show: "Something went wrong. Please try again."
```

---

## Key Takeaways

✅ **Secure**: Using HTTP-only cookies, not localStorage
✅ **Automatic**: Token refresh happens without user action
✅ **Protected**: Routes validated on every request
✅ **Efficient**: Sessions cached, minimal database hits
✅ **Scalable**: Works across multiple requests & tabs
✅ **Production-Ready**: Following Next.js 16 + Supabase best practices

---

**Read QUICK_START.md to test the complete flow!**
