# 📊 Giving History - Visual Design Guide

## Page Overview
Complete transaction history viewer with filtering, charts, and export capabilities.

---

## 🎨 Layout Structure

### Desktop View (1024px+)
```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Giving History                [📊][📥 CSV][📄 Receipt]  │
│ Complete record of your faithful stewardship                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │💰 Total  │ │🏛️ Tithes │ │💜 Offer  │ │⛪ Church │      │
│  │ $14,400  │ │  $9,600  │ │ $4,800   │ │    2     │      │
│  │ 12 trans │ │  67% of  │ │  33% of  │ │ Total    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Filters                                          [Hide]   │
│  ┌────────┐ ┌─────────┐ ┌──────────────┐ ┌───────────┐   │
│  │ Year ▼ │ │ Month ▼ │ │  Church ▼    │ │ 🔍 Search │   │
│  │  2024  │ │   All   │ │  All Churches│ │           │   │
│  └────────┘ └─────────┘ └──────────────┘ └───────────┘   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🏛️ Grace Community Church          [Completed]   $1,200│ │
│  │ December 1, 2024                                       ∨│ │
│  │ Tithe: $800 | Offering: $400                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🏛️ Grace Community Church          [Completed]   $1,200│ │
│  │ November 1, 2024                                       ∧│ │
│  │ Tithe: $800 | Offering: $400                           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │ Church Details:                  Blockchain Proof:     │ │
│  │ 123 Faith St, Dallas, TX         0x1234...cdef        │ │
│  │                                   [View on Explorer →] │ │
│  │ Income Details:                   Tax Receipt:         │ │
│  │ Income: $8,000                    [Download Receipt]   │ │
│  │ Tithe: 10% = $800                                      │ │
│  │ Offering: 5% = $400                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ 📈 Yearly Summary                                            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 2024                                  [View Details →] │ │
│  │ Total: $14,400 │ Tithe: $9,600 │ Offering: $4,800    │ │
│  │ Transactions: 12 │ Churches: 2                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View (375px)
```
┌─────────────────────────┐
│ 📊 Giving History      │
│                         │
│ [📊] [📥] [📄]         │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ 💰 Total Given      │ │
│ │ $14,400             │ │
│ │ 12 transactions     │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🏛️ Tithes          │ │
│ │ $9,600              │ │
│ │ 67% of total        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 💜 Offerings        │ │
│ │ $4,800              │ │
│ │ 33% of total        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ⛪ Churches         │ │
│ │ 2                   │ │
│ │ Total recipients    │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 🔍 Filters     [Show]  │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ 🏛️ Grace Community │ │
│ │ Dec 1, 2024  $1,200 │ │
│ │ [Completed]       ∨ │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## 🎨 Component Designs

### 1. Header Section
```
┌───────────────────────────────────────────────────┐
│ 📊 Giving History              [Icons] [Buttons] │
│ Complete record of your faithful stewardship      │
└───────────────────────────────────────────────────┘

Actions:
• [📊 Charts] - Toggle to chart view
• [📥 CSV] - Export as CSV
• [📄 Tax Receipt] - Generate PDF
```

**Spacing**: 
- py-8 container padding
- gap-3 between action buttons
- mb-8 below header

**Typography**:
- Title: text-3xl font-bold text-gray-900
- Subtitle: text-gray-600 mt-1

---

### 2. Summary Cards

#### Card Structure
```
┌────────────────────────┐
│ [Icon] Label      │
│                        │
│   $14,400             │
│   12 transactions     │
└────────────────────────┘
```

**Grid Layout**:
- Desktop: `grid-cols-4`
- Tablet: `grid-cols-2`
- Mobile: `grid-cols-1`
- Gap: `gap-6`

**Card Styling**:
```css
bg-white
rounded-xl
p-6
shadow-sm
border border-gray-200
```

**Icon Sizes & Colors**:
- Total Given: DollarSign, w-5 h-5, text-green-600
- Tithes: Church, w-5 h-5, text-indigo-600
- Offerings: Heart, w-5 h-5, text-purple-600
- Churches: Church, w-5 h-5, text-amber-600

