# Church Selection - Visual Guide

## 🎨 New UI Elements

### Step 2: Organization Selection (Enhanced)

```
┌─────────────────────────────────────────────────────────────┐
│  Church / Organization                                      │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────┐  ┌────────────────────────┐
│        🏛️              │  │        👥              │
│   Registered Church    │  │   Other Organization   │
│   (Active - Indigo)    │  │   (Inactive - Slate)   │
└────────────────────────┘  └────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ▼  Select your church...                                   │
│  ─────────────────────────────────────────────────────────  │
│     Grace Community Church - Dallas, TX                     │
│     First Baptist Church - Austin, TX                       │
│     New Hope Fellowship - Houston, TX                       │
│     Covenant Presbyterian Church - San Antonio, TX          │
│     Living Word Church - Fort Worth, TX                     │
│     St. Michael's Catholic Church - Dallas, TX              │
│     Christ the King Lutheran - Plano, TX                    │
│     Cornerstone Assembly - Irving, TX                       │
└─────────────────────────────────────────────────────────────┘

ℹ️  ✓ Registered churches can verify your claim for faster approval
```

### When "Other Organization" is Selected

```
┌─────────────────────────────────────────────────────────────┐
│  Church / Organization                                      │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────┐  ┌────────────────────────┐
│        🏛️              │  │        👥              │
│   Registered Church    │  │   Other Organization   │
│   (Inactive - Slate)   │  │   (Active - Indigo)    │
└────────────────────────┘  └────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Enter your organization name                               │
│  [_________________________________]                        │
└─────────────────────────────────────────────────────────────┘

ℹ️  ℹ️ Claims may require additional verification
```

---

## 🎯 Interactive States

### Toggle Buttons

#### Registered Church (Active)
```
┌────────────────────────┐
│        🏛️              │  ← Icon centered
│   Registered Church    │  ← Label
│                        │
│ Border: Indigo (2px)   │
│ Background: Indigo-50  │
│ Text: Indigo-700       │
│ Font: Medium weight    │
└────────────────────────┘
```

#### Registered Church (Inactive)
```
┌────────────────────────┐
│        🏛️              │
│   Registered Church    │
│                        │
│ Border: Slate-300      │
│ Background: White      │
│ Text: Slate-600        │
│ Hover: Slate-400 border│
└────────────────────────┘
```

---

## 📋 Review Step Display

### With Registered Church

```
┌─────────────────────────────────────────────────────────────┐
│  ✈️ Trip Details                                            │
│                                                              │
│  Destination: Kenya, East Africa           🟡 Medium Risk   │
│  Start Date: June 1, 2025                                   │
│  End Date: June 30, 2025                                    │
│  Duration: 30 days                                          │
│  Purpose: Medical Mission                                   │
│                                                              │
│  Organization: Grace Community Church  ✓ Verified Church    │
│                                        └─────────────────┘   │
│                                        (Green badge)         │
└─────────────────────────────────────────────────────────────┘
```

### With Custom Organization

```
┌─────────────────────────────────────────────────────────────┐
│  ✈️ Trip Details                                            │
│                                                              │
│  Destination: Kenya, East Africa           🟡 Medium Risk   │
│  Start Date: June 1, 2025                                   │
│  End Date: June 30, 2025                                    │
│  Duration: 30 days                                          │
│  Purpose: Medical Mission                                   │
│                                                              │
│  Organization: International Missions Group                 │
│                (No badge - custom organization)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Interactions

### Interaction 1: Select Registered Church
```
1. Click "Registered Church" button
   └─> Button highlights (indigo border/bg)
   └─> Dropdown appears

2. Click dropdown
   └─> Opens list of 8 churches

3. Click "Grace Community Church - Dallas, TX"
   └─> Name fills in formData
   └─> Stores church ID
   └─> Shows success message

4. Continue to next step
   └─> Validation passes ✓
```

### Interaction 2: Switch to Custom
```
1. Click "Other Organization" button
   └─> Previous button dims
   └─> New button highlights
   └─> Dropdown disappears
   └─> Text input appears
   └─> Previous selections cleared

2. Type "Small Church Missions"
   └─> Value stores in formData
   └─> Shows info message

