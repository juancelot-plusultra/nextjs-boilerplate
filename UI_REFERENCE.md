# Members Management UI Reference

## Page Layout Overview

### Admin Users Page (`/admin/users`)

#### Header Section
```
┌─────────────────────────────────────────────────────────────────┐
│ Members Management                          [+ Add Member]      │
│ Add, edit, and manage gym members                              │
└─────────────────────────────────────────────────────────────────┘
```

#### Message Section
```
┌─────────────────────────────────────────────────────────────────┐
│ ✓ Member added successfully!                                    │
│ (Green success message or red error message)                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Add Member Form (When Opened)
```
┌─────────────────────────────────────────────────────────────────┐
│ Add New Member                                              [×] │
├─────────────────────────────────────────────────────────────────┤
│ Full Name *              │ Email *                              │
│ [John Doe             ] │ [john@example.com              ]    │
│                                                                 │
│ Phone                   │ Branch ID                            │
│ [+63 912 345 6789    ] │ [BRH-001                       ]    │
│                                                                 │
│ Package                 │ Status                               │
│ [Full 24 ▼           ] │ [Active ▼                      ]    │
│                                                                 │
│ Sessions Left           │ Total Sessions                       │
│ [24                  ] │ [24                            ]    │
│                                                                 │
│ Join Date               │ Total Paid                           │
│ [2026-03-16          ] │ [0.00                          ]    │
│                                                                 │
│        [Update Member]         [Cancel]                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Search Bar
```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Search by name, email, or phone...                          │
└─────────────────────────────────────────────────────────────────┘
```

#### Members Table
```
┌────────────────────────────────────────────────────────────────────────┐
│ Name           │ Email              │ Phone          │ Package │ Status │
├────────────────────────────────────────────────────────────────────────┤
│ 👤 John Doe    │ john@example.com   │ +63 912 345... │ Full 24 │ Active │
│                                                                  ✏️  🗑️  │
├────────────────────────────────────────────────────────────────────────┤
│ 👤 Jane Smith  │ jane@example.com   │ +63 918 234... │ PT      │ Active │
│                                                                  ✏️  🗑️  │
├────────────────────────────────────────────────────────────────────────┤
│ 👤 Alex Cruz   │ alex@example.com   │ +63 917 123... │ Full 48 │ Expire │
│                                                                  ✏️  🗑️  │
└────────────────────────────────────────────────────────────────────────┘
Showing 3 of 3 members
```

---

## Component Details

### Header
- **Title**: "Members Management" (4xl font, bold, white)
- **Subtitle**: "Add, edit, and manage gym members" (slate-400)
- **Button**: Orange gradient "Add Member" with + icon
- **Colors**: Dark slate background with white text

### Form Fields

#### Text Inputs
- **Style**: Slate 700 background, slate 600 border
- **Focus**: Border turns orange
- **Placeholder**: Slate 400 text
- **Padding**: 4px vertical, consistent height

#### Select Dropdowns
- **Style**: Same as text inputs
- **Options**: Full 24, Full 48, Staggered 24, Staggered 48, PT, Pilates
- **Status Options**: Active, Expired, Expiring, Inactive

#### Buttons
- **Primary (Add/Update)**: Orange 500, hover → Orange 600
- **Secondary (Cancel)**: Slate 700, hover → Slate 600
- **Full Width**: Takes available space in form

### Status Badges (in Table)

```
ACTIVE      [Green badge]     bg-green-900/30 text-green-200
EXPIRING    [Yellow badge]    bg-yellow-900/30 text-yellow-200
EXPIRED     [Red badge]       bg-red-900/30 text-red-200
```

### Action Icons
- **Edit** (Pencil): 18px, text-orange-400, hover → text-orange-300
- **Delete** (Trash): 18px, text-red-400, hover → text-red-300

### Messages

#### Success Message
```
Background: bg-green-900/20
Border: border border-green-500/30
Text: text-green-200
Icon: ✓ (built-in)
```

#### Error Message
```
Background: bg-red-900/20
Border: border border-red-500/30
Text: text-red-200
Icon: ✗ (built-in)
```

---

## Admin Dashboard (`/admin`)

### Header
```
┌─────────────────────────────────────────────────────────────┐
│ Admin Dashboard                                              │
│ Manage your gym operations and members with Supabase        │
└─────────────────────────────────────────────────────────────┘
```

