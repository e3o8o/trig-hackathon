# ✅ Create Tithe Commitment - Testing Checklist

Use this checklist to verify all features are working correctly.

---

## 🚀 Getting Started

- [ ] Run `npm run dev`
- [ ] Navigate to `http://localhost:3000`
- [ ] Verify home page loads correctly
- [ ] Check wallet connection in header

---

## 📝 Step 1: Select Church

### Basic Functionality
- [ ] Click "Start Giving" button from home page
- [ ] Lands on `/create-tithe` route
- [ ] Page loads without errors
- [ ] Step indicator shows Step 1 active (indigo)
- [ ] Other steps are inactive (gray)

### Church List Display
- [ ] 8 churches are displayed
- [ ] Each church card shows:
  - [ ] Church name
  - [ ] Green "Verified" badge
  - [ ] Location (city, state)
  - [ ] Denomination icon and text
  - [ ] Heart icon and member count
  - [ ] Arrow icon on right side

### Search Functionality
- [ ] Search bar is visible
- [ ] Type "Grace" - filters to Grace Community Church
- [ ] Type "Dallas" - shows all Dallas churches
- [ ] Type "Baptist" - shows Baptist churches
- [ ] Type "xyz123" - shows "No churches found" message
- [ ] Clear search - all churches reappear

### Interaction
- [ ] Hover over church card - border changes to indigo
- [ ] Click church card - advances to Step 2
- [ ] Back arrow in header works
- [ ] Steward logo in header is displayed

---

## ⚙️ Step 2: Configure Commitment

### Basic Display
- [ ] Step indicator shows Step 1 completed (green check)
- [ ] Step indicator shows Step 2 active (indigo)
- [ ] Selected church displayed in info box
- [ ] "Change" link works (goes back to Step 1)

### Form Fields
- [ ] Income threshold input displays
  - [ ] Dollar sign prefix visible
  - [ ] Can enter numbers
  - [ ] Accepts decimals (e.g., 5000.50)
  - [ ] Shows placeholder "5000"

- [ ] Tithe percentage input displays
  - [ ] Default value is "10"
  - [ ] Percentage symbol suffix visible
  - [ ] Can adjust from 0-100
  - [ ] Accepts decimals (e.g., 10.5)

- [ ] Offering percentage input displays
  - [ ] Default value is "0"
  - [ ] Percentage symbol suffix visible
  - [ ] Can adjust from 0-100
  - [ ] Optional (can stay 0)

- [ ] Frequency dropdown displays
  - [ ] Shows "Monthly (when income received)" as default
  - [ ] Can select "Bi-weekly"
  - [ ] Can select "Weekly"
  - [ ] Can select "One-time commitment"

### Real-time Calculations
- [ ] Preview box appears when income is entered
- [ ] Monthly Income shows correctly formatted
- [ ] Tithe amount calculates correctly (income × tithe%)
- [ ] Offering amount shows when offering% > 0
- [ ] Total giving sums correctly
- [ ] All amounts formatted with $ and 2 decimals

### Test Cases
#### Test Case 1: Traditional Tithe
- [ ] Enter income: $5,000
- [ ] Tithe: 10%
- [ ] Offering: 0%
- [ ] Verify: Tithe = $500.00, Total = $500.00

#### Test Case 2: Tithe + Offering
- [ ] Enter income: $8,000
- [ ] Tithe: 10%
- [ ] Offering: 5%
- [ ] Verify: Tithe = $800.00, Offering = $400.00, Total = $1,200.00

#### Test Case 3: Different Percentages
- [ ] Enter income: $6,500
- [ ] Tithe: 15%
- [ ] Offering: 3%
- [ ] Verify: Tithe = $975.00, Offering = $195.00, Total = $1,170.00

### Form Validation
- [ ] "Continue to Preview" button disabled when form invalid
- [ ] Button enabled when all required fields filled
- [ ] Cannot proceed with income = 0
- [ ] Cannot proceed with tithe = 0
- [ ] Can proceed with offering = 0
- [ ] Back button works

---

## 👁️ Step 3: Preview & Confirm

### Basic Display
- [ ] Step indicator shows Steps 1-2 completed (green checks)
- [ ] Step indicator shows Step 3 active (indigo)
- [ ] Page title: "Review Your Commitment"
- [ ] Confirmation message displays

