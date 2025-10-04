# Mission Protection - Visual Guide & User Flow

## 🎨 Feature Overview

### Color Scheme
- **Primary**: Purple/Pink gradient (`from-purple-500 to-pink-500`)
- **Accents**: Indigo for buttons, Green for success
- **Risk Levels**:
  - 🟢 Low: Green (`text-green-600 bg-green-50`)
  - 🟡 Medium: Yellow (`text-yellow-600 bg-yellow-50`)
  - 🔴 High: Red (`text-red-600 bg-red-50`)

### Icon Usage
- ✈️ `Plane` - Main feature icon, trip representation
- 📍 `MapPin` - Destination selection
- 🌍 `Globe` - International/search
- 📅 `Calendar` - Date selection
- 💰 `DollarSign` - Premium/payment
- 🛡️ `Shield` - Protection/coverage
- ⚠️ `AlertTriangle` - Warnings/notices
- ℹ️ `Info` - Information notices
- ✅ `CheckCircle` - Confirmation/success

---

## 📱 Page Structure

```
┌─────────────────────────────────────────┐
│           HEADER                        │
│  [Logo] Steward        [Wallet Button]  │
└─────────────────────────────────────────┘
│                                         │
│  [← Back to Home]                       │
│                                         │
│         ✈️ Mission Trip Protection      │
│   Protect your mission journey with...  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      PROGRESS INDICATOR                 │
│   ① ──── ② ──── ③ ──── ④              │
│  Dest   Dates   Cover   Review          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         STEP CONTENT                    │
│    [Dynamic based on step]              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🗺️ Step 1: Select Destination

### Layout
```
┌─────────────────────────────────────────┐
│  Select Your Destination                │
│  Choose the country where you'll serve  │
├─────────────────────────────────────────┤
│  🌍 [Search destinations...]            │
├─────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │  Kenya   │ │  Haiti   │ │  India   ││
│  │East Africa│ │Caribbean │ │South Asia││
│  │🟡 Medium │ │🔴 High   │ │🟡 Medium ││
│  │8.0% rate │ │12.0% rate│ │7.0% rate ││
│  └──────────┘ └──────────┘ └──────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ Mexico   │ │Philippines│ │ Brazil   ││
│  │Central Am│ │SE Asia   │ │S America ││
│  │🟢 Low    │ │🟡 Medium │ │🟡 Medium ││
│  │5.0% rate │ │8.0% rate │ │9.0% rate ││
│  └──────────┘ └──────────┘ └──────────┘│
│                             ... (15 total)│
├─────────────────────────────────────────┤
│                    [Continue to Dates →]│
└─────────────────────────────────────────┘
```

### Interaction States
- **Unselected**: White background, slate border
- **Hover**: Indigo border
- **Selected**: Indigo border, indigo background

### Search Behavior
- Real-time filtering as user types
- Searches both country name and region
- Case-insensitive

---

## 📅 Step 2: Trip Dates & Details

### Layout
```
┌─────────────────────────────────────────┐
│  Trip Dates & Details                   │
│  When will you be traveling?            │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ 📍 Kenya - East Africa   🟡 Medium  ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  Start Date          End Date           │
│  📅 [June 1, 2025]  📅 [June 30, 2025] ││
├─────────────────────────────────────────┤
│  ℹ️ Trip Duration: 30 days              │
├─────────────────────────────────────────┤
│  Trip Purpose                           │
│  ▼ [Medical Mission        ]            │
├─────────────────────────────────────────┤
│  Church / Organization Name             │
│  [Grace Community Church    ]           │
├─────────────────────────────────────────┤
│  [← Back]            [Continue to Coverage →]│
└─────────────────────────────────────────┘
```

### Form Validation
- Start date must be today or future
- End date must be after start date
- Duration auto-calculated and displayed
- All fields required

### Trip Purpose Options
```
Medical Mission
Church Planting
Construction/Building
Teaching/Education
Youth Ministry
Disaster Relief
Evangelism
Other Ministry
```

---

## 💰 Step 3: Choose Coverage

### Layout
```
┌─────────────────────────────────────────┐
│  Choose Coverage Amount                 │
│  Select the protection level...         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ $1,000 - Basic Protection   $1,000  ││
│  │ Premium: $52                        ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ $2,000 - Standard Protection $2,000 ││
│  │ Premium: $170                       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ $3,000 - Enhanced Protection $3,000 ││
│  │ Premium: $255                       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ $5,000 - Premium Protection  $5,000 ││
│  │ Premium: $425                       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ $10,000 - Maximum Protection $10,000││
│  │ Premium: $850                       ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  🛡️ What's Covered                      │
│  ✅ Trip cancellation (political/disaster)│
│  ✅ Flight delays exceeding 6 hours     │
│  ✅ Medical evacuation coverage         │
│  ✅ Emergency travel home               │
│  ✅ Lost or stolen passport/documents   │
├─────────────────────────────────────────┤
│  [← Back]              [Review Policy →]│
└─────────────────────────────────────────┘
```

### Premium Calculation Display
- Real-time calculation for each option
- Shows both coverage and premium
- Premium formatted with commas ($1,234)
- Coverage in large, bold font

---

## 📋 Step 4: Review & Confirm

### Layout
```
┌─────────────────────────────────────────┐
│  Review Your Policy                     │
│  Please review your mission trip...     │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ ✈️ Trip Details                     ││
│  │                                     ││
│  │ Destination: Kenya, East Africa     ││
│  │ Risk Level: 🟡 Medium Risk          ││
│  │ Start Date: June 1, 2025            ││
│  │ End Date: June 30, 2025             ││
│  │ Duration: 30 days                   ││
│  │ Purpose: Medical Mission            ││
│  │ Organization: Grace Community Church││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ 🛡️ Coverage Summary                 ││
│  │                                     ││
│  │ Coverage Amount:         $2,000     ││
│  │ Premium Payment:          $170      ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ ⚠️ Important Information            ││
│  │ • Policy active immediately         ││
│  │ • Claims require 2 of 3 verifications││
│  │ • Automatic payout within 24 hours  ││
│  │ • Premium backed by DeFi capital    ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ ℹ️ Powered by Blockchain            ││
│  │ Your policy is recorded on the      ││
│  │ blockchain for transparency...      ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  [← Back]    [💰 Pay $170 & Purchase Policy]│
└─────────────────────────────────────────┘
```

### Processing State
```
┌─────────────────────────────────────────┐
│  [← Back (disabled)]                    │
│                                         │
│  [⏳ Processing Payment... (disabled)]  │
└─────────────────────────────────────────┘
```

---

## 🎉 Step 5: Success

### Layout
```
┌─────────────────────────────────────────┐
│              ✅                          │
│                                         │
│    Protection Activated! 🎉             │
│                                         │
│  Your mission trip is now protected...  │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │     Policy ID                       ││
│  │  POLICY-1717200000-KEF92JK3L        ││
│  │                                     ││
│  │  Coverage      Premium Paid         ││
│  │   $2,000         $170               ││
│  │                                     ││
│  │  Destination    Duration            ││
│  │   Kenya          30 days            ││
│  └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│  What's Next?                           │
│  ✅ Policy active and blockchain-recorded│
│  ✅ File claim with evidence if needed  │
│  ✅ Church leaders verify claims        │
│  ✅ Automatic payout within 24 hours    │
├─────────────────────────────────────────┤
│  [View My Policies]                     │
│  [Purchase Another Policy]              │
│  [Back to Home]                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Key User Interactions