3. Continue to next step
   └─> Validation passes ✓
```

### Interaction 3: Switch Back to Registered
```
1. Click "Registered Church" button again
   └─> Text input disappears
   └─> Dropdown reappears
   └─> Dropdown is reset (empty)
   └─> Previous custom text cleared

2. Must select church again
   └─> Make new selection from dropdown
```

---

## 🎨 Color & Style Reference

### Toggle Button Colors

**Active State**:
- Border: `border-indigo-600` (#4f46e5)
- Background: `bg-indigo-50` (#eef2ff)
- Text: `text-indigo-700` (#4338ca)
- Font: `font-medium`

**Inactive State**:
- Border: `border-slate-300` (#cbd5e1)
- Background: `bg-white` (#ffffff)
- Text: `text-slate-600` (#475569)
- Hover Border: `hover:border-slate-400` (#94a3b8)

### Verification Badge
- Background: `bg-green-100` (#dcfce7)
- Text: `text-green-700` (#15803d)
- Border Radius: `rounded-full`
- Padding: `px-2 py-1`
- Icon: CheckCircle (w-3 h-3)

### Info Messages

**Success (Registered)**:
- Icon: ✓ (checkmark)
- Text: "Registered churches can verify your claim for faster approval"
- Color: `text-slate-600`

**Info (Custom)**:
- Icon: ℹ️ (info circle)
- Text: "Claims may require additional verification"
- Color: `text-slate-600`

---

## 📊 Component Hierarchy

```
Step 2: Dates & Details
│
├── Date Inputs Section
│   ├── Start Date
│   └── End Date
│
├── Trip Duration Display (conditional)
│
├── Trip Purpose Dropdown
│
└── Organization Selection ← NEW
    │
    ├── Toggle Buttons
    │   ├── Registered Church Button
    │   │   ├── Church Icon
    │   │   └── Label
    │   │
    │   └── Other Organization Button
    │       ├── Users Icon
    │       └── Label
    │
    ├── Conditional Content
    │   │
    │   ├── If Registered (organizationType === 'registered')
    │   │   ├── Church Dropdown (select)
    │   │   │   └── 8 Church Options
    │   │   └── Success Message
    │   │
    │   └── If Custom (organizationType === 'custom')
    │       ├── Text Input
    │       └── Info Message
    │
    └── Validation (either churchId OR organizationName required)
```

---

## 🎬 Animation States

### Toggle Button Click
```
1. User clicks inactive button
2. Button border changes from slate → indigo (100ms)
3. Background fills with indigo-50 (100ms)
4. Text color changes to indigo-700 (100ms)
5. Other button dims simultaneously
6. Content area transitions (200ms)
```

### Dropdown Selection
```
1. User clicks dropdown
2. Dropdown expands with native animation
3. User clicks option
4. Dropdown closes
5. Selected value appears
6. Success message fades in (200ms)
```

---

## 💡 UX Considerations

### Why Toggle Buttons?
- Clear visual separation
- Immediate feedback
- Easy to understand options
- Mobile-friendly (large tap targets)

### Why Show Benefits?
- Users understand verification value
- Clear why registered is preferred
- No confusion about requirements

### Why Allow Custom?
- Flexibility for small/new churches
- Mission teams without church
- Individual missionaries

---

## 🔍 Accessibility

### Keyboard Navigation
- Tab through toggle buttons
- Enter/Space to select
- Tab to dropdown/input
- Arrow keys in dropdown

### Screen Readers
- Buttons announce state (selected/unselected)
- Dropdown announces options
- Info messages read aloud

### Visual Indicators
- Focus rings on interactive elements
- High contrast for active states
- Icons + text (not icon-only)

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Buttons side-by-side (flex-row)
- Full-width dropdown
- Comfortable spacing

### Tablet (768px - 1023px)
- Buttons side-by-side (smaller)
- Full-width dropdown
- Maintained readability

### Mobile (< 768px)
- Buttons side-by-side (stacked text if needed)
- Full-width dropdown
- Touch-friendly sizes

---

This visual guide shows exactly how the new church selection feature looks and behaves! 🎨✨