### Church Information Section
- [ ] Church icon displays
- [ ] Church name correct
- [ ] Location correct
- [ ] Church ID displays

### Giving Details Section
- [ ] Dollar icon displays
- [ ] Income threshold correct with /month
- [ ] Tithe percentage correct
- [ ] Offering percentage shows (if > 0)
- [ ] Frequency displays correctly

### Monthly Giving Summary
- [ ] Section has indigo border/background
- [ ] Tithe to Church amount correct
- [ ] Additional Offering amount shows (if > 0)
- [ ] Border separator between items
- [ ] Total Monthly Giving correct (large, bold)
- [ ] Annual Total correct (monthly × 12)

### Important Information Box
- [ ] Amber/yellow background
- [ ] Shield icon displays
- [ ] All 5 bullet points display:
  - [ ] Blockchain recording mentioned
  - [ ] Automatic transfers mentioned
  - [ ] Modification/cancellation mentioned
  - [ ] Transparency mentioned
  - [ ] Tax receipts mentioned

### Buttons
- [ ] Back button works
- [ ] Confirm button shows when wallet NOT connected
- [ ] Message "Please connect your wallet" shows if not connected

### With Wallet Connected
- [ ] Connect wallet using WalletConnectButton
- [ ] Confirm button becomes enabled
- [ ] Click "Confirm Commitment"
- [ ] Button shows loading state
- [ ] Spinner appears with "Creating Commitment..."
- [ ] 2.5 second delay
- [ ] Advances to success page

---

## 🎉 Step 4: Success

### Basic Display
- [ ] All 3 steps show green checks
- [ ] Large green checkmark icon displays
- [ ] Title: "Commitment Created Successfully! 🎉"
- [ ] Subtitle about blockchain confirmation

### Commitment ID
- [ ] Green info box displays
- [ ] Shows "Commitment ID" label
- [ ] Displays ID starting with "TITHE-"
- [ ] ID is unique (includes timestamp)
- [ ] Monospace font for ID

### Commitment Summary
- [ ] Border box displays
- [ ] Church name shown
- [ ] Monthly Giving amount correct
- [ ] Annual Total correct

### What Happens Next Section
- [ ] Blue info box displays
- [ ] Checkmark icons on each bullet
- [ ] All 4 items display:
  - [ ] Active commitment
  - [ ] Income detection
  - [ ] Notifications
  - [ ] Dashboard access

### Action Buttons
- [ ] "View Giving History" button displays
- [ ] "Create Another Commitment" button displays
- [ ] "Return to Home" link displays

### Testing Actions
- [ ] Click "View Giving History" (placeholder link)
- [ ] Click "Create Another Commitment"
  - [ ] Returns to Step 1
  - [ ] Form is reset
  - [ ] Search is cleared
  - [ ] Can create another commitment
- [ ] Click "Return to Home" - goes to homepage

---

## 🔄 Navigation Tests

### Header Navigation
- [ ] Back arrow always visible (except on home)
- [ ] Back arrow works from any step
- [ ] Steward logo displays on all pages
- [ ] Wallet button accessible on all pages

### Browser Navigation
- [ ] Browser back button works
- [ ] Browser forward button works
- [ ] Direct URL navigation to /create-tithe works
- [ ] Refresh page maintains current view (in simulation)

---

## 📱 Responsive Design Tests

### Mobile (< 640px)
- [ ] Test on iPhone viewport
- [ ] Single column layout
- [ ] Buttons stack vertically
- [ ] Text is readable
- [ ] Touch targets large enough
- [ ] No horizontal scroll
- [ ] Search bar full width
- [ ] Church cards full width

### Tablet (640px - 1024px)
- [ ] Test on iPad viewport
- [ ] Comfortable spacing
- [ ] Buttons side-by-side
- [ ] Form fields appropriate width
- [ ] Cards display well

### Desktop (> 1024px)
- [ ] Content centered with max-width
- [ ] Comfortable reading width
- [ ] Buttons side-by-side
- [ ] Proper spacing throughout
- [ ] No weird gaps or overlaps

---

## 🎨 Visual Polish

### Typography
- [ ] Headings are large and bold
- [ ] Body text is readable
- [ ] Monospace font used for IDs
- [ ] Proper font weights