### Destination Selection
1. User sees grid of destinations
2. User can search/filter
3. Click card to select (visual feedback)
4. "Continue" button enabled
5. Click continue to next step

### Date & Details
1. Click start date → calendar opens
2. Select date (must be future)
3. Click end date → calendar opens
4. Select date (must be after start)
5. Duration auto-calculates
6. Select purpose from dropdown
7. Enter organization name
8. "Continue" enabled when all filled

### Coverage Selection
1. See all options with premiums
2. Click option to select
3. Review what's covered
4. Click "Review Policy"

### Review & Purchase
1. Review all details
2. Read important notices
3. Click "Pay & Purchase"
4. See processing spinner
5. Redirected to success

### Success Actions
1. Note policy ID
2. Click "View My Policies" → My Commitments page
3. Or "Purchase Another" → restart flow
4. Or "Back to Home" → home page

---

## 📊 Data Flow

```
User Input → Form State → Calculation → Display
─────────────────────────────────────────────

Destination Selection:
  Select Country → formData.country
                → formData.destination
                → Risk Level Display

Date Selection:
  Start Date → formData.startDate
  End Date   → formData.endDate
             → Calculate Duration (derived state)
             → Adjust Premium Calculation

Details Input:
  Purpose      → formData.tripPurpose
  Organization → formData.organizationName

Coverage Selection:
  Amount → formData.coverageAmount
        → Calculate Premium (derived state)
        → Display in Review

Purchase:
  All Data → Blockchain Transaction (simulated)
          → Generate Policy ID
          → Display Confirmation
```

