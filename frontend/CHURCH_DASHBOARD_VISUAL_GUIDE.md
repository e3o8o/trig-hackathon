# 🎨 Church Dashboard - Visual Guide

## 📍 Page Location
**URL**: `/church-dashboard`

---

## 🎯 Page Overview

The Church Dashboard is a comprehensive management interface for church administrators to oversee and verify church leaders. It provides statistics, leader management, and invitation capabilities.

---

## 🏗️ Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  📱 Navigation Bar                                   │
│  ← Back to Home                      [Wallet Button]│
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  🏢 Header                                           │
│  Church Dashboard                                    │
│  Manage your church leaders and verify credentials   │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  ⛪ CHURCH INFO CARD                                 │
│  ┌──────────────────┬──────────────────┐            │
│  │ Church Details   │  Statistics Grid │            │
│  │ • Name           │  [4] [125k]      │            │
│  │ • Location       │  [3]  [1]        │            │
│  │ • Denomination   │                  │            │
│  │ • Registered     │                  │            │
│  │ • Church ID      │                  │            │
│  └──────────────────┴──────────────────┘            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│  👥 LEADERS SECTION                                  │
│  Church Leaders              [+ Add Leader] Button   │
│  Manage and verify church leadership                 │
│  ─────────────────────────────────────────────       │
│  [All (4)] [Active (3)] [Pending (1)]               │
│  ─────────────────────────────────────────────       │
│  ┌─────────────────────────────────────────┐        │
│  │ 👤 Pastor Mike Thompson    [Active]     │        │
│  │ Senior Pastor • 1.0 ETH • 45 verifications│      │
│  │ [View Details]                           │        │
│  └─────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────┐        │
│  │ 👤 Elder John Davis        [Active]     │        │
│  │ Elder • 0.1 ETH • 28 verifications      │        │
│  │ [View Details]                           │        │
│  └─────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────┐        │
│  │ 👤 Deacon James Wilson     [Pending]    │        │
│  │ Deacon • 0.05 ETH • 7 verifications     │        │
│  │ [Approve] [View Details]                 │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Components

### 1. Navigation Bar
```
┌─────────────────────────────────────────────┐
│ ← Back to Home          [Connect Wallet]    │
└─────────────────────────────────────────────┘
```
- **Left**: Back navigation link with arrow icon
- **Right**: Wallet connect button
- **Style**: White background, border bottom

### 2. Page Header
```
┌─────────────────────────────────────────────┐
│ 🏢                                           │
│    Church Dashboard                          │
│    Manage your church leaders and verify...  │
└─────────────────────────────────────────────┘
```
- **Icon**: Building icon in indigo gradient box
- **Title**: 4xl, bold, slate-900
- **Subtitle**: Regular, slate-600

### 3. Church Info Card
```
┌────────────────────────────────────────────────┐
│  ⛪ Grace Community Church                     │
│                                                 │
│  Location        Dallas, TX                    │
│  Denomination    Non-denominational            │
│  Registered      2024-08-15                    │
│  Church ID       CHURCH-001                    │
│                                                 │
│  ┌──────────┐  ┌──────────┐                   │
│  │    4     │  │  $125k   │                   │
│  │ Verified │  │  Total   │                   │
│  │ Leaders  │  │  Tithes  │                   │
│  └──────────┘  └──────────┘                   │
│  ┌──────────┐  ┌──────────┐                   │
│  │    3     │  │    1     │                   │
│  │  Active  │  │ Pending  │                   │
│  │ Leaders  │  │          │                   │
│  └──────────┘  └──────────┘                   │
└────────────────────────────────────────────────┘
```
- **Layout**: 2-column grid
- **Left Column**: Church details with labels
- **Right Column**: 2x2 statistics grid
- **Stat Cards**: Gradient backgrounds (indigo, green, purple, amber)

### 4. Leaders Section Header
```
┌────────────────────────────────────────────────┐
│  Church Leaders                  [+ Add Leader]│
│  Manage and verify church leadership           │
└────────────────────────────────────────────────┘
```
- **Title**: 2xl, bold
- **Subtitle**: Regular, slate-600
- **Button**: Indigo background, with UserPlus icon