**Typography**:
- Label: text-sm font-medium text-gray-600
- Amount: text-3xl font-bold text-gray-900
- Subtext: text-sm text-gray-500 mt-1

---

### 3. Filters Section

#### Collapsed State
```
┌───────────────────────────────────┐
│ 🔍 Filters            [Hide]     │
└───────────────────────────────────┘
```

#### Expanded State
```
┌─────────────────────────────────────────────────┐
│ 🔍 Filters                         [Hide]      │
├─────────────────────────────────────────────────┤
│ Year         Month        Church      Search   │
│ ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐ │
│ │2024 ▼│    │All  ▼│    │All  ▼│    │🔍    │ │
│ └──────┘    └──────┘    └──────┘    └──────┘ │
└─────────────────────────────────────────────────┘
```

**Grid**: `grid-cols-1 md:grid-cols-4 gap-4`

**Input Styling**:
```css
px-3 py-2
border border-gray-300
rounded-lg
focus:ring-2 focus:ring-indigo-500
focus:border-transparent
```

**Labels**:
```css
text-sm font-medium text-gray-700 mb-2
```

---

### 4. Chart View

#### Monthly Bar Chart
```
Jan  ████████████████████████████████ $1,200
Feb  ████████████████████████████████ $1,200
Mar  ████████████████████████████████ $1,200
Apr  
May  ████████████████████████ $1,000
Jun  ████████████████████████████████ $1,200
Jul  ██████████████████ $800
Aug  ██████████████████ $800
Sep  ████████████████████████████████ $1,200
Oct  ████████████████████████████████ $1,200
Nov  ████████████████████████████████ $1,200
Dec  ████████████████████████████████ $1,200

Legend: ■ Tithe  ■ Offering
```

**Bar Styling**:
```css
// Container
w-full bg-gray-200 rounded-full h-8

// Filled portion
bg-gradient-to-r from-indigo-500 to-purple-500
h-full rounded-full
transition-all duration-500
```

**Labels**:
- Month: text-sm font-medium text-gray-700
- Amount: text-sm font-semibold text-gray-900

---

### 5. Transaction Card (Collapsed)

```
┌───────────────────────────────────────────────────┐
│ 🏛️ Grace Community Church        [Completed]     │
│ December 1, 2024                           $1,200 │
│ Tithe: $800 | Offering: $400                    ∨│
└───────────────────────────────────────────────────┘
```

**Layout**:
```css
bg-white
rounded-xl
p-6
shadow-sm border border-gray-200
hover:shadow-md
cursor-pointer
```

**Header**:
- Church icon + name: text-lg font-semibold
- Status badge: bg-green-100 text-green-700 text-xs

**Content**:
- Date: text-sm text-gray-600
- Amounts: Inline, gap-6
- Total: text-2xl font-bold text-gray-900

**Chevron**: text-indigo-600 hover:text-indigo-700

---

### 6. Transaction Card (Expanded)

```
┌───────────────────────────────────────────────────┐
│ 🏛️ Grace Community Church        [Completed]     │
│ December 1, 2024                           $1,200 │
│ Tithe: $800 | Offering: $400                    ∧│
├───────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌─────────────────────┐ │
│ │ Church Details      │ │ Blockchain Proof    │ │
│ │ 123 Faith St,       │ │ 0x1234...cdef       │ │
│ │ Dallas, TX          │ │ [View →]            │ │
│ │                     │ │                     │ │
│ │ Income Details      │ │ Tax Receipt         │ │
│ │ Income: $8,000      │ │ [Download Receipt]  │ │
│ │ Tithe: 10% = $800   │ │                     │ │
│ │ Offering: 5% = $400 │ │                     │ │
│ └─────────────────────┘ └─────────────────────┘ │
└───────────────────────────────────────────────────┘
```

**Expanded Section**:
```css
px-6 pb-6 pt-0
border-t border-gray-100
mt-6
```

**Grid**: `grid-cols-1 md:grid-cols-2 gap-6`

**Section Headers**:
```css
text-sm font-semibold text-gray-700 mb-2
```

