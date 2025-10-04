# Mission Protection - Quick Start Testing Guide

## 🚀 Getting Started

### Run the Development Server
```bash
cd /c/Users/Antero/Documents/GitHub/trig-hackathon/frontend
npm run dev
```

Then open: `http://localhost:3000`

---

## 🧪 Testing Checklist

### 1. Navigation Tests
- [ ] Navigate to Mission Protection from home page navigation menu
- [ ] Click "Get Protected" button on Mission Protection feature card
- [ ] Verify back button returns to home page
- [ ] Check wallet connect button is visible

### 2. Wallet Connection
- [ ] Without wallet: See "Connect Wallet" message with instructions
- [ ] Connect wallet: Form becomes accessible
- [ ] Disconnect wallet: Form becomes inaccessible again

### 3. Step 1: Destination Selection
- [ ] See all 15 destinations in grid layout
- [ ] Search for "Kenya" - see only Kenya in results
- [ ] Search for "East Africa" - see Kenya and Uganda
- [ ] Clear search - all destinations return
- [ ] Click Kenya - card highlights with indigo border/background
- [ ] Click different country - previous selection clears
- [ ] Verify risk level badges display correctly (Low/Medium/High)
- [ ] Verify base rates shown for each destination
- [ ] Click "Continue to Dates" - proceeds to step 2

### 4. Step 2: Dates & Details
- [ ] See selected destination summary at top with risk badge
- [ ] Select start date (try past date - should be prevented)
- [ ] Select end date before start date - validation should work
- [ ] Select valid date range - see trip duration calculated
- [ ] Try 7-day trip - see "7 days" displayed
- [ ] Try 30-day trip - see "30 days" displayed
- [ ] Select trip purpose from dropdown
- [ ] Enter organization name: "Grace Community Church"
- [ ] "Continue to Coverage" disabled until all fields filled
- [ ] Click "Back" - returns to step 1 with destination still selected

### 5. Step 3: Coverage Selection
- [ ] See 5 coverage options ($1K, $2K, $3K, $5K, $10K)
- [ ] Each option shows calculated premium based on:
  - Selected destination's risk rate
  - Trip duration from step 2
- [ ] Click $2,000 option - highlights
- [ ] See "What's Covered" section with 5 benefits
- [ ] All benefits have green checkmarks
- [ ] "Review Policy" button enabled after selection
- [ ] Click "Back" - returns to step 2 with dates preserved

### 6. Step 4: Review & Confirm
- [ ] See complete trip details:
  - Destination with risk level
  - Start and end dates
  - Duration in days
  - Purpose
  - Organization name
- [ ] See coverage summary:
  - Coverage amount in large font
  - Premium amount in large font
- [ ] Read "Important Information" section
- [ ] Read "Powered by Blockchain" info
- [ ] Click "Back" - returns to step 3 with coverage selected
- [ ] Click purchase button - button shows premium amount
- [ ] Processing state: spinner visible, buttons disabled

### 7. Step 5: Success
- [ ] See green checkmark icon
- [ ] See "Protection Activated! 🎉" message
- [ ] Policy ID displayed (starts with "POLICY-")
- [ ] See policy summary:
  - Coverage amount
  - Premium paid
  - Destination
  - Duration
- [ ] Read "What's Next?" section with 4 steps
- [ ] Click "View My Policies" - goes to /my-commitments
- [ ] Click "Purchase Another Policy" - resets form to step 1
- [ ] Click "Back to Home" - goes to home page

---

## 📊 Test Scenarios

### Scenario A: Quick Trip to Mexico
**Objective**: Test low-risk, short-duration trip

1. Select **Mexico** (Low risk, 5% rate)
2. Dates: 7 days from today
3. Purpose: Youth Ministry
4. Organization: Living Word Church
5. Coverage: $1,000 Basic
6. Expected premium: ~$35-40
7. Complete purchase
8. Verify policy created

### Scenario B: Extended Medical Mission
**Objective**: Test medium-risk, long-duration trip

1. Select **Kenya** (Medium risk, 8% rate)
2. Dates: 30 days starting next month
3. Purpose: Medical Mission
4. Organization: Grace Community Church
5. Coverage: $2,000 Standard
6. Expected premium: ~$165-175
7. Complete purchase
8. Verify policy created

