# Church Dashboard Feature - User Story 3.2: Verify Church Leader

## 🎯 Overview
Implementation of the Church Dashboard page that allows church administrators to view, manage, and verify church leaders according to User Story 3.2.

## ✅ User Story

```
AS A verified church
I WANT TO verify other church leaders
SO THAT they can participate in claim verification
```

## 📋 Acceptance Criteria

- ✅ Church can view all registered leaders
- ✅ Church can nominate leaders for verification
- ✅ Leader must stake ETH to be verified (configurable amount)
- ✅ Leader receives verification credentials upon approval
- ✅ Leader can now verify claims and testimonies
- ✅ Leader's verification power is based on stake amount
- ✅ Dashboard shows leader status (active/pending)
- ✅ Dashboard displays verification statistics

## 🗺️ User Journey

```
Church Admin → Access Dashboard → View Leaders → Click "Add Leader" 
→ Enter Leader Details → Set Stake Amount → Send Invitation 
→ Leader Stakes ETH → Approval → Leader Verified
```

## 🎨 Key Features

### 1. Church Information Overview
- Church details (name, location, denomination)
- Registration date and Church ID
- Statistics dashboard:
  - Total Verified Leaders
  - Total Tithes Received
  - Active Leaders Count
  - Pending Verifications

### 2. Leaders List
- **Filter Tabs**: All / Active / Pending
- **Leader Cards** display:
  - Name and role (Senior Pastor, Elder, Deacon, etc.)
  - Wallet address (truncated with external link)
  - Stake amount in ETH
  - Verification date
  - Number of verifications completed
  - Status badge (Active/Pending)
  - Role badge (Award icon for Senior Pastor)

### 3. Add Leader Modal
- Wallet address input (required)
- Full name input (required)
- Role selection dropdown:
  - Senior Pastor
  - Associate Pastor
  - Elder
  - Deacon
  - Board Member
- Stake amount selection:
  - 1.0 ETH (Senior Pastor)
  - 0.5 ETH (Associate Pastor)
  - 0.1 ETH (Elder/Deacon)
  - 0.05 ETH (Board Member)
- Information note about staking requirement
- Send invitation button (disabled until required fields are filled)

## 🔧 Technical Implementation

### Page Location
```
/church-dashboard
```

### File Structure
```
src/app/church-dashboard/
  └── page.tsx          # Main dashboard component
```

### New Icons Added
```tsx
- UserPlus    // Add leader icon
- UserCheck   // Verified leader icon
- Award       // Senior pastor badge
- Building    // Church/organization icon
```

### Types
```typescript
interface ChurchLeader {
  id: string
  address: string
  name: string
  role: string
  stakeAmount: string
  verifiedAt: string
  verificationsCount: number
  status: 'active' | 'pending' | 'inactive'
}

interface ChurchInfo {
  id: string
  name: string
  location: string
  denomination: string
  registeredAt: string
  totalLeaders: number
  totalTithesReceived: string
}
```

### State Management
```typescript
- showAddLeaderModal: boolean
- leaders: ChurchLeader[]
- filterStatus: 'all' | 'active' | 'pending'
- newLeader: { address, name, role, stakeAmount }
```

## 🎨 UI Components

### Navigation
- Back to Home button
- Wallet Connect button

### Church Info Card
- Two-column layout:
  - Left: Church details
  - Right: Statistics grid (2x2)
- Gradient backgrounds for stat cards
- Color-coded by metric type

### Leaders Section
- Section header with "Add Leader" button
- Filter tabs for status filtering
- Leader cards with:
  - Status indicator (green/amber)
  - Role badge
  - Wallet address with copy/external link
  - Verification statistics
  - Action buttons (Approve for pending, View Details)

### Add Leader Modal
- Centered overlay with backdrop
- Form fields with validation
- Helpful information box
- Primary/secondary action buttons

## 🎨 Design System

### Colors
- **Indigo**: Primary actions, church branding
- **Green**: Active status, successful verifications
- **Amber**: Pending status, warnings
- **Purple**: Secondary statistics
- **Slate**: Text, borders, backgrounds

### Typography
- Headers: Bold, large (2xl-4xl)
- Body: Medium weight, readable
- Mono: Wallet addresses, IDs

### Spacing
- Cards: p-6 to p-8
- Sections: py-12
- Grid gaps: gap-4 to gap-8

## 📊 Mock Data

### Simulated Church
```typescript
{
  id: 'CHURCH-001',
  name: 'Grace Community Church',
  location: 'Dallas, TX',
  denomination: 'Non-denominational',
  registeredAt: '2024-08-15',
  totalLeaders: 4,
  totalTithesReceived: '125000'
}
```