**Details Text**:
```css
text-sm text-gray-600
```

**Blockchain Proof Box**:
```css
p-3
bg-gray-50
rounded-lg
flex items-center gap-2
```

**TX Hash**:
```css
text-xs text-gray-600 font-mono
```

**Action Buttons**:
```css
px-4 py-2
bg-indigo-50 text-indigo-700
rounded-lg
hover:bg-indigo-100
text-sm font-medium
```

---

### 7. Yearly Summary Card

```
┌─────────────────────────────────────────────────┐
│ 2024                          [View Details →] │
├─────────────────────────────────────────────────┤
│ Total: $14,400 │ Tithe: $9,600 │ Offering: ... │
│ Transactions: 12 │ Churches: 2                  │
└─────────────────────────────────────────────────┘
```

**Selected Year Styling**:
```css
border-2 border-indigo-500
bg-indigo-50
```

**Default Styling**:
```css
border-2 border-gray-200
bg-gray-50
```

**Metrics Grid**: `grid-cols-2 md:grid-cols-5 gap-4`

**Metric Display**:
- Label: text-xs text-gray-600 mb-1
- Value: text-lg font-bold (color varies)
  - Total: text-gray-900
  - Tithe: text-green-600
  - Offering: text-purple-600

---

## 🎨 Color Palette

### Semantic Colors
```css
/* Primary Actions */
--indigo-600: #4F46E5  /* Buttons, links */
--indigo-700: #4338CA  /* Hover states */
--indigo-50:  #EEF2FF  /* Backgrounds */

/* Success / Money */
--green-600: #16A34A   /* Amounts, success */
--green-100: #DCFCE7   /* Status badges */
--green-700: #15803D   /* Badge text */

/* Secondary / Offerings */
--purple-600: #9333EA  /* Offerings */
--purple-500: #A855F7  /* Charts */

/* Warning / Attention */
--amber-600: #D97706   /* Church metrics */

/* Neutral */
--gray-900: #111827    /* Headings */
--gray-700: #374151    /* Body text */
--gray-600: #4B5563    /* Secondary text */
--gray-500: #6B7280    /* Muted text */
--gray-400: #9CA3AF    /* Icons */
--gray-200: #E5E7EB    /* Borders */
--gray-100: #F3F4F6    /* Backgrounds */
--gray-50:  #F9FAFB    /* Surface */

/* White */
--white: #FFFFFF       /* Cards */
```

---

## 📱 Responsive Breakpoints

### Mobile First (320px+)
- Single column layout
- Stacked summary cards
- Full-width filters
- Simplified transaction cards
- Hide filters by default

### Tablet (768px+)
- 2-column summary cards
- 2-column filter grid
- Side-by-side expanded details

### Desktop (1024px+)
- 4-column summary cards
- 4-column filter grid
- Full horizontal layout
- Expanded transaction details

### Large Desktop (1280px+)
- Max-width container (7xl)
- Comfortable padding
- Optimal line length

---

## ✨ Animations & Transitions

### Card Expansion
```css
transition: all 300ms ease-in-out
```

### Hover Effects
```css
transition: shadow 200ms ease
hover:shadow-md
```

### Bar Chart Animation
```css
transition: width 500ms ease-in-out
```

### Button Hover
```css
transition: all 150ms ease
hover:bg-indigo-700
```

### Loading States
```css
animate-pulse /* For skeleton screens */
animate-spin  /* For spinner icons */
```

---

## 🎯 Interactive States

### Buttons
- **Default**: bg-indigo-600 text-white
- **Hover**: bg-indigo-700 shadow-lg
- **Active**: bg-indigo-800
- **Disabled**: bg-gray-300 cursor-not-allowed

### Cards
- **Default**: shadow-sm border-gray-200
- **Hover**: shadow-md
- **Expanded**: border-t divider
- **Selected**: border-indigo-500 bg-indigo-50

### Inputs
- **Default**: border-gray-300
- **Focus**: ring-2 ring-indigo-500 border-transparent
- **Error**: border-red-500 ring-red-500
- **Disabled**: bg-gray-100 cursor-not-allowed

