# Quick Start Guide: Register Church Feature

## Access the Feature

### Option 1: Main Navigation
1. Look at the top-right of the home page
2. Click the **"Register Church"** button (purple/indigo button)

### Option 2: Church Leaders Section
1. Scroll down to the "For Church Leaders" section (purple gradient background)
2. Click **"Register Your Church"** button

### Option 3: Direct URL
- Navigate to: `http://localhost:3000/register-church`

---

## Registration Process

### Step 1: Fill Out the Form

Enter your church information:

```
Church Name: Grace Community Church
Street Address: 123 Main Street
City: Dallas
State/Province: TX
Country: United States
Denomination: [Select from dropdown]
```

**Important Notes:**
- All fields are required
- The "Continue to Preview" button is disabled until all fields are filled
- There's a yellow warning box explaining the 1 ETH stake requirement

### Step 2: Preview Your Details

Review screen shows:
- All church information you entered
- Confirmation of 1 ETH stake requirement
- Wallet connection status
- Two buttons:
  - "Back to Edit" - Return to form
  - "Confirm & Stake 1 ETH" - Proceed with registration

**Note**: In demo mode, you can proceed without connecting a wallet. In production, wallet connection will be required.

### Step 3: Success!

After confirmation, you'll see:
- ✅ Green checkmark confirmation
- Your unique Church ID (e.g., `CHURCH-1728053421`)
- Summary of your registration
- Next steps for setting up your church
- Two action buttons:
  - "Back to Home"
  - "Go to Dashboard" (placeholder for future feature)

---

## Visual Guide

### Navigation
```
Home Page Header:
[Steward Logo] [Features] [How It Works] [For Churches] [Register Church] [Connect Wallet]
                                                          ^^^^^^^^^^^^^^^^
                                                          Click here!
```

### Form Layout
```
┌─────────────────────────────────────────┐
│  [Church Icon]                          │
│                                         │
│  Register Your Church                   │
│  Join the Steward platform...           │
│                                         │
│  ⚠️ Registration Stake Required         │
│  You must stake 1 ETH...                │
│                                         │
│  Church Name: [________________]        │
│  Street Address: [________________]     │
│  City: [________]  State: [____]        │
│  Country: [________________]            │
│  Denomination: [▼ Select        ]       │
│                                         │
│  [Continue to Preview]                  │
└─────────────────────────────────────────┘
```

### Success Screen
```
┌─────────────────────────────────────────┐
│           ✅                            │
│  Registration Successful!               │
│                                         │
│  Church Details:                        │
│  ┌──────────────────────────────────┐  │
│  │ Name: Grace Community Church     │  │
│  │ Location: Dallas, TX, USA        │  │
│  │ Church ID: CHURCH-1728053421     │  │
│  │ Staked: 1 ETH                    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Next Steps:                            │
│  ✅ Share Church ID with members       │
│  ✅ Verify church leaders              │
│  ✅ Access church dashboard            │
│                                         │
│  [Back to Home] [Go to Dashboard]       │
└─────────────────────────────────────────┘
```

---

## Testing Tips

### Try These Scenarios:

1. **Form Validation**
   - Try clicking "Continue to Preview" with empty fields
   - Notice the button is disabled
   - Fill in all fields and see it enable

2. **Edit Flow**
   - Fill form → Preview → Click "Back to Edit"
   - Your data should still be there
   - Make changes and preview again

3. **Responsive Design**
   - Resize your browser window
   - Try on mobile size (< 768px)
   - Layout should adapt nicely

4. **Navigation**
   - Use the "Back to Home" link
   - Click "Register Church" again
   - Form should reset

---

## Demo Data

Use this for quick testing:

```
Church Name: First Baptist Church
Street Address: 456 Church Ave
City: Austin
State/Province: TX
Country: United States
Denomination: Baptist
```

---

## What's Working

✅ Complete form with validation
✅ Multi-step workflow
✅ Responsive design
✅ Wallet integration UI
✅ Transaction simulation
✅ Success confirmation
✅ Navigation integration

## What's Simulated (For Demo)

⚠️ Blockchain transaction (2-second delay)
⚠️ Church ID generation
⚠️ No real ETH required

---

## Keyboard Shortcuts

- `Tab` - Navigate between form fields
- `Enter` - Submit form (when valid)
- `Esc` - Close modals (if applicable)

---

## Troubleshooting

**Issue**: Button stays disabled
- **Solution**: Make sure ALL fields are filled in

**Issue**: Can't see the page
- **Solution**: Check that dev server is running (`npm run dev`)

**Issue**: Wallet errors
- **Solution**: In demo mode, you can skip wallet connection

---

**Enjoy testing the Register Church feature! 🎉**
