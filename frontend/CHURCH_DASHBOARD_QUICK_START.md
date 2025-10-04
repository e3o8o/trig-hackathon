# 🚀 Church Dashboard - Quick Start Guide

## 📍 Accessing the Church Dashboard

### URL
```
http://localhost:3000/church-dashboard
```

### From Homepage
1. Navigate to the homepage
2. Click **"Church Dashboard"** in the navigation menu
3. Or scroll down and look for church-related features

---

## 🎯 What You'll See

### When Not Connected
- Prompt to connect wallet
- Church information (visible)
- Leaders section (locked until wallet connected)

### When Connected
- Full church information card
- Statistics dashboard (4 key metrics)
- List of all church leaders
- "Add Leader" button
- Filter tabs (All/Active/Pending)

---

## 💡 Quick Actions

### 1. View Church Leaders
```
✅ Filter by: All | Active | Pending
✅ See leader details (name, role, wallet, stake)
✅ View verification statistics
✅ Check approval status
```

### 2. Add a New Leader
```
1️⃣ Click "Add Leader" button (top right)
2️⃣ Enter wallet address (0x...)
3️⃣ Enter leader's full name
4️⃣ Select role from dropdown
5️⃣ Choose stake amount (auto-filled by role)
6️⃣ Click "Send Invitation"
```

### 3. Approve Pending Leaders
```
1️⃣ Click "Pending" filter tab
2️⃣ Review pending leader details
3️⃣ Click "Approve" button
4️⃣ Sign transaction in wallet
5️⃣ Leader becomes active
```

---

## 🎨 Interface Guide

### Church Info Card
```
📊 Shows:
- Church name and location
- Denomination
- Registration date
- Church ID
- 4 statistics boxes:
  • Verified Leaders (total count)
  • Total Tithes Received (in USD)
  • Active Leaders (currently active)
  • Pending (awaiting approval)
```

### Leader Card
```
👤 Displays:
- Leader name
- Role (Senior Pastor, Elder, Deacon, etc.)
- Status badge (Active/Pending)
- Wallet address (with blockchain link)
- Stake amount in ETH
- Verification date
- Number of verifications completed
- Action buttons (Approve/View Details)
```

### Add Leader Modal
```
📝 Fields:
- Wallet Address * (required)
- Full Name * (required)
- Role (dropdown selection)
- Stake Amount (auto-fills based on role)

💡 Info box explains staking requirement
```

---

## 📋 Roles & Stake Amounts

| Role | Stake Required | Typical Use |
|------|----------------|-------------|
| Senior Pastor | 1.0 ETH | Church leadership |
| Associate Pastor | 0.5 ETH | Assistant leadership |
| Elder | 0.1 ETH | Church council |
| Deacon | 0.1 ETH | Service leadership |
| Board Member | 0.05 ETH | Advisory roles |

---

## 🔍 Filter Options

### All (4)
Shows every leader regardless of status

### Active (3)
Shows only verified, active leaders who can:
- Verify mission trip claims
- Verify tithe commitments
- Participate in governance

### Pending (1)
Shows leaders awaiting approval who:
- Have staked their required amount
- Are waiting for church approval
- Cannot yet verify claims

---

## 🎯 Common Workflows

### Workflow 1: Adding an Elder
```
Scenario: Your church wants to add Elder John as a verifier

Steps:
1. Click "Add Leader"
2. Enter John's wallet: 0x123...abc
3. Enter name: "John Smith"
4. Select role: "Elder"
5. Stake auto-fills: 0.1 ETH
6. Click "Send Invitation"
7. John receives invitation
8. John stakes 0.1 ETH
9. You approve John
10. John can now verify claims
```

### Workflow 2: Approving a Pending Leader
```
Scenario: Deacon Sarah has staked and is pending approval

Steps:
1. Click "Pending" tab
2. See Sarah's card
3. Review her details:
   - Wallet verified ✓
   - Stake amount: 0.05 ETH ✓
   - Role: Deacon ✓
4. Click "Approve"
5. Sign transaction
6. Sarah moves to "Active"
7. Sarah can now verify claims
```

### Workflow 3: Checking Leader Statistics
```
Scenario: Annual review of leadership engagement

Steps:
1. View "All" leaders
2. Check verification counts:
   - Pastor Mike: 45 verifications
   - Elder John: 28 verifications
   - Elder Sarah: 15 verifications
3. Identify most/least active
4. Plan recognition or training
```

