# My Protections Page - Complete Implementation

## Overview
Created a comprehensive "My Protections" page where users can view and manage all their mission trip insurance policies with blockchain integration.

## Features Implemented

### 1. View All Policies ✅
- **Fetches from blockchain**: Uses `getHolderPolicies()` and `policies()` contract functions
- **Real-time data**: Pulls current policy status directly from smart contract
- **Rich display**: Shows coverage, premium, dates, location, event type, and status

### 2. Policy Status Tracking ✅
Four policy statuses with color-coded badges:
- **Active** (Green): Policy is currently valid
- **Claimed** (Blue): Claim has been paid out
- **Expired** (Gray): Policy period has ended
- **Cancelled** (Red): Policy was cancelled before start

### 3. Submit Insurance Claims ✅
- **Eligibility check**: Only during active policy period (start date → end date + 30 days)
- **Modal interface**: Clean form for claim reason
- **Blockchain transaction**: Calls `submitClaim()` contract function
- **Church approval**: Notifies user that claim needs 2/3 church leader approval

### 4. Cancel Policies ✅
- **Eligibility check**: Only before trip start date
- **90% refund**: Contract returns 90% of premium (10% cancellation fee)
- **Confirmation modal**: Shows refund amount before cancelling
- **Blockchain transaction**: Calls `cancelPolicy()` contract function

## Page Structure

### Header
- Steward logo with navigation
- User menu (connects to wallet)
- Back button to home

### Empty State
- Friendly message when no policies
- Call-to-action button to purchase protection
- Clear visual with shield icon

### Policy Cards
Each policy displays:
- **Event name and location**
- **Policy status badge**
- **Event type** (Mission Trip, Church Event, etc.)
- **Coverage amount** (USD + ETH)
- **Premium paid** (USD + ETH)
- **Start and end dates**
- **Policy ID and purchase date**
- **Claim status** (if claim submitted or paid)
- **Action buttons** (Submit Claim / Cancel Policy)

### Modals

#### Submit Claim Modal
- Coverage amount display
- Claim reason textarea
- Info about church approval process
- Submit/Cancel buttons
- Loading states during transaction

#### Cancel Policy Modal
- Confirmation message
- Cancellation policy explanation
- Refund amount calculation (90%)
- Keep Policy / Cancel Policy buttons
- Loading states during transaction

## Smart Contract Integration

### Functions Used

#### Read Functions
```typescript
// Get user's policy IDs
getHolderPolicies(address holder) → uint256[]

// Get policy details
policies(uint256 policyId) → Policy struct
```

#### Write Functions
```typescript
// Submit a claim
submitClaim(
  uint256 policyId,
  uint256 claimAmount,
  string claimReason
)

// Cancel policy (before start date)
cancelPolicy(uint256 policyId)
// Returns 90% refund automatically
```

### Data Flow
```
1. Connect Wallet
   ↓
2. Fetch Policy IDs (getHolderPolicies)
   ↓
3. Fetch Policy Details (policies[id])
   ↓
4. Display Policies with Status
   ↓
5. User Actions:
   - Submit Claim → submitClaim() → Await church approval
   - Cancel Policy → cancelPolicy() → Receive 90% refund
   ↓
6. Transaction Confirmation
   ↓
7. Refresh Policy Data
```

## Business Logic

### Submit Claim Eligibility
```typescript
canSubmitClaim(policy):
  - Policy status must be ACTIVE (0)
  - Claim not already submitted
  - Current time >= policy.startDate
  - Current time <= policy.endDate + 30 days
```

### Cancel Policy Eligibility
```typescript
canCancelPolicy(policy):
  - Policy status must be ACTIVE (0)
  - Current time < policy.startDate
  - Cannot cancel after trip has started
```

### Refund Calculation
```typescript
// Contract formula:
refundAmount = (premium * 9000) / 10000  // 90%

// Example: $1 premium
refund = ($1 * 0.90) = $0.90
```

## UI/UX Features

### Responsive Design
- Mobile-friendly layout
- Cards stack on small screens
- Modals centered and scrollable

### Loading States
- Spinner while fetching policies
- "Loading your protections..." message
- Button loading states during transactions

### Visual Feedback
- Color-coded status badges
- Icons for each action
- Hover effects on cards
- Smooth transitions

### Information Display
- USD primary (user-friendly)
- ETH secondary (blockchain transparency)
- Both coverage and premium shown
- Date formatting (locale-aware)