### 5. Filter Tabs
```
┌────────────────────────────────────────────────┐
│  [All (4)]  [Active (3)]  [Pending (1)]       │
└────────────────────────────────────────────────┘
```
- **Selected**: Colored background (indigo/green/amber)
- **Unselected**: Slate background, hover effect
- **Counts**: Dynamic based on status

### 6. Leader Card
```
┌──────────────────────────────────────────────────┐
│ 👤  Pastor Mike Thompson              [Active]   │
│     Senior Pastor                       🏆        │
│                                                   │
│     Role             Senior Pastor               │
│     Wallet Address   0x742d...0bEb  🔗          │
│     Stake Amount     1.0 ETH                     │
│     Verified At      2024-08-15                  │
│                                                   │
│     🛡️ 45 verifications  ✅ 1.0 ETH staked      │
│                                                   │
│                          [View Details]          │
└──────────────────────────────────────────────────┘
```
- **Avatar**: UserCheck icon (green) or UserPlus (amber)
- **Name**: Large, bold
- **Status Badge**: Rounded pill (green/amber)
- **Role Badge**: Award icon for Senior Pastor
- **Details Grid**: 2x4 responsive grid
- **Actions**: Button on right side
- **Hover**: Border color changes, shadow increases

### 7. Add Leader Modal
```
┌────────────────────────────────────────────┐
│  Add Church Leader                    ✕    │
│                                             │
│  ℹ️ Note: Adding a leader requires them    │
│     to stake ETH as collateral...          │
│                                             │
│  Leader's Wallet Address *                 │
│  [0x...                           ]        │
│                                             │
│  Leader's Full Name *                      │
│  [e.g., John Smith                ]        │
│                                             │
│  Role *                                    │
│  [Elder                    ▼]              │
│                                             │
│  Required Stake Amount (ETH) *             │
│  [0.1 ETH (Elder/Deacon)   ▼]              │
│                                             │
│  The leader will need to stake this        │
│  amount to be verified                     │
│                                             │
│  [Send Invitation]  [Cancel]               │
└────────────────────────────────────────────┘
```
- **Overlay**: Dark backdrop with 50% opacity
- **Modal**: White, rounded-2xl, centered
- **Info Box**: Blue background with border
- **Inputs**: Full width, rounded-xl borders
- **Buttons**: Primary (indigo) and secondary (slate)

---

## 🎨 Color Palette

### Status Colors
- **Active/Success**: Green (green-600, green-100)
- **Pending/Warning**: Amber (amber-600, amber-100)
- **Primary**: Indigo (indigo-600, indigo-100)
- **Secondary**: Purple (purple-600, purple-100)

### Background Gradients
```css
/* Page Background */
bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50

/* Card Gradients */
- Indigo Stat: from-indigo-50 to-blue-50
- Green Stat: from-green-50 to-emerald-50
- Purple Stat: from-purple-50 to-pink-50
- Amber Stat: from-amber-50 to-orange-50
```

### Text Colors
- **Primary Text**: slate-900 (headings)
- **Secondary Text**: slate-600 (descriptions)
- **Tertiary Text**: slate-500 (labels)
- **Link/Interactive**: indigo-600 (hover: indigo-700)

---

## 📱 Responsive Behavior

### Desktop (≥768px)
- Full two-column layout for church info
- 2x2 statistics grid
- Full details visible on leader cards
- Modal centered with max-width

### Tablet (768px - 1024px)
- Slightly compressed grids
- Leader cards stack details
- Modal maintains size

### Mobile (<768px)
- Church info stacks vertically
- Statistics grid: 2x2 maintained
- Leader cards: single column
- Filter tabs remain horizontal with scroll
- Modal takes more screen space

---

## 🎭 States & Interactions

### Leader Card States
1. **Active Leader**
   - Green UserCheck icon
   - Green "Active" badge
   - "View Details" button

2. **Pending Leader**
   - Amber UserPlus icon
   - Amber "Pending" badge
   - "Approve" + "View Details" buttons

3. **Hover State**
   - Border color changes to indigo-200
   - Shadow increases
   - Smooth transition

### Button States
1. **Default**: Solid color
2. **Hover**: Darker shade + shadow
3. **Disabled**: 50% opacity, no pointer
4. **Loading**: Spinner icon replaces content