---

## 🎨 Design Tokens

### Colors
```css
/* Primary */
--purple-500: #a855f7
--pink-500: #ec4899

/* Risk Levels */
--green-50: #f0fdf4
--green-600: #16a34a
--yellow-50: #fefce8
--yellow-600: #ca8a04
--red-50: #fef2f2
--red-600: #dc2626

/* Neutrals */
--slate-50: #f8fafc
--slate-600: #475569
--slate-900: #0f172a

/* Interactive */
--indigo-50: #eef2ff
--indigo-600: #4f46e5
--indigo-700: #4338ca
```

### Typography
```css
/* Headings */
h1: 2.25rem (36px), font-bold
h2: 1.5rem (24px), font-bold
h3: 1.125rem (18px), font-semibold

/* Body */
p: 1rem (16px), regular
small: 0.875rem (14px), regular

/* Labels */
label: 0.875rem (14px), font-medium
```

### Spacing
```css
/* Container */
max-width: 80rem (1280px)
padding: 1rem (16px) mobile, 2rem (32px) desktop

/* Cards */
padding: 2rem (32px)
border-radius: 1rem (16px)
gap: 1.5rem (24px)
```

---

## 🔄 State Management

### Form State
```typescript
const [step, setStep] = useState<'destination' | 'dates' | 'coverage' | 'review' | 'success'>('destination')

const [formData, setFormData] = useState<ProtectionFormData>({
  destination: '',
  country: '',
  startDate: '',
  endDate: '',
  coverageAmount: '',
  tripPurpose: '',
  organizationName: ''
})

const [policyId, setPolicyId] = useState<string>('')
const [isProcessing, setIsProcessing] = useState(false)
const [searchTerm, setSearchTerm] = useState('')
```

### Derived State
```typescript
const premium = calculatePremium()  // Based on coverage, country, duration
const coverage = parseFloat(formData.coverageAmount || '0')
const selectedDestination = DESTINATIONS.find(d => d.country === formData.country)
const tripDuration = getTripDuration()  // Calculate from dates
```

---

## ✅ Validation Rules

### Step 1 (Destination)
- Must select a country
- Button disabled until selection made

### Step 2 (Dates & Details)
- Start date ≥ today
- End date > start date
- Trip purpose required
- Organization name required
- All fields required to proceed

### Step 3 (Coverage)
- Must select a coverage amount
- Button disabled until selection made

### Step 4 (Review)
- All previous validations must pass
- Can go back to edit any step
- Purchase button shows premium amount

---

## 🚀 Performance Considerations

### Optimizations
- ✅ Filter destinations client-side (fast)
- ✅ Calculate premium on-demand (memoizable)
- ✅ Minimize re-renders with proper state management
- ✅ Use controlled components for forms

### Loading States
- Search: Instant filtering (no spinner needed)
- Date selection: Native browser picker
- Purchase: 3-second simulated transaction with spinner

---

This visual guide provides a complete reference for the Mission Protection feature's UI/UX design and user interactions! 🎨✨