## Code Organization

### State Management
```typescript
const [policies, setPolicies] = useState<Policy[]>([])
const [isLoading, setIsLoading] = useState(true)
const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
const [showClaimModal, setShowClaimModal] = useState(false)
const [showCancelModal, setShowCancelModal] = useState(false)
const [claimReason, setClaimReason] = useState('')
const [isHydrated, setIsHydrated] = useState(false)
```

### Wagmi Hooks
```typescript
// Wallet connection
const { address, isConnected } = useAccount()

// Blockchain client for batch reads
const publicClient = usePublicClient()

// Read contract data
const { data: policyIds, refetch } = useReadContract({...})

// Write to contract
const { writeContract, isPending, error } = useWriteContract()

// Wait for confirmation
const { isConfirming, isConfirmed } = useWaitForTransactionReceipt({ hash })
```

### Effect Hooks
```typescript
// Hydration (prevent SSR mismatch)
useEffect(() => setIsHydrated(true), [])

// Fetch policies when IDs change
useEffect(() => { fetchPolicies() }, [policyIds, publicClient])

// Refresh after transaction
useEffect(() => { 
  if (isConfirmed) refetchPolicyIds() 
}, [isConfirmed])

// Show transaction errors
useEffect(() => { 
  if (writeError) alert(writeError.message) 
}, [writeError])
```

## Testing Scenarios

### Scenario 1: View Policies
1. Connect wallet
2. See all purchased policies
3. Check status badges
4. View coverage and premium amounts

### Scenario 2: Submit Claim
1. Find an active policy (after start date)
2. Click "Submit Claim"
3. Enter claim reason
4. Submit transaction
5. See "Claim Submitted" badge
6. Await church approval

### Scenario 3: Cancel Policy
1. Find an active policy (before start date)
2. Click "Cancel Policy"
3. Review refund amount (90%)
4. Confirm cancellation
5. Receive refund automatically
6. See "Cancelled" status

### Scenario 4: Empty State
1. Connect wallet with no policies
2. See friendly empty state
3. Click "Get Protected Now"
4. Navigate to purchase page

## Integration Points

### Navigation
- User menu includes "My Protections" link
- Back button returns to home
- Logo links to home page

### Contract Addresses
- Uses `CONTRACTS.mission` from config
- Base Sepolia: `0x31C31Bcfa4149132B64b3F00F11EdE1D2e39bE12`

### Conversion Rate
- ETH_TO_USD: 4608.59 (consistent with other pages)
- Display in USD, store in ETH

## Key Differences from Other Pages

### My Commitments (Tithes)
- Can pause/resume
- Recurring payments
- Payment history tracking

### My Protections (Insurance)
- One-time premium
- Submit claims for events
- Cancel before start date
- Fixed coverage period

## Future Enhancements

### Potential Additions
1. **Claim History**: Show all claim submissions and approvals
2. **Payout Tracking**: Display when payouts were received
3. **Policy Documents**: Generate PDF policy certificates
4. **Notifications**: Alert when claim is approved
5. **Filters**: Filter by status (Active, Claimed, etc.)
6. **Search**: Search policies by destination or event name
7. **Export**: Download policy data as CSV
8. **Analytics**: Show total coverage, total premiums paid

### Smart Contract Features Available
- **Process Claims**: Church leaders approve (not in current UI)
- **Trig Integration**: Link to automated oracle conditions
- **Multi-token Support**: Pay premiums in USDC/USDT

## File Locations

### New Files
- `frontend/src/app/my-protections/page.tsx` - Main page component

### Modified Files
- `frontend/src/components/UserMenu.tsx` - Added navigation link

### Dependencies
- All existing imports (wagmi, viem, Icons, etc.)
- No new dependencies required

## Success Metrics

✅ **Data Fetching**: Pulls real policies from blockchain
✅ **UI Display**: Shows all policy details clearly
✅ **Submit Claims**: Transaction sends successfully
✅ **Cancel Policies**: Refund processed automatically
✅ **User Experience**: Intuitive interface with clear feedback
✅ **Mobile Responsive**: Works on all screen sizes
✅ **Error Handling**: Shows transaction errors clearly
✅ **Loading States**: Users know when data is loading
✅ **Hydration Safe**: No SSR mismatches

---

**Status**: ✅ Complete and Ready to Use
**Last Updated**: October 5, 2025
**Route**: `/my-protections`
**Access**: User Menu → "My Protections"
