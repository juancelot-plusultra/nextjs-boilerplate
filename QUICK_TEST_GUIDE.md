# Quick Test Guide - 10 Minutes

## Test Account (Copy & Paste)

```
Email:    johnphilipgallana@gmail.com
Password: Applesarered6
```

---

## Test 1: Navigation (2 min)

**URL:** `http://localhost:3000/welcome`

**What to test:**
1. Swipe left on screen → slides should move forward ✓
2. Swipe right on screen → slides should move backward ✓
3. Click "Back" button on Better Form slide → should go to Welcome ✓
4. Click "Back" on Welcome slide → should be disabled ✓
5. Click "Next" on slides → should move forward ✓
6. Click "Next" on last slide → should be disabled ✓

---

## Test 2: Assessment Form (3 min)

**On last slide (Free Assessment):**

1. Click "Get Started – Free Assessment" button
2. Modal should open with form
3. Fill form:
   - Full Name: John Test
   - Email: john@test.com
   - Phone: +63 917 1234567
   - Address: 123 Test St
   - **Gym Branch:** Select "Malingap", "E.Rod", or "Primark Cainta" ✓
   - **Assessment Date:** Pick any date ✓
   - Fitness Goals: Test goals
4. Submit form
5. **Acknowledgement message should appear** ✓
6. Should redirect to dashboard

---

## Test 3: Authentication (3 min)

**Sign Up:**
1. Click "Get Started" on first slide
2. Click "Sign Up" tab
3. Fill form with test account info:
   ```
   Full Name: John Philip Gallana
   Email: johnphilipgallana@gmail.com
   Password: Applesarered6
   Confirm: Applesarered6
   Phone: +63 917 1234567
   ```
4. Click "Sign Up" ✓
5. Should redirect to dashboard

**Login:**
1. Click "Get Started" on first slide
2. Click "Login" tab
3. Enter test credentials ✓
4. Click "Sign In"
5. Should redirect to dashboard with member data

---

## Test 4: Images (1 min)

**What to verify:**
- [ ] No image errors in browser console
- [ ] All photos on slides load properly
- [ ] No warnings about unconfigured hostnames

---

## What Should See After All Tests

✅ Navigation works with swipe AND buttons  
✅ Back button works (except on first slide)  
✅ Gym branches show: Malingap, E.Rod, Primark Cainta  
✅ Assessment date picker works  
✅ Acknowledgement message appears  
✅ Login redirects to dashboard  
✅ No image errors  

---

## If Something Doesn't Work

**Back button issue:**
- Refresh page and try again
- Check browser console for errors

**Assessment form issue:**
- Make sure you filled all required fields (marked with *)
- Check browser console

**Login issue:**
- Make sure you're using exact credentials
- Check that Supabase is connected

**Image issue:**
- Clear browser cache
- Check browser console for errors

---

## Files That Changed

Only 2 files modified:
1. `/next.config.ts` - Image configuration
2. `/app/welcome/page.tsx` - Navigation, form, message

**New files created:**
- `/TEST_ACCOUNT_SETUP.md` - Setup guide
- `/FIXES_AND_UPDATES.md` - Details
- `/FINAL_IMPLEMENTATION_REPORT.md` - Full report

---

**Estimated Test Time: 10 minutes**

All features should work perfectly! 🚀