### Menu Grid (2x2 on tablet, 4 in desktop)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 👥           │ │ 📊           │ │ ⚙️            │ │ 📄           │
│              │ │              │ │              │ │              │
│ Members      │ │ Analytics    │ │ Settings     │ │ Reports      │
│ Management   │ │              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Each card has:
- Colored icon box (blue, purple, green, orange)
- Title
- Description
- Hover effect with shadow

### Quick Stats Section
```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ Total Members    │ Active Sessions  │ Revenue          │ Staff Members    │
│ -                │ -                │ -                │ -                │
│ Synced...        │ This week        │ This month       │ Active coaches   │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

## Color Palette

### Backgrounds
- **Primary**: `from-slate-900 via-slate-800 to-slate-900` (gradient)
- **Card**: `bg-slate-800`
- **Hover**: `hover:bg-slate-700/30`

### Text
- **Primary**: `text-white` (headings, labels)
- **Secondary**: `text-slate-400` (descriptions, placeholders)
- **Tertiary**: `text-slate-300` (table data)

### Inputs
- **Background**: `bg-slate-700`
- **Border**: `border-slate-600`
- **Focus**: `focus:border-orange-500`
- **Text**: `text-white`

### Buttons
- **Primary**: `bg-orange-500 hover:bg-orange-600`
- **Secondary**: `bg-slate-700 hover:bg-slate-600`
- **Text**: `text-white`

### Status Colors
- **Active**: Green (`bg-green-900/30 text-green-200`)
- **Expiring**: Yellow (`bg-yellow-900/30 text-yellow-200`)
- **Expired**: Red (`bg-red-900/30 text-red-200`)

---

## Responsive Breakpoints

### Mobile (< 768px)
- Form: Single column
- Table: Horizontal scroll enabled
- Buttons: Full width
- Spacing: Reduced padding

### Tablet (768px - 1024px)
- Form: 2 columns
- Table: Standard layout
- Menu: 2x2 grid

### Desktop (> 1024px)
- Form: 2 columns
- Table: Full display with all columns visible
- Menu: 4 columns

---

## Interactive States

### Form Submit
```
Before:    [Add Member]
During:    [Adding...]   (disabled, opacity reduced)
After:     Form closes, success message appears
```

### Search
```
Typing in search box → Instant filtering (no delay)
No results → "No members found" message
```

### Edit Action
```
Click pencil → Form opens with member data
Form shows "Edit Member" instead of "Add New Member"
Update button shows "Update Member" instead of "Add Member"
```

### Delete Action
```
Click trash → Confirmation dialog appears
Confirm → Member removed immediately
List refreshes
```

---

## Accessibility Features

- **Labels**: All form inputs have labels
- **Required Fields**: Marked with * asterisk
- **Error Messages**: Clear and descriptive
- **Focus States**: Visible on all interactive elements
- **Semantic HTML**: Proper button, form, and table elements
- **Alt Text**: Icons have title attributes
- **Keyboard Navigation**: All interactive elements accessible via tab

---

## Loading States

### Initial Load
```
┌────────────────────────────────┐
│ Loading members...             │
└────────────────────────────────┘
(Shown in table body)
```

### Empty State
```
┌────────────────────────────────────────────┐
│ No members found.                          │
│ Click "Add Member" to create one.          │
└────────────────────────────────────────────┘
```

---

## Spacing & Layout

### Padding
- **Page**: `p-6 md:p-8`
- **Cards**: `p-6`
- **Form Groups**: `gap-6`
- **Table Cells**: `px-6 py-4`

### Margins
- **Section Headers**: `mb-8`
- **Button Groups**: `gap-4`
- **Form Inputs**: `space-y-5` (vertical stack)

### Border Radius
- **Cards**: `rounded-xl`
- **Buttons**: `rounded-lg`
- **Inputs**: `rounded-lg`

---

## Typography

### Headings
- **H1** (Page Title): `text-4xl md:text-5xl font-bold`
- **H2** (Section): `text-2xl font-bold`
- **Labels**: `text-sm font-semibold`

### Body Text
- **Regular**: `text-base` or `text-sm`
- **Secondary**: `text-slate-400 text-sm`
- **Table**: `text-white font-medium` or `text-slate-300`

---

This UI is fully responsive, accessible, and provides a professional gym management experience with real-time Supabase integration.