---

## 🔐 Security Notes

### Wallet Connection
- Only church admin wallets can access
- Must be connected to add/approve leaders
- Transactions require signature

### Staking System
- Leaders must stake before activation
- Stakes are locked while active
- Higher stakes = more verification power
- Stakes can be slashed for bad behavior

### Approval Process
- Church must approve all leaders
- Multi-step verification process
- On-chain transparency

---

## 📱 Mobile Experience

### Responsive Design
- Full feature parity on mobile
- Touch-friendly buttons
- Stacked layout for readability
- Easy wallet connection

### Mobile Workflow
1. Open in mobile browser
2. Connect mobile wallet (MetaMask, Trust, etc.)
3. View/filter leaders
4. Add leaders via modal
5. Approve with mobile signature

---

## 🐛 Troubleshooting

### Can't See Leaders List
- ✅ Check: Is wallet connected?
- ✅ Solution: Click "Connect Wallet"

### "Add Leader" Button Not Working
- ✅ Check: Is wallet connected?
- ✅ Check: Are you a church admin?
- ✅ Solution: Connect correct wallet

### Modal Won't Close
- ✅ Click the X button (top right)
- ✅ Click "Cancel"
- ✅ Click outside modal

### Leader Not Showing
- ✅ Check correct filter tab
- ✅ Refresh page
- ✅ Wait for blockchain confirmation

---

## 🎓 Understanding the Dashboard

### Statistics Explained

**Verified Leaders (4)**
- Total number of approved leaders
- Includes all active leaders
- Excludes pending/inactive

**Total Tithes ($125k)**
- Sum of all tithes received by church
- Updated in real-time
- Shown in USD for clarity

**Active Leaders (3)**
- Currently active and can verify
- Have completed staking
- Have been approved

**Pending (1)**
- Awaiting approval
- May or may not have staked
- Cannot verify yet

### Verification Count
- Shows how many claims each leader has verified
- Higher count = more experience
- Used to assess engagement

### Stake Amount
- Amount locked as collateral
- Varies by role
- Can be slashed for misconduct

---

## 💡 Best Practices

### Adding Leaders
- ✅ Verify wallet address is correct
- ✅ Use full legal names
- ✅ Select appropriate role
- ✅ Explain staking requirements beforehand
- ✅ Have leader ready to stake

### Approving Leaders
- ✅ Verify identity off-chain first
- ✅ Confirm stake has been received
- ✅ Check leader understands responsibilities
- ✅ Approve in timely manner

### Managing Leaders
- ✅ Regularly review verification counts
- ✅ Recognize active participants
- ✅ Train low-activity leaders
- ✅ Update roles as church structure changes

---

## 🔗 Related Pages

### Navigation Links
- **Home** (`/`) - Main landing page
- **My Commitments** (`/my-commitments`) - View tithe commitments
- **Giving History** (`/giving-history`) - View giving records
- **Register Church** (`/register-church`) - Register new church
- **Create Tithe** (`/create-tithe`) - Set up tithing

### Documentation
- `CHURCH_DASHBOARD_FEATURE.md` - Technical details
- `CHURCH_DASHBOARD_VISUAL_GUIDE.md` - UI/UX guide
- `CHURCH_DASHBOARD_COMPLETE.md` - Implementation summary

---

## 🎉 You're Ready!

### What You Can Do Now
✅ View your church's leadership team  
✅ Add new leaders with appropriate stakes  
✅ Approve pending leaders  
✅ Filter and search leaders  
✅ Track verification activity  
✅ Manage church governance  

### Need Help?
- Check the feature documentation
- Review the visual guide
- Look at example workflows above
- Contact support (when available)

---

## 📊 Sample Data

### Pre-loaded Church
**Grace Community Church**
- Location: Dallas, TX
- Denomination: Non-denominational
- 4 leaders (3 active, 1 pending)
- $125,000 in tithes received

### Pre-loaded Leaders
1. **Pastor Mike Thompson** - Senior Pastor, 1.0 ETH, 45 verifications
2. **Elder John Davis** - Elder, 0.1 ETH, 28 verifications
3. **Elder Sarah Martinez** - Elder, 0.1 ETH, 15 verifications
4. **Deacon James Wilson** - Deacon, 0.05 ETH, 7 verifications (pending)

*Note: This is sample data for demonstration. Real data will come from the blockchain.*

---

**Last Updated**: October 4, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready (UI Layer)