---

## 📊 Iconography

### Icon Usage
| Icon | Purpose | Color | Size |
|------|---------|-------|------|
| 💰 DollarSign | Money, totals | green-600 | w-5 h-5 |
| 🏛️ Church | Churches, tithes | indigo-600 | w-5 h-5 |
| 💜 Heart | Offerings, love | purple-600 | w-5 h-5 |
| 📊 BarChart3 | Analytics, charts | gray-600 | w-5 h-5 |
| 📥 Download | Export actions | gray-600 | w-5 h-5 |
| 📄 FileText | Documents | gray-600 | w-5 h-5 |
| 🔍 Search | Search input | gray-400 | w-5 h-5 |
| 🔗 ExternalLink | Blockchain links | indigo-600 | w-4 h-4 |
| ✅ CheckCircle | Success states | green-500 | w-5 h-5 |
| 📆 Calendar | Dates | gray-600 | w-5 h-5 |
| 🔼 ChevronUp | Collapse | indigo-600 | w-5 h-5 |
| 🔽 ChevronDown | Expand | indigo-600 | w-5 h-5 |
| 📈 TrendingUp | Growth, stats | gray-600 | w-5 h-5 |

---

## 🎭 Empty States

### No Transactions
```
┌─────────────────────────────────┐
│         📄 (large icon)         │
│                                 │
│  No Transactions Found          │
│  Try adjusting your filters     │
└─────────────────────────────────┘
```

**Styling**:
```css
text-center
p-12
bg-white rounded-xl
border border-gray-200
```

**Icon**: w-16 h-16 text-gray-400
**Title**: text-lg font-semibold text-gray-900
**Subtitle**: text-gray-600

---

## 🎨 Design Principles

1. **Clarity**: Large, readable typography
2. **Hierarchy**: Clear visual importance
3. **Consistency**: Reusable components
4. **Feedback**: Interactive states
5. **Accessibility**: Semantic HTML, ARIA labels
6. **Performance**: Smooth animations
7. **Responsiveness**: Mobile-first design
8. **Scanability**: Easy to browse quickly

---

## 📏 Spacing System

```css
/* Tailwind Spacing Scale */
gap-2  → 0.5rem (8px)   /* Tight spacing */
gap-3  → 0.75rem (12px)  /* Button groups */
gap-4  → 1rem (16px)     /* Card content */
gap-6  → 1.5rem (24px)   /* Grid gaps */
gap-8  → 2rem (32px)     /* Section spacing */

p-3    → 0.75rem        /* Compact padding */
p-4    → 1rem           /* Medium padding */
p-6    → 1.5rem         /* Card padding */
p-8    → 2rem           /* Large padding */

py-8   → 2rem vertical  /* Section padding */
py-12  → 3rem vertical  /* Major sections */
```

---

## 🎨 Typography Scale

```css
/* Headings */
text-3xl → 1.875rem (30px) /* Page title */
text-2xl → 1.5rem (24px)   /* Card amounts */
text-xl  → 1.25rem (20px)  /* Subtitles */
text-lg  → 1.125rem (18px) /* Church names */

/* Body */
text-base → 1rem (16px)    /* Body text */
text-sm   → 0.875rem (14px) /* Labels */
text-xs   → 0.75rem (12px)  /* Meta info */
```

---

## 🔍 Accessibility

### Semantic HTML
```html
<main> - Page wrapper
<section> - Major sections
<article> - Transaction cards
<button> - Interactive elements
<nav> - Filter controls
```

### ARIA Labels
```html
aria-label="Export transactions as CSV"
aria-expanded="true"
role="button"
tabindex="0"
```

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for dropdown navigation
- Escape to close expanded cards

### Focus States
```css
focus:ring-2 focus:ring-indigo-500
focus:outline-none
```

---

## 📚 Related Files
- `GIVING_HISTORY_FEATURE.md` - Technical documentation
- `src/app/giving-history/page.tsx` - Component implementation
- `src/components/Icons.tsx` - Icon components
