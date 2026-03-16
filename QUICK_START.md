# Quick Start Guide - Members Management with Supabase

## What's New?

### ✅ 1. Members Management System
- Full CRUD interface for managing gym members
- Real-time Supabase integration
- Search, filter, and edit functionality
- Data persists in Supabase database

### ✅ 2. Admin Dashboard
- Navigation hub for admin features
- Quick stats and menu items
- Access Members Management from here

### ✅ 3. REST API Endpoints
- CRUD operations for members
- Connection verification endpoint
- Filter by status and branch

---

## Get Started in 3 Steps

### Step 1: Verify Database (2 minutes)
1. Ensure all 4 SQL migrations are run in Supabase SQL Editor
2. Check `/api/members/check-connection` in your browser
3. You should see: `"connected": true`

**Expected Result**: Connection verified ✅

---

### Step 2: Access Members Management (1 minute)
1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/admin/users`
3. You'll see the Members Management interface

**Expected Result**: 
- Empty members list (or existing members if any)
- "Add Member" button visible
- Search bar ready to use

---

### Step 3: Add Your First Member (2 minutes)
1. Click the **"Add Member"** button
2. Fill in the form:
   - **Full Name**: John Doe (required)
   - **Email**: john@example.com (required)
   - **Phone**: +63 912 345 6789 (optional)
   - **Package**: Full 24
   - **Status**: Active
   - **Sessions Left**: 24
   - **Total Sessions**: 24
   - Other fields as needed

3. Click **"Add Member"**

**Expected Result**:
- ✅ "Member added successfully!" message
- ✅ Form closes and resets
- ✅ New member appears in the table
- ✅ Data appears in Supabase immediately

---

## Verify Data in Supabase

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Table Editor** → Select **members**
4. You should see your newly added member with all data!

---

## Key Features

### Add Members
- Click "Add Member" button
- Fill required fields (name, email)
- All data saves to Supabase

### Search Members
- Use search bar to find by name, email, or phone
- Real-time filtering

### Edit Members
- Click the pencil icon next to any member
- Update any field
- Click "Update Member" to save

### Delete Members
- Click the trash icon
- Confirm deletion
- Member removed from Supabase

### View Status
- Color-coded status badges (Active, Expiring, Expired)
- Session tracking (left/total)

---

## File Structure

```
project/
├── app/
│   ├── admin/
│   │   ├── page.tsx (Admin Dashboard)
│   │   └── users/
│   │       └── page.tsx (Members Management UI)
│   ├── api/
│   │   └── members/
│   │       ├── route.ts (CRUD API)
│   │       └── check-connection/route.ts (Connection verification)
│   └── api/auth/ (Authentication routes)
├── scripts/ (SQL migrations)
├── SUPABASE_SETUP.md (Database setup)
├── USER_MANAGEMENT_GUIDE.md (Detailed guide)
├── QUICK_START.md (This file)
└── .env.local (Your credentials)
```

---

## API Endpoints Reference

### Check Connection
```bash
GET http://localhost:3000/api/members/check-connection
```

### Get All Members
```bash
GET http://localhost:3000/api/members
```

### Get Active Members
```bash
GET http://localhost:3000/api/members?status=active
```

### Create Member
```bash
POST http://localhost:3000/api/members
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+63 912 345 6789",
  "package_id": "full24",
  "status": "active",
  "sessions_left": 24,
  "total_sessions": 24
}
```

### Update Member
```bash
PUT http://localhost:3000/api/members
Content-Type: application/json

{
  "id": "member-uuid",
  "sessions_left": 20,
  "status": "active"
}
```

### Delete Member
```bash
DELETE http://localhost:3000/api/members?id=member-uuid
```

---

## Troubleshooting

### Issue: "Loading members..." stuck
**Solution**: 
- Check connection: `http://localhost:3000/api/members/check-connection`
- Ensure all SQL migrations are run
- Check browser console for errors (F12)

### Issue: "Table does not exist" error
**Solution**: Run SQL migrations from `SUPABASE_SETUP.md` in Supabase SQL Editor

### Issue: Changes not saving
**Solution**: 
1. Verify Supabase URL and keys in environment variables
2. Check network tab in DevTools
3. Ensure name and email fields are filled

### Issue: Can't find members after adding
**Solution**: 
1. Refresh the page (F5)
2. Check Supabase table directly for data
3. Verify RLS policies aren't blocking access

---

## Data Flow

### Adding a Member:
1. Fill form and click "Add Member"
2. Data sent to client-side Supabase client
3. Supabase saves to `members` table
4. Success message appears
5. Page refreshes member list automatically

### Editing a Member:
1. Click edit icon
2. Form loads with current data
3. Make changes and click "Update Member"
4. Changes sync to Supabase
5. Table updates immediately

### Deleting a Member:
1. Click delete icon
2. Confirm in popup
3. Supabase removes record
4. Table refreshes

---

## Sample Members to Add

Try adding these test members:

```
1. Alex Cruz | alex@email.com | +63 917-123-4567 | Full 48 | Active | 19/48 sessions
2. Maria Santos | maria@email.com | +63 919-345-6789 | Personal Training | Active | 12/24 sessions
3. John Reyes | john@email.com | +63 918-234-5678 | Staggered 24 | Expiring | 8/24 sessions
```

---

## What's Next?

- Read `USER_MANAGEMENT_GUIDE.md` for detailed feature documentation
- Check `SUPABASE_SETUP.md` for database schema reference
- Review `SUPABASE_CONNECTION_FIX.md` for technical details

---

**Ready to go!** Access the Members Management at: `http://localhost:3000/admin/users`