### Modal States
1. **Closed**: Hidden
2. **Open**: Visible with backdrop
3. **Form Validation**: Disabled submit until fields filled

---

## 🔄 User Flows

### Flow 1: View Leaders
```
Land on page → Connect wallet → View church info → 
Filter leaders → Click leader card → View details
```

### Flow 2: Add New Leader
```
Click "Add Leader" → Modal opens → Fill wallet address → 
Fill name → Select role → Select stake amount → 
Click "Send Invitation" → Leader added to pending list → 
Modal closes
```

### Flow 3: Approve Pending Leader
```
Filter to "Pending" tab → View pending leader → 
Click "Approve" → Transaction initiated → 
Leader moves to active status → Stats update
```

---

## 📊 Data Display

### Church Statistics
```
┌─────────────┐  ┌─────────────┐
│      4      │  │   $125k     │
│  Verified   │  │    Total    │
│   Leaders   │  │   Tithes    │
└─────────────┘  └─────────────┘
┌─────────────┐  ┌─────────────┐
│      3      │  │      1      │
│   Active    │  │   Pending   │
│   Leaders   │  │             │
└─────────────┘  └─────────────┘
```

### Leader Information
```
Name:            Pastor Mike Thompson
Role:            Senior Pastor
Wallet:          0x742d...0bEb
Stake:           1.0 ETH
Verified:        2024-08-15
Verifications:   45 completed
Status:          Active
```

---

## 🎯 Interactive Elements

### Clickable Areas
1. **"Add Leader" Button** → Opens modal
2. **Filter Tabs** → Changes view
3. **"Approve" Button** → Approves pending leader
4. **"View Details" Button** → Shows leader detail page
5. **External Link Icon** → Opens blockchain explorer
6. **Back to Home** → Returns to homepage
7. **Modal Close (X)** → Closes modal
8. **Cancel Button** → Closes modal

### Hover Effects
- Buttons: Background darkens, shadow increases
- Leader cards: Border color changes, shadow grows
- Links: Color changes to darker shade
- Icons: Slight scale or color change

---

## 🎨 Icon Usage

| Icon | Usage | Color |
|------|-------|-------|
| 🏢 Building | Page header | Indigo |
| ⛪ Church | Church name | Indigo |
| 👤 UserCheck | Active leader | Green |
| 👤 UserPlus | Pending leader, Add button | Amber/White |
| 🏆 Award | Senior Pastor badge | Indigo |
| 🛡️ Shield | Verification count | Indigo |
| ✅ CheckCircle | Stake amount | Green |
| 🔗 ExternalLink | Blockchain explorer | Indigo |
| ← ArrowLeft | Back navigation | Slate |

---

## 💡 Design Highlights

### 1. Clear Hierarchy
- Large church info card at top
- Section separation with clear headers
- Consistent card styling

### 2. Status Indicators
- Color-coded badges (green/amber)
- Icon variations (UserCheck/UserPlus)
- Visual feedback for state

### 3. Information Density
- Balanced white space
- Grouped related information
- Progressive disclosure (View Details)

### 4. Action Visibility
- Prominent "Add Leader" button
- Clear call-to-action buttons
- Disabled state when needed

### 5. Consistency
- Matches design system from other pages
- Consistent button styles
- Familiar layout patterns

---

## 🔄 Animation & Transitions

```css
/* Smooth transitions */
transition-colors (200ms)
transition-all (300ms)
transition-transform (200ms)

/* Hover animations */
hover:translate-x-1 (arrows)
hover:shadow-xl (cards)
hover:bg-darker (buttons)

/* Loading states */
animate-spin (spinner)
animate-pulse (indicators)
```

---

## ✨ Best Practices Used

1. **Accessibility**: Clear labels, semantic HTML
2. **Responsiveness**: Mobile-first approach
3. **Performance**: Optimized re-renders
4. **User Feedback**: Loading states, disabled states
5. **Error Handling**: Validation before submission
6. **Visual Hierarchy**: Size, color, spacing
7. **Consistency**: Design system adherence

---

**Status**: ✅ Complete  
**Last Updated**: 2025-10-04  
**Related**: CHURCH_DASHBOARD_FEATURE.md
