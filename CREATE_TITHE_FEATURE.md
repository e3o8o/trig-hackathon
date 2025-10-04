# Create Tithe Commitment Feature Documentation

## Overview
This document describes the implementation of **User Story 1.1: Create Tithe Commitment** from the Steward platform specification.

## Feature Location
- **Route**: `/create-tithe`
- **Component**: `src/app/create-tithe/page.tsx`

## User Story Implementation

### User Story 1.1: Create Tithe Commitment
```
AS A Christian believer
I WANT TO set up automatic tithing to my church
SO THAT I can practice consistent biblical giving without manual effort
```

## Acceptance Criteria ✅

All acceptance criteria have been implemented:

- ✅ User can connect their wallet
- ✅ User can select a verified church from a list
- ✅ User can set income threshold (e.g., "$5,000/month")
- ✅ User can set tithe percentage (e.g., "10%")
- ✅ User can add additional offering percentage (e.g., "5% to missions")
- ✅ User can preview the commitment before confirming
- ✅ Transaction is recorded (simulated blockchain)
- ✅ User receives confirmation

## Features

### 1. Multi-Step Flow
The feature implements a 4-step wizard:

#### Step 1: Select Church
- Browse list of verified churches
- Search functionality (by name, location, or denomination)
- Each church displays:
  - Church name with verification badge
  - Location
  - Denomination
  - Member count
  - Church ID

#### Step 2: Configure Commitment
- Set monthly income threshold (USD)
- Set tithe percentage (default: 10%)
- Set additional offering percentage (optional)
- Choose giving frequency:
  - Monthly (when income received)
  - Bi-weekly
  - Weekly
  - One-time commitment
- Real-time preview of amounts

#### Step 3: Preview & Confirm
- Review church information
- Review giving details
- See monthly and annual giving summary
- Important information notice
- Confirm commitment (requires wallet connection)

#### Step 4: Success
- Display commitment ID
- Show commitment summary
- Provide next steps information
- Links to view giving history or create another commitment

### 2. Simulated Church List
Currently uses a simulated list of 8 verified churches:
- Grace Community Church (Dallas, TX)
- First Baptist Church (Austin, TX)
- New Hope Fellowship (Houston, TX)
- Covenant Presbyterian Church (San Antonio, TX)
- Living Word Church (Fort Worth, TX)
- St. Michael's Catholic Church (Dallas, TX)
- Christ the King Lutheran (Plano, TX)
- Cornerstone Assembly (Irving, TX)

### 3. Blockchain Integration (Commented)
The smart contract integration code is included but commented out:

```typescript
// Uncomment when smart contract is ready:
/*
const { hash } = await writeContract({
  address: '0x...', // Tithe Manager contract address
  abi: [...], // Contract ABI
  functionName: 'createTitheCommitment',
  args: [
    formData.churchId,
    parseEther(formData.incomeThreshold),
    BigInt(formData.tithePercentage * 100), // Store as basis points
    BigInt(formData.offeringPercentage * 100),
    formData.frequency
  ],
})

// Wait for confirmation
await waitForTransactionReceipt({ hash })
setCommitmentId(`TITHE-${hash.slice(0, 10)}`)
setStep('success')
*/
```

### 4. Simulation Logic
For demo purposes, the feature simulates the blockchain transaction:
- 2.5 second delay to mimic transaction processing
- Generates commitment ID: `TITHE-{timestamp}`
- Shows loading state during processing

## Technical Implementation

### Dependencies
- React hooks: `useState`
- wagmi: `useAccount` for wallet connection
- Next.js: `Link` for navigation
- Custom icons from `@/components/Icons`
- WalletConnectButton component

### Form Validation
- Church must be selected
- Income threshold must be > 0
- Tithe percentage must be between 0 and 100
- All required fields must be filled

### Calculations
The component calculates:
- Monthly tithe amount
- Monthly offering amount
- Total monthly giving
- Annual giving total

### State Management
Uses React `useState` for:
- Current step (select | configure | preview | success)
- Form data (church, income, percentages, frequency)
- Commitment ID
- Search term
- Processing state

