# 📸 My Commitments Page - Visual Guide

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Home    My Commitments    View History  [+ New]  [Connect]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ ❤️        │  │ 💵        │  │ 📅        │  │ 📈        │       │
│  │ Total    │  │ Total    │  │ Monthly  │  │ Yearly   │       │
│  │ Commits  │  │ Given    │  │ Commit   │  │ Impact   │       │
│  │   2      │  │ $5,600   │  │ $1,700   │  │ $20,400  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  ⚡ PENDING EXECUTION ALERT                                      │
│  2 payments waiting for confirmation                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🏛️  Grace Community Church                [⏸️] [✏️] [👁️]  │ │
│  │     Dallas, TX                                             │ │
│  │     🟢 Active  ID: TITHE-1728234567890                     │ │
│  │                                                             │ │
│  │  Income: $8,000    Tithe: $800    Offering: $400          │ │
│  │  Total: $1,200/month                                       │ │
│  │                                                             │ │
│  │  Executed: 3 times    Last: Oct 1    Next: Nov 1          │ │
│  │  Total Given: $3,600    Yearly: $14,400                   │ │
│  │                                                             │ │
│  │  [⚡ Execute Tithe Payment Now]                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🏛️  First Baptist Church                 [▶️] [✏️] [👁️]   │ │
│  │     Austin, TX                                             │ │
│  │     🟢 Active  ID: TITHE-1728234567891                     │ │
│  │                                                             │ │
│  │  Income: $5,000    Tithe: $500    Total: $500/biweekly    │ │
│  │  Executed: 4 times    Last: Sep 28    Next: Oct 12        │ │
│  │  Total Given: $2,000    Yearly: $6,000                    │ │
│  │                                                             │ │
│  │  [🔄 Trigger Manual Execution (Demo)]                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Visual States

### 1. Summary Statistics Cards

```
┌────────────────────┐
│  ❤️                 │  ← Icon (color-coded)
│  Total Commitments │  ← Metric label
│        2           │  ← Large number
│  ─────────────────  │
│  2 active          │  ← Sub-text
└────────────────────┘
```

**Color Scheme:**
- Total Commitments: Indigo (❤️)
- Total Given: Green (💵)
- Monthly Commitment: Blue (📅)
- Yearly Impact: Purple (📈)

---

### 2. Active Commitment Card

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────┐  Grace Community Church          [⏸️] [✏️] [👁️]   │
│  │ 🏛️   │  Dallas, TX                                       │
│  │      │  🟢 Active  ID: TITHE-1728234567890               │
│  └──────┘                                                    │
│           ↑ Indigo church icon                               │
│                                                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │ Income & Giving │ │ Execution Hist  │ │ Impact Sum   │  │
│  │                 │ │                 │ │              │  │
│  │ Income: $8,000  │ │ Frequency: Mon  │ │ Given: $3.6K │  │
│  │ Tithe: $800     │ │ Executed: 3x    │ │ Yearly: $14K │  │
│  │ Offering: $400  │ │ Last: Oct 1     │ │ Since: Sep   │  │
│  │ ─────────────── │ │ Next: Nov 1     │ │              │  │
│  │ Total: $1,200   │ │                 │ │              │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         🔄 Trigger Manual Execution (Demo)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                       ↑ Indigo button                        │
└─────────────────────────────────────────────────────────────┘
```

**Border**: Indigo (2px)
**Background**: White
**Hover**: Slight shadow increase

---

### 3. Pending Execution State

```
┌─────────────────────────────────────────────────────────────┐
│  ⚡ PENDING EXECUTION                                         │
│  Income detected! Review and execute your tithe below.       │
│  🕐 Waiting for confirmation                                 │
└─────────────────────────────────────────────────────────────┘
    ↑ Amber background, darker amber border

┌─────────────────────────────────────────────────────────────┐
│  ┌──────┐  Grace Community Church                           │
│  │ 🏛️   │  Dallas, TX                                       │
│  │ AMBER│  🟢 Active                                         │
│  └──────┘                                                    │
│                                                               │
│  [Details same as active...]                                 │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        ⚡ Execute Tithe Payment Now                    │  │
│  └───────────────────────────────────────────────────────┘  │
│            ↑ Amber-to-orange gradient, larger              │
└─────────────────────────────────────────────────────────────┘
    ↑ Amber border (2px), slight glow