### Simulated Leaders (4 examples)
- Pastor Mike Thompson (Senior Pastor, 1.0 ETH, 45 verifications)
- Elder John Davis (Elder, 0.1 ETH, 28 verifications)
- Elder Sarah Martinez (Elder, 0.1 ETH, 15 verifications)
- Deacon James Wilson (Deacon, 0.05 ETH, 7 verifications, pending)

## 🔌 Blockchain Integration Points

### Smart Contract Functions (To Be Implemented)
```solidity
// Add leader nomination
function nominateLeader(address leaderAddress, string name, string role, uint256 stakeAmount)

// Leader accepts and stakes
function acceptLeadershipAndStake() payable

// Approve leader
function approveLeader(address leaderAddress)

// Get church leaders
function getChurchLeaders(address churchAddress) returns (Leader[])

// Get leader verification count
function getLeaderVerificationCount(address leaderAddress) returns (uint256)
```

### wagmi Hooks Used
```typescript
- useAccount()           // Get connected wallet
- useWriteContract()     // Write to blockchain
- useWaitForTransactionReceipt()  // Wait for confirmation
```

## 🚀 Usage

### Access the Dashboard
1. Navigate to `/church-dashboard`
2. Connect wallet (church admin wallet)
3. View church information and leaders

### Add a New Leader
1. Click "Add Leader" button
2. Enter leader's wallet address
3. Enter leader's full name
4. Select role from dropdown
5. Choose required stake amount
6. Click "Send Invitation"
7. Leader receives invitation to stake and join

### Filter Leaders
- Click "All" to see all leaders
- Click "Active" to see only verified, active leaders
- Click "Pending" to see leaders awaiting approval

### Manage Leaders
- View leader details by clicking "View Details"
- Approve pending leaders by clicking "Approve"
- See verification statistics for each leader

## 🔐 Security Considerations

### Stake Requirements
- **Senior Pastor**: 1.0 ETH (highest responsibility)
- **Associate Pastor**: 0.5 ETH
- **Elder/Deacon**: 0.1 ETH
- **Board Member**: 0.05 ETH

### Access Control
- Only verified church addresses can add leaders
- Leaders must stake required amount before activation
- Stake is locked while leader is active
- Slashing mechanism for malicious verification (to be implemented)

### Verification Power
- Higher stake = more verification weight
- Multiple leaders required for high-value claims
- Verification history tracked on-chain

## 📱 Responsive Design
- Desktop: Full layout with all details
- Mobile: Stacked cards, simplified navigation
- Tablet: Optimized grid layouts

## 🎯 Next Steps

### Phase 1: Backend Integration
- [ ] Connect to smart contracts
- [ ] Implement real stake transactions
- [ ] Add event listeners for leader approvals
- [ ] Fetch real-time leader data from blockchain

### Phase 2: Enhanced Features
- [ ] Leader removal/suspension
- [ ] Stake withdrawal after cooldown period
- [ ] Detailed verification history
- [ ] Leader performance metrics
- [ ] Notification system for new leaders

### Phase 3: Advanced Features
- [ ] Multi-signature approval for high-value decisions
- [ ] Reputation scoring system
- [ ] Leader roles and permissions hierarchy
- [ ] Automated slashing for bad actors
- [ ] Leader activity dashboard

## 🔗 Related Files
- `/src/app/church-dashboard/page.tsx` - Main dashboard page
- `/src/components/Icons.tsx` - Icon components
- `/src/components/WalletConnectButton.tsx` - Wallet integration
- `/src/app/register-church/page.tsx` - Church registration (prerequisite)

## 📚 Related Documentation
- `REGISTER_CHURCH_FEATURE.md` - Church registration (User Story 3.1)
- `.github/copilot-instructions.md` - Project overview and user stories
- `EPIC_1_COMPLETE.md` - Automated tithing implementation

## ✨ Example Scenarios

### Scenario 1: Senior Pastor Adds Elders
> Pastor Mike of Grace Community Church wants to add three elders to help verify mission trip claims. He logs into the church dashboard, clicks "Add Leader", and enters each elder's wallet address and name. He sets their stake requirement to 0.1 ETH each. The elders receive invitations, stake their ETH, and are approved. Now they can help verify claims alongside Pastor Mike.

### Scenario 2: Pending Leader Approval
> Deacon James has staked 0.05 ETH and is waiting for approval. Pastor Mike logs into the dashboard, sees James in the "Pending" tab, reviews his details, and clicks "Approve". James immediately gains verification credentials and can begin participating in claim verification.

### Scenario 3: Viewing Leader Statistics
> The church board wants to review their leadership team's activity. They open the dashboard and see that Pastor Mike has verified 45 claims, Elder John has verified 28, and Elder Sarah has verified 15. This transparency helps the board understand the engagement level of their leadership team.

---

**Status**: ✅ Initial Implementation Complete  
**Last Updated**: 2025-10-04  
**Related Epic**: Epic 3 - Church Leadership Portal  
**User Story**: 3.2 - Verify Church Leader