## UI/UX Features

### Visual Design
- Gradient background (slate → blue → indigo)
- White card-based layout
- Step indicator with progress visualization
- Color-coded status (indigo for active, green for complete)

### Interactive Elements
- Search bar with real-time filtering
- Clickable church cards
- Form inputs with validation
- Preview calculations
- Loading states with spinner
- Success animations

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Responsive typography
- Touch-friendly buttons

## Navigation

### Entry Points
1. Home page "Start Giving" button → `/create-tithe`
2. Direct URL navigation

### Exit Points
1. Back to Home link (header)
2. Success page → View Giving History (future implementation)
3. Success page → Create Another Commitment (resets form)

## Future Enhancements

### When Smart Contracts Are Ready
1. Replace simulated church list with on-chain registry
2. Uncomment blockchain transaction code
3. Add transaction hash display
4. Implement actual on-chain commitment storage
5. Add commitment modification/cancellation features

### Additional Features
1. Church details modal
2. Giving history integration
3. Email/SMS notifications
4. Tax document generation
5. Multiple church support
6. Flexible giving schedules
7. Budget tracking integration

## Testing Scenarios

### Happy Path
1. Connect wallet
2. Search and select church
3. Set income: $5,000
4. Set tithe: 10%
5. Set offering: 5%
6. Choose monthly frequency
7. Preview commitment
8. Confirm → Success

### Edge Cases
- Searching with no results
- Very large income amounts
- Zero offering percentage
- Different frequency options
- Navigating back through steps

## Example User Journey

**Persona**: Sarah, a software engineer earning $8,000/month

1. Sarah visits Steward homepage
2. Clicks "Start Giving"
3. Searches for "Grace Community Church"
4. Selects her church from the list
5. Sets income threshold: $8,000
6. Sets tithe: 10% ($800)
7. Sets offering: 5% ($400)
8. Chooses "Monthly" frequency
9. Previews: $1,200 total monthly giving
10. Confirms commitment
11. Receives commitment ID: TITHE-1728234567890
12. Can now view giving history

## Development Notes

### File Structure
```
src/app/create-tithe/
  └── page.tsx (1,000+ lines, complete feature)
```

### Icons Used
- ArrowLeft - Navigation
- Shield - Security/trust
- Heart - Giving/love
- CheckCircle - Success/verification
- Loader2 - Loading states
- Church - Church selection
- DollarSign - Financial inputs
- Calendar - Frequency (imported but not used yet)

### Styling
- Tailwind CSS utility classes
- Custom color scheme (indigo/blue primary)
- Hover effects and transitions
- Shadow elevations for depth

## Integration Points

### Smart Contract Interface (Future)
```solidity
function createTitheCommitment(
  string churchId,
  uint256 incomeThreshold,
  uint16 tithePercentageBp,  // Basis points (10% = 1000)
  uint16 offeringPercentageBp,
  string frequency
) external returns (bytes32 commitmentId)
```

### Expected Contract Events
```solidity
event TitheCommitmentCreated(
  address indexed giver,
  string churchId,
  bytes32 commitmentId,
  uint256 incomeThreshold,
  uint256 timestamp
)
```

## Security Considerations
- Wallet connection required for commitment
- Input validation on all form fields
- Sanitized search queries
- Church verification status displayed
- Commitment ID generation includes timestamp

## Accessibility
- Semantic HTML structure
- Clear labeling on all inputs
- Focus states on interactive elements
- Screen reader friendly text
- High contrast ratios

---

## Quick Start for Developers

1. Navigate to `/create-tithe` route
2. Review the 4-step flow implementation
3. Test with wallet connected and disconnected
4. When ready for blockchain:
   - Add contract address
   - Add contract ABI
   - Uncomment smart contract code
   - Remove simulation logic
5. Update church list to pull from on-chain registry

## Status: ✅ COMPLETE (Simulation Mode)

The feature is fully functional in simulation mode and ready for production once smart contracts are deployed.