### Colors
- [ ] Indigo used for primary actions
- [ ] Green used for success
- [ ] Amber used for warnings
- [ ] Gray used for inactive
- [ ] High contrast text

### Spacing
- [ ] Consistent padding in cards
- [ ] Proper margins between sections
- [ ] No cramped areas
- [ ] Breathable white space

### Icons
- [ ] All icons display correctly
- [ ] Icons properly sized
- [ ] Icons aligned with text
- [ ] Appropriate icon for each context

### Animations
- [ ] Smooth transitions on hover
- [ ] Spinner rotates smoothly
- [ ] Page transitions smooth
- [ ] No janky animations

---

## 🔌 Wallet Integration

### Without Wallet
- [ ] Can browse all steps
- [ ] Can fill out forms
- [ ] Can reach preview step
- [ ] Cannot confirm without connection
- [ ] Clear message about connecting

### With Wallet
- [ ] WalletConnectButton shows address
- [ ] Can confirm commitment
- [ ] Transaction simulates correctly
- [ ] Success page shows

---

## 🐛 Error Scenarios

### Form Errors
- [ ] Try negative income - prevented
- [ ] Try income over 1 trillion - allowed
- [ ] Try tithe > 100% - prevented
- [ ] Try empty income - cannot proceed
- [ ] Try letters in number fields - prevented

### Edge Cases
- [ ] Income = $0.01 - calculates correctly
- [ ] Income = $1,000,000 - calculates correctly
- [ ] Tithe = 100% - calculates correctly
- [ ] Very long church names - display well
- [ ] Search with special characters - works

---

## ⚡ Performance

### Load Times
- [ ] Page loads quickly (< 1 second)
- [ ] Step transitions instant
- [ ] Search filtering instant
- [ ] Calculations instant

### No Memory Leaks
- [ ] Can go through flow multiple times
- [ ] No console errors
- [ ] No console warnings

---

## 📊 Data Accuracy

### Test Scenario 1: Sarah's Story (from docs)
- [ ] Income: $8,000
- [ ] Tithe: 10%
- [ ] Offering: 5%
- [ ] Church: Grace Community Church
- [ ] Frequency: Monthly
- [ ] Expected Monthly: $1,200
- [ ] Expected Annual: $14,400
- [ ] Verify calculations match

### Test Scenario 2: Simple Tithe
- [ ] Income: $3,000
- [ ] Tithe: 10%
- [ ] Offering: 0%
- [ ] Expected Monthly: $300
- [ ] Expected Annual: $3,600
- [ ] Verify calculations match

---

## 🎯 Acceptance Criteria Verification

From User Story 1.1:
- [ ] ✅ User can connect their wallet
- [ ] ✅ User can select a verified church from a list
- [ ] ✅ User can set income threshold
- [ ] ✅ User can set tithe percentage
- [ ] ✅ User can add additional offering percentage
- [ ] ✅ User can preview the commitment before confirming
- [ ] ✅ Transaction is recorded (simulated)
- [ ] ✅ User receives confirmation

---

## 📸 Screenshots for Demo

Capture these views:
- [ ] Home page with "Start Giving" button
- [ ] Step 1 with church list
- [ ] Step 1 search in action
- [ ] Step 2 with filled form and preview
- [ ] Step 3 review page
- [ ] Step 4 success page

---

## 🚀 Final Checks

- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All links work
- [ ] All buttons work
- [ ] Looks good on all screen sizes
- [ ] Smooth user experience
- [ ] Ready for demo! 🎉

---

## 📝 Notes

Use this space to record any issues found:

```
Issue 1:
- Description:
- Steps to reproduce:
- Expected:
- Actual:
- Severity:

Issue 2:
...
```

---

## ✅ Sign-Off

- [ ] All critical features tested
- [ ] All responsive sizes tested
- [ ] Wallet integration tested
- [ ] Calculations verified
- [ ] Visual polish checked
- [ ] Ready for production/demo

**Tested By**: _______________
**Date**: _______________
**Browser**: _______________
**Device**: _______________

---

## 🎉 Success Criteria

Feature is ready when:
- ✅ All test cases pass
- ✅ No blocking bugs
- ✅ Works on mobile & desktop
- ✅ Calculations are accurate
- ✅ User experience is smooth
- ✅ Visual design is polished

**Status**: Ready for Demo! 🚀