```

**Border**: Amber (#FCD34D)
**Background**: White with amber tint
**Button**: Gradient amber → orange

---

### 4. Paused Commitment Card

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────┐  First Baptist Church             [▶️] [✏️] [👁️]  │
│  │ 🏛️   │  Austin, TX                                       │
│  │ GRAY │  ⏸️ Paused  ID: TITHE-...                         │
│  └──────┘                                                    │
│           ↑ Grayed out icon                                  │
│                                                               │
│  [Details grayed out and muted...]                           │
│                                                               │
│  [No execution button shown]                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
    ↑ Gray border, 75% opacity
```

**Border**: Gray (#E2E8F0)
**Opacity**: 75%
**Status Badge**: Gray with ⏸️ icon

---

## Execution Modal Variations

### Confirmation View

```
┌─────────────────────────────────────────┐
│                                           │
│            ┌────────┐                     │
│            │   ⚡   │                     │
│            └────────┘                     │
│                                           │
│      Execute Tithe Payment                │
│                                           │
│  Review the payment details and confirm.  │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  Church: Grace Community Church     │ │
│  │  ────────────────────────────────   │ │
│  │  Tithe Amount:       $800          │ │
│  │  Offering Amount:    $400          │ │
│  │  ────────────────────────────────   │ │
│  │  Total Payment:    $1,200          │ │
│  └─────────────────────────────────────┘ │
│           ↑ Light gray background         │
│                                           │
│  [ Cancel ]    [ Confirm & Execute ]     │
│                      ↑ Indigo button      │
└─────────────────────────────────────────┘
```

**Size**: 500px wide
**Background**: White
**Shadow**: Large (2xl)

---

### Processing View

```
┌─────────────────────────────────────────┐
│                                           │
│            ┌────────┐                     │
│            │   ⌛   │  ← Spinning          │
│            └────────┘                     │
│                                           │
│        Executing Payment...               │
│                                           │
│  Confirming transaction on blockchain...  │
│                                           │
│            [No buttons]                   │
│                                           │
└─────────────────────────────────────────┘
```

**Spinner**: Indigo, animated rotation
**Text**: Muted gray
**No interaction**: Modal can't be closed

---

### Success View

```
┌─────────────────────────────────────────┐
│                                           │
│            ┌────────┐                     │
│            │   ✅   │                     │
│            └────────┘                     │
│         ↑ Green background circle         │
│                                           │
│        Payment Executed!                  │
│                                           │
│  Your tithe has been successfully         │
│  transferred to the church.               │
│                                           │
│       [Auto-closes in 2 seconds]          │
│                                           │
└─────────────────────────────────────────┘
```

**Icon**: Green checkmark (#10B981)
**Text**: Success messaging
**Auto-close**: 2-second timer

---

## Responsive Breakpoints

### Desktop (1920px)

```
┌──────────────────────────────────────────────────────────────┐
│ [Stats: 4 cards in a row]                                    │
│ [Commitment cards: Full width with 3-column grid]            │
└──────────────────────────────────────────────────────────────┘
```

### Tablet (768px)

```
┌───────────────────────────────┐
│ [Stats: 2x2 grid]             │
│ [Commitment cards: 2 columns] │
└───────────────────────────────┘
```

### Mobile (375px)

```
┌──────────────┐
│ [Stats:      │
│  Stack       │
│  Vertically] │
│              │
│ [Cards:      │
│  Single      │
│  Column]     │
└──────────────┘
```

---

## Color Palette

### Primary Colors
- **Indigo**: `#4F46E5` - Active state, primary actions
- **Blue**: `#3B82F6` - Secondary elements
- **Green**: `#10B981` - Success, money amounts
- **Amber**: `#F59E0B` - Warnings, pending actions
- **Purple**: `#9333EA` - Projections, future values

### Neutral Colors
- **Slate 900**: `#0F172A` - Headings
- **Slate 700**: `#334155` - Body text
- **Slate 500**: `#64748B` - Muted text
- **Slate 200**: `#E2E8F0` - Borders
- **Slate 50**: `#F8FAFC` - Backgrounds

### State Colors
- **Active**: Green (#10B981)
- **Paused**: Gray (#64748B)
- **Pending**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

---

## Icon Usage

### Status Icons
- ✅ **CheckCircle**: Active status, success
- ⏸️ **Pause**: Paused status
- ⚡ **Zap**: Pending execution, quick action
- 🕐 **Clock**: Time-related info
- 🔄 **RefreshCw**: Manual trigger

### Action Icons
- ▶️ **Play**: Resume commitment
- ⏸️ **Pause**: Pause commitment
- ✏️ **Edit**: Edit commitment
- 👁️ **Eye**: View details
- 🗑️ **Trash**: Delete (future)

### Content Icons
- 🏛️ **Church**: Church/building
- ❤️ **Heart**: Love, giving, faith
- 💵 **DollarSign**: Money, amounts
- 📅 **Calendar**: Dates, scheduling
- 📈 **TrendingUp**: Growth, projections

---

## Typography

### Headings
- **Page Title**: 2xl (24px), Bold, Slate 900
- **Card Title**: xl (20px), Bold, Slate 900
- **Section Header**: sm (14px), Semibold, Uppercase, Slate 700

### Body Text
- **Primary**: base (16px), Regular, Slate 700
- **Secondary**: sm (14px), Regular, Slate 600
- **Muted**: sm (14px), Regular, Slate 500

### Numbers
- **Large Stats**: 3xl (30px), Bold, Slate 900
- **Amounts**: base (16px), Semibold, Color-coded
- **Totals**: 2xl (24px), Bold, Indigo 600

---

## Spacing

### Card Padding
- **Outer**: 6 (24px)
- **Inner sections**: 4 (16px)
- **Between elements**: 2-3 (8-12px)

### Grid Gaps
- **Stats cards**: 6 (24px)
- **Commitment cards**: 6 (24px)
- **Detail columns**: 6 (24px)

### Button Heights
- **Primary**: 12 (48px)
- **Secondary**: 10 (40px)
- **Icon buttons**: 10 (40px)

---

## Animation & Transitions

### Hover Effects
```css
transition: all 150ms ease-in-out
- Shadow increases
- Background lightens slightly
- Icons may shift (e.g., arrows)
```

### Loading States
```css
Spinner: rotate 360deg in 1s infinite
Pulse: opacity 0.5 → 1.0 in 2s infinite
```

### Modal Animations
```css
Fade in: opacity 0 → 1 in 200ms
Slide up: translateY(10px) → 0 in 200ms
```

---

## Accessibility Features

### Keyboard Navigation
- All buttons are focusable
- Clear focus states (ring-2 ring-indigo-500)
- Tab order follows visual flow

### Screen Readers
- Semantic HTML (header, main, section)
- ARIA labels on icon buttons
- Status announcements on updates

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 ratio for body text
- 3:1 ratio for large text

---

## Empty State

```
┌─────────────────────────────────────────┐
│                                           │
│            ┌────────┐                     │
│            │   ❤️   │                     │
│            └────────┘                     │
│        ↑ Large indigo circle              │
│                                           │
│      No Commitments Yet                   │
│                                           │
│  Start your faithful stewardship journey  │
│  by creating your first tithe commitment. │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │  ❤️  Create First Commitment        │ │
│  └─────────────────────────────────────┘ │
│           ↑ Large indigo button           │
│                                           │
└─────────────────────────────────────────┘
```

---

## Loading State

```
┌─────────────────────────────────────────┐
│                                           │
│                                           │
│              ⌛                            │
│           (spinning)                      │
│                                           │
│                                           │
└─────────────────────────────────────────┘
```

**Spinner**: Indigo, 48px, centered
**Duration**: 1 second simulation

---

## Demo Tips

### What to Highlight
1. **Dashboard Overview**: "Clean, professional interface"
2. **Real-time Calculations**: "Amounts update automatically"
3. **Status Management**: "Can pause/resume anytime"
4. **Execution Flow**: "Smooth 3-step process"
5. **Visual Feedback**: "Clear success confirmations"

### What to Say
- "Notice the summary stats showing $5,600 given"
- "Each card shows complete giving details"
- "This amber alert indicates pending execution"
- "Watch the blockchain confirmation simulation"
- "The history updates automatically"

---

## 🎉 Visual Design Achievements

✅ **Consistent Color System**: All states clearly differentiated  
✅ **Clear Visual Hierarchy**: Easy to scan and understand  
✅ **Responsive Grid Layouts**: Works on all screen sizes  
✅ **Professional Polish**: Gradients, shadows, animations  
✅ **Accessible Design**: High contrast, keyboard nav  
✅ **Intuitive Icons**: Universal symbols for actions  

Perfect for showcasing in the hackathon! 🚀