### Scenario C: High-Risk Mission
**Objective**: Test high-risk destination with maximum coverage

1. Select **Haiti** (High risk, 12% rate)
2. Dates: 14 days starting next week
3. Purpose: Disaster Relief
4. Organization: Covenant Church
5. Coverage: $5,000 Premium
6. Expected premium: ~$640-650
7. Complete purchase
8. Verify policy created

### Scenario D: Form Validation
**Objective**: Test all validation rules

1. Try to continue from step 1 without selecting country → Blocked
2. Select country → Can proceed
3. Try to continue from step 2 without filling all fields → Blocked
4. Try selecting past start date → Prevented
5. Try selecting end date before start → Prevented
6. Fill all fields correctly → Can proceed
7. Try to continue from step 3 without selecting coverage → Blocked
8. Select coverage → Can proceed
9. Verify all data in review step
10. Complete purchase

---

## 🎨 Visual Checks

### Responsive Design
- [ ] Desktop (1920px): 3-column grid for destinations
- [ ] Tablet (768px): 2-column grid
- [ ] Mobile (375px): 1-column stack

### Color & Styling
- [ ] Purple/pink gradient on feature card
- [ ] Risk badges: Green (Low), Yellow (Medium), Red (High)
- [ ] Indigo buttons and highlights
- [ ] Consistent with other pages (same header, fonts)

### Icons
- [ ] ✈️ Plane icon in page header
- [ ] 📍 MapPin on destination cards
- [ ] 🌍 Globe on search input
- [ ] 📅 Calendar on date inputs
- [ ] 💰 DollarSign on purchase button
- [ ] 🛡️ Shield on coverage section
- [ ] ⚠️ AlertTriangle on warnings
- [ ] ℹ️ Info on notices
- [ ] ✅ CheckCircle on success

### Progress Indicator
- [ ] Shows 4 steps: Destination, Dates, Coverage, Review
- [ ] Current step highlighted in indigo
- [ ] Completed steps filled with indigo
- [ ] Future steps in gray
- [ ] Line between steps updates color

---

## 🐛 Common Issues to Check

### Issue: Wallet not connecting
**Fix**: Make sure MetaMask or wallet extension is installed

### Issue: Dates not selectable
**Fix**: Check date input min/max attributes are working

### Issue: Premium showing $0 or NaN
**Fix**: Verify all form data is filled before calculation

### Issue: Success page not showing
**Fix**: Check step state is updating to 'success'

### Issue: Back button not working
**Fix**: Verify step navigation logic

### Issue: Form resets unexpectedly
**Fix**: Check state management isn't causing re-renders

---

## 📝 Feature Completeness

### User Story 2.1 Requirements ✅
- [x] User can connect wallet
- [x] User can enter trip destination
- [x] User can select trip dates
- [x] User can choose coverage amount
- [x] System calculates premium automatically
- [x] User can review policy details
- [x] User can pay premium and receive policy
- [x] Policy recorded on blockchain (UI ready)

### Integration Readiness
- [ ] Smart contract connection
- [ ] Premium payment transaction
- [ ] Policy NFT minting
- [ ] Blockchain storage
- [ ] Transaction confirmations
- [ ] Error handling

---

## 🎯 Success Criteria

A successful test means:

✅ All navigation works smoothly
✅ Form validation prevents invalid submissions
✅ Premium calculations are accurate
✅ All 5 steps flow logically
✅ UI is responsive and professional
✅ No console errors
✅ Wallet integration works correctly
✅ Success state displays properly

---

## 📞 Next Steps After Testing

If testing successful:
1. Document any bugs found
2. Fix critical issues
3. Implement User Story 2.2 (File Claims)
4. Integrate with smart contracts
5. Add to My Commitments page

If testing finds issues:
1. Create bug list with screenshots
2. Prioritize by severity
3. Fix blocking issues first
4. Re-test after fixes

---

## 🎉 Feature Complete!

Once testing passes, **User Story 2.1: Purchase Mission Protection** is complete and ready for demo! 🚀

Ready to showcase:
- Professional, intuitive UI
- Complete purchase flow
- Real-time calculations
- Blockchain-ready architecture
- Production-quality code

**Next**: User Story 2.2 - File Mission Trip Claim
