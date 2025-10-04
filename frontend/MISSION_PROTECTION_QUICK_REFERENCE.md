# 🚀 Mission Protection - Quick Reference

## 📍 Access Points

### URLs
- **Main Page**: `http://localhost:3000/mission-protection`
- **Home Page**: `http://localhost:3000/`

### Navigation
- Header: "Mission Protection" link
- Home Page: "Get Protected" button on Mission Protection card

---

## 🎯 Quick Test Flow

### 5-Minute Demo Test
1. **Connect Wallet** → Click wallet button, connect MetaMask
2. **Select Kenya** → Click Kenya card (Medium risk)
3. **Set Dates** → Tomorrow + 30 days from tomorrow
4. **Add Details** → "Medical Mission" + "Grace Community Church"
5. **Choose $2,000** → Standard Protection (~$170 premium)
6. **Review** → Check all details look correct
7. **Purchase** → Click purchase button, wait 3 seconds
8. **Success!** → See policy ID and confirmation

**Expected Result**: Policy created with ID like `POLICY-1728000000-ABC123XYZ`

---

## 💰 Premium Examples

| Destination | Risk | Days | Coverage | Premium |
|-------------|------|------|----------|---------|
| Mexico | Low | 7 | $1,000 | ~$35 |
| Kenya | Medium | 30 | $2,000 | ~$170 |
| Haiti | High | 14 | $5,000 | ~$650 |
| Thailand | Low | 21 | $3,000 | ~$158 |

---

## ✅ Key Features Checklist

### User Can:
- [x] Search and filter 15 destinations
- [x] See risk levels and rates
- [x] Select trip dates with validation
- [x] Calculate trip duration automatically
- [x] Choose from 8 ministry purposes
- [x] Enter organization details
- [x] Compare 5 coverage options
- [x] See real-time premium calculation
- [x] Review complete policy before purchase
- [x] Complete purchase (simulated)
- [x] Receive unique policy ID
- [x] Navigate to other pages

### System Provides:
- [x] Wallet connection requirement
- [x] Form validation throughout
- [x] Progressive step disclosure
- [x] Back navigation preserves data
- [x] Visual progress indicator
- [x] Clear success confirmation
- [x] Professional UI/UX

---

## 🎨 Visual Quick Reference

### Colors
- **Feature Theme**: Purple/Pink gradient
- **Risk Low**: 🟢 Green
- **Risk Medium**: 🟡 Yellow
- **Risk High**: 🔴 Red
- **Selected**: Indigo
- **Success**: Green

### Icons
- ✈️ Plane - Main feature
- 📍 MapPin - Destinations
- 📅 Calendar - Dates
- 💰 DollarSign - Payment
- 🛡️ Shield - Protection
- ✅ CheckCircle - Success

---

## 🐛 Common Issues & Fixes

### Issue: Can't access form
**Fix**: Connect wallet first

### Issue: Can't proceed to next step
**Fix**: Fill all required fields (button will enable)

### Issue: Date picker not working
**Fix**: Click the input field, use native picker

### Issue: Premium shows $0
**Fix**: Complete all previous steps first

### Issue: Success page doesn't show
**Fix**: Wait for 3-second processing animation

---

## 📂 File Locations

### Code
```
src/app/mission-protection/page.tsx
src/components/Icons.tsx (MapPin, AlertTriangle, Globe, Info)
src/app/page.tsx (navigation + feature card)
```

### Documentation
```
MISSION_PROTECTION_FEATURE.md         - Full feature docs
MISSION_PROTECTION_VISUAL_GUIDE.md    - UI/UX guide
MISSION_PROTECTION_TESTING.md         - Testing guide
MISSION_PROTECTION_COMPLETE.md        - Summary
MISSION_PROTECTION_QUICK_REFERENCE.md - This file
```

---

## 🔗 Links to Other Features

### From Mission Protection
- **Header Logo** → Home Page
- **Back Button** → Home Page
- **View My Policies** → My Commitments (after purchase)
- **Purchase Another** → Reset to Step 1
- **Back to Home** → Home Page (after purchase)

### To Mission Protection
- **Home Nav** → Mission Protection link
- **Feature Card** → "Get Protected" button

---

## 💻 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

---

## 📊 Data Model

### Form Data Structure
```typescript
{
  destination: "Kenya, East Africa",
  country: "Kenya",
  startDate: "2025-06-01",
  endDate: "2025-06-30",
  coverageAmount: "2000",
  tripPurpose: "Medical Mission",
  organizationName: "Grace Community Church"
}
```

### Generated Policy
```typescript
{
  policyId: "POLICY-1728000000-ABC123XYZ",
  coverage: 2000,
  premium: 170,
  destination: "Kenya",
  duration: 30,
  status: "active"
}
```

---

## 🎯 Next Feature: User Story 2.2

**File Mission Trip Claim**
- Claim submission with evidence
- Church leader verification (2-of-3)
- Automatic payout
- Claim tracking

---

## 📞 Support

### For Bugs
- Check browser console for errors
- Verify wallet is connected
- Ensure all form fields filled
- Try refreshing the page

### For Questions
- See `MISSION_PROTECTION_FEATURE.md` for details
- See `MISSION_PROTECTION_VISUAL_GUIDE.md` for UI specs
- See `MISSION_PROTECTION_TESTING.md` for test cases

---

**Status**: ✅ Ready for Testing & Demo
**Version**: 1.0.0
**Last Updated**: October 4, 2025

🎉 **Feature Complete!** 🎉
