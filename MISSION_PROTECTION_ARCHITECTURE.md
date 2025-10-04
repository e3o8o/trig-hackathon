# Mission Protection - Architecture Diagram

## 🏗️ Complete Feature Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MISSION PROTECTION                          │
│                    /mission-protection Route                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Header     │          │   Wallet     │          │  Navigation  │
│              │          │ Integration  │          │    Links     │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ • Logo       │          │ • useAccount │          │ • Back Home  │
│ • Wallet Btn │          │ • isConnected│          │ • To My Acct │
└──────────────┘          │ • address    │          │ • Purchase + │
                          └──────────────┘          └──────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │ WalletConnectionCheck     │
                    │ • Enforces connection     │
                    │ • Shows prompt if needed  │
                    └───────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │   Progress Indicator      │
                    │ ① ──── ② ──── ③ ──── ④  │
                    │ Dest   Dates  Cover  Review│
                    └───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   STEP 1     │          │   STEP 2     │          │   STEP 3     │
│ Destination  │──Next──▶ │    Dates     │──Next──▶ │   Coverage   │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ • Search     │◀─Back──  │ • Start Date │◀─Back──  │ • $1K-$10K   │
│ • 15 Options │          │ • End Date   │          │ • Premiums   │
│ • Risk Level │          │ • Purpose    │          │ • Benefits   │
│ • Base Rate  │          │ • Org Name   │          │ • Real-time  │
└──────────────┘          └──────────────┘          └──────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────┐
                                                    │   STEP 4     │
                                                    │    Review    │
                                                    ├──────────────┤
                                                    │ • Summary    │◀─Back──
                                                    │ • Terms      │
                                                    │ • Purchase   │
                                                    └──────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────┐
                                                    │  Processing  │
                                                    ├──────────────┤
                                                    │ • Spinner    │
                                                    │ • 3 seconds  │
                                                    │ • Simulate   │
                                                    └──────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────┐
                                                    │   STEP 5     │
                                                    │   Success    │
                                                    ├──────────────┤
                                                    │ • Policy ID  │
                                                    │ • Details    │
                                                    │ • Next Steps │
                                                    │ • Actions    │
                                                    └──────────────┘
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INPUTS                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ Destination  │          │     Dates    │          │   Coverage   │
│   Selection  │          │   & Details  │          │   Selection  │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ country      │──┐       │ startDate    │──┐       │ coverageAmt  │──┐
│ destination  │  │       │ endDate      │  │       │              │  │
│              │  │       │ tripPurpose  │  │       │              │  │
│              │  │       │ orgName      │  │       │              │  │
└──────────────┘  │       └──────────────┘  │       └──────────────┘  │
                  │                         │                         │
                  └─────────────┬───────────┘                         │
                                │                                     │
                                ▼                                     │
                    ┌───────────────────────────┐                    │
                    │    formData State         │◀───────────────────┘
                    │  (Complete Form Object)   │
                    └───────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
    ┌───────────────────┐           ┌───────────────────┐
    │ Derived State     │           │  Validation       │
    ├───────────────────┤           ├───────────────────┤
    │ • tripDuration    │           │ • Date logic      │
    │ • premium         │           │ • Required fields │
    │ • selectedDest    │           │ • Step complete   │
    │ • coverage        │           │ • Can proceed     │
    └───────────────────┘           └───────────────────┘
                │                               │
                └───────────────┬───────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │     Display Logic         │
                    │ • Show current step       │
                    │ • Update progress         │
                    │ • Enable/disable buttons  │
                    └───────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │    Purchase Action        │
                    │ • Simulate transaction    │
                    │ • Generate policy ID      │
                    │ • Set success state       │
                    └───────────────────────────┘
```

---

## 💾 State Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                       COMPONENT STATE                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ Navigation   │          │  Form Data   │          │   UI State   │
│    State     │          │    State     │          │    State     │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ step         │          │ destination  │          │ policyId     │
│ • destination│          │ country      │          │ isProcessing │
│ • dates      │          │ startDate    │          │ searchTerm   │
│ • coverage   │          │ endDate      │          │              │
│ • review     │          │ coverageAmt  │          │              │
│ • success    │          │ tripPurpose  │          │              │
│              │          │ orgName      │          │              │
└──────────────┘          └──────────────┘          └──────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │   Derived Calculations    │
                    ├───────────────────────────┤
                    │ premium = calculate()     │
                    │ duration = getDuration()  │
                    │ dest = getDestination()   │
                    └───────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
MissionProtection (Main Page)
│
├── Header
│   ├── Logo Link (→ Home)
│   └── WalletConnectButton
│
├── BackButton (→ Home)
│
├── Title Section
│   ├── Plane Icon
│   ├── h1 Title
│   └── Description
│
└── WalletConnectionCheck
    │
    ├── Progress Indicator
    │   ├── Step 1 Badge
    │   ├── Step 2 Badge
    │   ├── Step 3 Badge
    │   └── Step 4 Badge
    │
    └── Step Content (Conditional Render)
        │
        ├── Step 1: Destination
        │   ├── Search Input
        │   └── Destination Grid
        │       └── Destination Cards (×15)
        │
        ├── Step 2: Dates & Details
        │   ├── Destination Summary
        │   ├── Date Inputs
        │   ├── Duration Display
        │   ├── Purpose Select
        │   └── Organization Input
        │
        ├── Step 3: Coverage
        │   ├── Coverage Options (×5)
        │   └── What's Covered List
        │
        ├── Step 4: Review
        │   ├── Trip Details Card
        │   ├── Coverage Summary Card
        │   ├── Important Info Card
        │   └── Blockchain Info Card
        │
        └── Step 5: Success
            ├── Success Icon
            ├── Policy Details Card
            ├── What's Next Section
            └── Action Buttons
```

