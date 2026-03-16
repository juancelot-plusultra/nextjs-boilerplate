# User Management Guide

## Overview

The Members Management system is fully integrated with Supabase. It allows you to add, edit, search, and delete gym members with real-time data synchronization.

## Access the System

Navigate to: `http://localhost:3000/admin/users`

Or from the admin dashboard: `http://localhost:3000/admin`

## Features

### 1. Add New Member
- Click **"Add Member"** button
- Fill in the required fields:
  - **Full Name** (required)
  - **Email** (required)
  - **Phone** (optional)
  - **Branch ID** (optional)
  - **Package** (optional - select from dropdown)
  - **Status** (active, expired, expiring, inactive)
  - **Sessions Left** (number)
  - **Total Sessions** (number)
  - **Join Date** (auto-filled with today)
  - **Total Paid** (currency amount)
- Click **"Add Member"** to save to Supabase
- Success message will appear

### 2. View Members
- All members are displayed in a table
- Shows: Name, Email, Phone, Package, Status, Sessions
- Data is fetched directly from Supabase
- Lists are ordered by newest first

### 3. Search Members
- Use the search bar at the top
- Search by:
  - Member name
  - Email address
  - Phone number
- Results update in real-time

### 4. Edit Member
- Click the **Edit icon** (pencil) next to a member
- Form loads with current data
- Modify any field
- Click **"Update Member"** to save changes
- Changes sync immediately to Supabase

### 5. Delete Member
- Click the **Delete icon** (trash) next to a member
- Confirm the action in the popup
- Member is permanently removed from Supabase
- List refreshes automatically

## Data Structure

All member data is stored in the `members` table in Supabase:

```
members {
  id: UUID (Primary Key)
  user_id: UUID (References auth.users)
  full_name: VARCHAR
  email: VARCHAR
  phone: VARCHAR
  branch_id: VARCHAR
  package_id: VARCHAR
  status: VARCHAR (active, expired, expiring, inactive)
  sessions_left: INT
  total_sessions: INT
  join_date: DATE
  total_paid: DECIMAL
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

## Supabase Integration

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### RLS (Row Level Security)
The `members` table has RLS policies enabled:
- Users can read their own member data
- Service role can manage all data
- This ensures data privacy and security

### Real-Time Sync
- All operations (Create, Read, Update, Delete) are synchronous
- Changes appear immediately in the UI
- Error messages display if something goes wrong

## Troubleshooting

### "Error loading members"
1. Check Supabase URL and keys in environment variables
2. Ensure the `members` table exists (run migration scripts)
3. Check browser console for detailed error messages

### "Table does not exist" error
- Run the SQL migrations in Supabase SQL Editor
- See `SUPABASE_SETUP.md` for instructions

### Changes not saving
1. Verify Supabase credentials
2. Check network tab in browser DevTools
3. Ensure fields are filled correctly (name and email required)

### Slow performance
- Check Supabase network status
- Create indexes on frequently queried fields (already done in migration)
- Consider pagination for large member lists

## Best Practices

1. **Before adding members**: Ensure all required fields are filled
2. **Phone format**: Keep phone numbers in a consistent format
3. **Package selection**: Use the same package IDs across your system
4. **Status management**: Update status when packages expire
5. **Regular backups**: Supabase provides automatic backups

## Future Enhancements

- Bulk import from CSV
- Member profile photos
- Session history tracking
- Payment history
- Automated renewal reminders
- Export member data

## Support

For issues with:
- **Data sync**: Check Supabase dashboard
- **UI bugs**: Check browser console
- **Authentication**: Verify Supabase Auth settings
- **Database**: Check SQL migration status
