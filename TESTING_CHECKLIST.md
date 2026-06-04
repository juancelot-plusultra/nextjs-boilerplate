# BearFit Welcome Page - Testing Checklist

## Pre-Testing Setup (Do Once)

### 1. Clear Browser Storage
- [ ] Open DevTools (F12 or right-click → Inspect)
- [ ] Go to **Application** tab
- [ ] Click **Storage** → **Local Storage**
- [ ] Select `http://localhost:3000`
- [ ] Delete all entries (or just `bearfit_onboarded_v1`)

### 2. Start Dev Server
- [ ] Run `npm run dev`
- [ ] Confirm running on `http://localhost:3000`

### 3. Create Test Account (Optional but Recommended)
- [ ] Go to Supabase Dashboard
- [ ] SQL Editor → Create new query
- [ ] Copy SQL from `/FINAL_SUMMARY.md` Step 1
- [ ] Execute query
- [ ] Note the created user ID (you'll need it for member record)

---

## Test 1: Navigation Buttons ✅

### First Slide (Welcome Video)
- [ ] Navigate to `http://localhost:3000/welcome`
- [ ] **Back Button (←)**
  - [ ] Should appear GREYED OUT
  - [ ] Cursor should show "not-allowed"
  - [ ] Click it → nothing happens
- [ ] **Next Button (→)**
  - [ ] Should appear ACTIVE (bright text)
  - [ ] Click it → moves to slide 2 "Better Form"
  - [ ] Confirms button works

### Slide 2-4 (Better Form/Function/Fitness)
- [ ] On each slide:
  - [ ] **Back Button**
    - [ ] Should be BRIGHT and clickable
    - [ ] Click → goes back one slide
  - [ ] **Next Button**
    - [ ] Should be BRIGHT and clickable
    - [ ] Click → goes forward one slide

### Last Slide (Free Assessment)
- [ ] Navigate to slide 5
- [ ] **Back Button**
  - [ ] Should be BRIGHT and clickable
  - [ ] Click → goes back to "Better Fitness"
- [ ] **Next Button**
  - [ ] Should appear GREYED OUT
  - [ ] Cursor shows "not-allowed"
  - [ ] Click it → nothing happens

---

## Test 2: Welcome Slide CTA Button ✅

### Button Text
- [ ] On first slide, look for orange button
- [ ] Text should say **"Get Started"** (not "Sign In / Sign Up")
- [ ] Should show countdown timer (47s, decreasing)

### Button Function
- [ ] Click **"Get Started"**
- [ ] Auth modal should appear
- [ ] Modal should have:
  - [ ] Two tabs: "Login" and "Sign Up"
  - [ ] Close button (X) in top-right
  - [ ] Dark background matching app theme
  - [ ] Orange color scheme for buttons

### Alternative Navigation
- [ ] Auth modal should have text: "Or skip to learn more"
- [ ] Click it → closes modal, goes to slide 2
- [ ] Confirms alternative navigation works

---

## Test 3: Free Assessment Modal Form ✅

### Open Modal
- [ ] Navigate to slide 5 (Free Assessment)
- [ ] Click **"Get Started – Free Assessment"** button
- [ ] Dark modal should appear with form

### Form Fields Present
- [ ] **Full Name** field with placeholder "John Doe"
- [ ] **Email** field with placeholder "john@example.com"
- [ ] **Phone** field with placeholder "+1 (555) 123-4567"
- [ ] **Address** field with placeholder "123 Main Street"
- [ ] **Gym Branch** dropdown with options:
  - [ ] Main Branch
  - [ ] South Branch
  - [ ] North Branch
  - [ ] East Branch
- [ ] **Fitness Goals** textarea with placeholder

### Form Styling
- [ ] All fields have dark background (white/5)
- [ ] Border color is subtle (white/10)
- [ ] Focus state shows orange border (#F37120)
- [ ] Text is white and readable

### Form Validation
- [ ] Try submitting empty → validation errors
- [ ] Fill only some fields → validation errors
- [ ] Fill all required fields → form submits
- [ ] After submit → redirects to dashboard

### Modal Interaction
- [ ] Click X button → modal closes, stays on slide 5
- [ ] Click outside modal → modal closes, stays on slide 5
- [ ] Fill form and submit → redirects to dashboard

---

## Test 4: Auth Modal - Sign Up ✅

### Access Modal
- [ ] Go to slide 1 (Welcome)
- [ ] Click "Get Started" button
- [ ] Auth modal appears
- [ ] Click **"Sign Up"** tab

### Sign Up Fields
- [ ] **Email** field
- [ ] **Password** field
- [ ] **Confirm Password** field
- [ ] **Full Name** field
- [ ] **Phone** field (optional)

### Test Sign Up Flow
- [ ] Enter test data:
  ```
  Email: test@example.com
  Password: TestPassword123!
  Confirm: TestPassword123!
  Full Name: Test User
  Phone: +1 (555) 123-4567
  ```
- [ ] Click **"Sign Up"**
- [ ] Should see success message
- [ ] Should redirect to dashboard
- [ ] Dashboard should load user data

---

## Test 5: Auth Modal - Login ✅

### Test with Real Account
- [ ] Go to slide 1
- [ ] Click "Get Started"
- [ ] Click **"Login"** tab
- [ ] Enter credentials:
  ```
  Email: johnphilipgallana@gmail.com
  Password: Applesarered6
  ```
- [ ] Click **"Login"**
- [ ] Should see "Login successful! Redirecting..."
- [ ] Should redirect to `/member/dashboard`
- [ ] Dashboard should show:
  - [ ] User name: "John Philip Gallana"
  - [ ] User email: "johnphilipgallana@gmail.com"
  - [ ] Member data (if created):
    - [ ] Total Sessions: 12
    - [ ] Sessions Left: 8
    - [ ] Total Paid: ₱15,000

### Test Invalid Credentials
- [ ] Go back to welcome (clear storage)
- [ ] Click "Get Started" → Login
- [ ] Enter wrong password
- [ ] Should show error message
- [ ] Modal should stay open

---

## Test 6: Dashboard Integration ✅

### After Login
- [ ] Redirected to `/member/dashboard`
- [ ] No 404 errors
- [ ] Page loads without errors

### Check User Data
- [ ] Open DevTools → Console
- [ ] Look for log: `[v0] Member fetch error` → should NOT appear
- [ ] Check if user name displays
- [ ] Check if member data displays (if available)

### Dashboard Navigation
- [ ] All dashboard features work
- [ ] No broken links
- [ ] No console errors related to auth

---

## Test 7: Edge Cases ✅

### Multiple Test Runs
- [ ] Clear storage
- [ ] Test welcome flow again
- [ ] Repeat 2-3 times
- [ ] Should always work consistently

### Session Persistence
- [ ] Login to account
- [ ] Go to dashboard
- [ ] Refresh page (F5)
- [ ] Should still be logged in
- [ ] User data should still display

### Navigation After Login
- [ ] Login to account
- [ ] Redirect to dashboard happens
- [ ] Try to go back to `/welcome`
- [ ] Should stay on `/welcome` (no auto-redirect)

---

## Test 8: Mobile Responsiveness ✅

### Mobile View
- [ ] DevTools → Toggle device toolbar
- [ ] Set to iPhone 12 (375px width)

### Welcome Slides
- [ ] All slides display correctly
- [ ] Text readable on mobile
- [ ] Buttons clickable
- [ ] No horizontal scrolling

### Modals on Mobile
- [ ] Auth modal centered
- [ ] Form fields full width
- [ ] Close button accessible
- [ ] Keyboard appears for inputs

### Form on Mobile
- [ ] Free Assessment form readable
- [ ] All fields visible
- [ ] No overflow
- [ ] Submit button clickable

---

## Test 9: Error Handling ✅

### Network Errors
- [ ] Open DevTools → Network tab
- [ ] Filter XHR/Fetch
- [ ] Try login
- [ ] Check all API calls complete
- [ ] Confirm success response (200 status)

### Invalid Form Data
- [ ] Submit form with invalid email
- [ ] Should show validation error
- [ ] Form doesn't submit

### Database Errors (if table missing)
- [ ] Console should show: `[v0] Member table may not exist`
- [ ] But login should still work
- [ ] Dashboard should load without errors

---

## Performance Check ✅

### Page Load Time
- [ ] DevTools → Performance tab
- [ ] Record page load from `/welcome`
- [ ] Should complete in < 3 seconds
- [ ] No long tasks blocking main thread

### Modal Performance
- [ ] Open/close modals multiple times
- [ ] Should be instant
- [ ] No lag or stuttering

### Form Submission
- [ ] Submit form
- [ ] Should complete in < 2 seconds
- [ ] Redirect happens smoothly

---

## Final Verification Checklist

### Core Features
- [ ] Back button behavior correct
- [ ] Next button replaces skip functionality
- [ ] Welcome button text changed to "Get Started"
- [ ] Free Assessment modal exists with all fields
- [ ] Form submission works
- [ ] Auth modal works (login & signup)
- [ ] Test account can login

### User Experience
- [ ] No console errors
- [ ] No broken links
- [ ] Responsive on mobile
- [ ] Modals look professional
- [ ] Color scheme consistent
- [ ] Transitions smooth

### Integration
- [ ] Dashboard loads after login
- [ ] User data displays correctly
- [ ] Session persists on page refresh
- [ ] No auth issues

---

## If Tests Fail

### Check Browser Console (F12)
```
Look for [v0] debug messages
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Back button always visible | Check line 358 condition |
| Skip button still there | Check line 373-381 edits |
| Modal not opening | Check state: `assessmentModalOpen` |
| Form not submitting | Check console for validation errors |
| Login fails | Check Supabase credentials in `.env.local` |
| Dashboard error | Check member fetch error handling |

### Check Files Modified
- [ ] `/app/welcome/page.tsx` - has all edits
- [ ] `/scripts/create-test-account.js` - exists
- [ ] `/.env.local` - has Supabase credentials

### Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Clear cache
rm -rf .next

# Restart
npm run dev
```

---

## Sign Off

When all tests pass:

- [ ] Welcome navigation works perfectly
- [ ] Free Assessment form captures data
- [ ] Auth system fully functional
- [ ] Dashboard integration complete
- [ ] Ready for production

**Test Completed**: _______________
**Date**: _______________
**Notes**: _________________________________