---

## 🔌 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MISSION PROTECTION FEATURE                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Existing   │          │   Current    │          │    Future    │
│ Integrations │          │ Dependencies │          │ Integrations │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ • Wallet     │          │ • wagmi      │          │ • Smart      │
│ • Navigation │          │ • React      │          │   Contracts  │
│ • Icons      │          │ • Next.js    │          │ • Backend    │
│ • Design Sys │          │ • TypeScript │          │ • DeFi Pool  │
└──────────────┘          └──────────────┘          └──────────────┘
```

---

## 📊 Premium Calculation Flow

```
User Inputs
│
├─ Coverage Amount ($1K-$10K)
├─ Destination (Risk Rate: 5%-12%)
└─ Trip Duration (Days)
        │
        ▼
┌─────────────────────────────────┐
│   calculatePremium()            │
├─────────────────────────────────┤
│ 1. Get destination risk rate   │
│ 2. Calculate duration multiplier│
│    = 1 + (days/365) × 0.5      │
│ 3. Base = coverage × rate       │
│ 4. Premium = base × multiplier  │
│ 5. Round to integer             │
└─────────────────────────────────┘
        │
        ▼
Display Premium in UI
• Coverage Selection (×5 options)
• Review Summary (large display)
• Purchase Button (amount shown)
```

---

## 🛣️ User Journey Map

```
Entry Point
│
├─ Home Navigation Link
└─ Feature Card CTA Button
        │
        ▼
┌───────────────┐
│ Connect Wallet│ ←──── Wallet Required Gate
└───────────────┘
        │
        ▼
┌───────────────┐
│ Select Country│ ←──── Search/Browse 15 Options
└───────────────┘
        │
        ▼
┌───────────────┐
│  Enter Dates  │ ←──── Calendar Pickers + Validation
└───────────────┘
        │
        ▼
┌───────────────┐
│Add Trip Details│ ←──── Purpose + Organization
└───────────────┘
        │
        ▼
┌───────────────┐
│Pick Coverage  │ ←──── See Premiums for Each Option
└───────────────┘
        │
        ▼
┌───────────────┐
│ Review Policy │ ←──── Complete Summary + Terms
└───────────────┘
        │
        ▼
┌───────────────┐
│   Purchase    │ ←──── Pay Premium (Simulated)
└───────────────┘
        │
        ▼
┌───────────────┐
│    Success    │ ←──── Policy ID + Confirmation
└───────────────┘
        │
        ├─ View My Policies
        ├─ Purchase Another
        └─ Back to Home
```

---

## 🎯 File Structure

```
frontend/
│
├── src/
│   ├── app/
│   │   ├── mission-protection/
│   │   │   └── page.tsx ──────────────── Main Feature (750 lines)
│   │   └── page.tsx ──────────────────── Updated with nav link
│   │
│   └── components/
│       └── Icons.tsx ─────────────────── Added 4 new icons
│
└── Documentation/
    ├── MISSION_PROTECTION_FEATURE.md ───── Complete docs (400 lines)
    ├── MISSION_PROTECTION_VISUAL_GUIDE.md ─ UI guide (500 lines)
    ├── MISSION_PROTECTION_TESTING.md ───── Test guide (300 lines)
    ├── MISSION_PROTECTION_COMPLETE.md ──── Summary (450 lines)
    ├── MISSION_PROTECTION_QUICK_REFERENCE.md Quick ref (200 lines)
    ├── MISSION_PROTECTION_SUMMARY.md ───── Executive (350 lines)
    └── MISSION_PROTECTION_ARCHITECTURE.md ── This file
```

---

## 🔐 Security Considerations

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Frontend   │          │   Validation │          │   Future     │
│   Security   │          │   Security   │          │   Security   │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ • Wallet req │          │ • Date logic │          │ • Smart      │
│ • Client     │          │ • Required   │          │   contract   │
│   validation │          │   fields     │          │ • Payment    │
│ • Input      │          │ • Step order │          │   security   │
│   sanitize   │          │ • Min/max    │          │ • On-chain   │
└──────────────┘          └──────────────┘          └──────────────┘
```

---

## 📈 Performance Optimization

```
Current Optimizations:
├─ Client-side filtering (instant search)
├─ Memoized calculations (avoid re-calc)
├─ Controlled components (efficient updates)
├─ Conditional rendering (only active step)
└─ Optimized re-renders (proper state structure)

Future Optimizations:
├─ Code splitting (lazy load steps)
├─ Image optimization (destination photos)
├─ Caching (destination data)
├─ API debouncing (if backend added)
└─ Service worker (offline support)
```

---

## ✅ Quality Checklist

```
Code Quality:        ✅ TypeScript, ✅ No errors, ✅ Clean code
User Experience:     ✅ Intuitive, ✅ Fast, ✅ Responsive
Visual Design:       ✅ Professional, ✅ Consistent, ✅ Polished
Documentation:       ✅ Complete, ✅ Detailed, ✅ Up-to-date
Testing:             ✅ Manual tested, 🔜 Integration tests
Accessibility:       ✅ Semantic HTML, 🔜 ARIA labels
Performance:         ✅ Fast load, ✅ Smooth interactions
Security:            ✅ Validation, 🔜 Contract integration
```

---

This architecture diagram provides a complete visual reference for understanding how the Mission Protection feature is structured and how all pieces fit together! 🏗️
