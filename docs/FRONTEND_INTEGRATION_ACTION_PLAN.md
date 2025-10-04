# 🚀 Frontend Integration - Immediate Action Plan

**Goal**: Integrate the frontend-mock branch with our deployed Base Sepolia contracts  
**Timeline**: Today (4-6 hours for core features)  
**Approach**: Incremental - one feature at a time

---

## 🎯 Immediate Next Steps (In Order)

### Step 1: Merge Frontend to Main (5 minutes)

```bash
# From main branch
git merge frontend-mock --no-ff -m "Merge frontend from frontend-mock branch"
```

**What this does**:
- Brings all frontend code into main branch
- Preserves both histories
- Creates merge commit

### Step 2: Setup Contract Configuration (15 minutes)

**A. Copy Contract ABIs**:

```bash
# Create ABIs directory in frontend
mkdir -p frontend/src/abis

# Copy all contract ABIs
cp artifacts/contracts/core/TrigImmutableCore.sol/TrigImmutableCore.json frontend/src/abis/
cp artifacts/contracts/steward/StewardOracleRegistry.sol/StewardOracleRegistry.json frontend/src/abis/
cp artifacts/contracts/steward/AutomatedTithe.sol/AutomatedTithe.json frontend/src/abis/
cp artifacts/contracts/steward/MissionProtection.sol/MissionProtection.json frontend/src/abis/
```

**B. Create Contracts Config File**:

```bash
cat > frontend/src/config/contracts.ts << 'EOF'
import TrigCoreABI from '@/abis/TrigImmutableCore.json'
import OracleABI from '@/abis/StewardOracleRegistry.json'
import TitheABI from '@/abis/AutomatedTithe.json'
import MissionABI from '@/abis/MissionProtection.json'

export const CONTRACTS = {
  trigCore: {
    address: '0x0932b427fce27cAf69b36BAd1C33325835740DE0' as `0x${string}`,
    abi: TrigCoreABI.abi,
  },
  oracle: {
    address: '0xd17e248f1De95D944c24c8AD5A609A460E7A2a41' as `0x${string}`,
    abi: OracleABI.abi,
  },
  tithe: {
    address: '0xF13D32355F9B8a9889B5D3C745529f4bf4558E66' as `0x${string}`,
    abi: TitheABI.abi,
  },
  mission: {
    address: '0x5a8278171AAfC8477f9Ff9621fe8eB4e2723C50e' as `0x${string}`,
    abi: MissionABI.abi,
  },
} as const

export const CHAIN_ID = 84532 // Base Sepolia
EOF
```

**C. Create Environment File**:

```bash
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_CHAIN_ID=84532
EOF
```

### Step 3: Test Frontend Setup (10 minutes)

```bash
cd frontend
npm install
npm run dev
```

**Expected**:
- Dev server starts on http://localhost:3000
- Pages load correctly
- Wallet connection works
- No critical errors in console

---

## 🔧 Integration Tasks (Priority Order)

### Task 1: Register Church Integration (30-45 min)

**File**: `frontend/src/app/register-church/page.tsx`

**Changes Required**:

```typescript
// 1. Add imports
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACTS } from '@/config/contracts'

// 2. Add hooks
const { writeContract, data: hash, isPending } = useWriteContract()
const { isSuccess } = useWaitForTransactionReceipt({ hash })

// 3. Replace simulation (around line 159)
const handleConfirmRegistration = async () => {
  if (!isConnected || !address) {
    alert('Please connect your wallet first')
    return
  }

  try {
    writeContract({
      ...CONTRACTS.oracle,
      functionName: 'registerOrganization',
      args: [
        formData.name,
        formData.address,
        formData.website,
      ],
      value: parseEther('0.1'), // 0.1 ETH stake (not 1 ETH!)
    })
  } catch (error) {
    console.error('Registration error:', error)
    alert('Failed to register church. Please try again.')
  }
}

// 4. Handle success
useEffect(() => {
  if (isSuccess && hash) {
    setChurchId(`CHURCH-${address?.slice(0, 10)}`)
    setIsProcessing(false)
    setStep('success')
  }
}, [isSuccess, hash, address])
```

**Test**:
1. Start frontend: `npm run dev`
2. Navigate to /register-church
3. Fill form
4. Connect wallet (make sure you have Base Sepolia ETH)
5. Submit and verify transaction

### Task 2: Fetch Verified Organizations (1 hour)

**Create**: `frontend/src/hooks/useVerifiedOrganizations.ts`

```typescript
import { useReadContract } from 'wagmi'
import { CONTRACTS } from '@/config/contracts'
import { useState, useEffect } from 'react'

export function useVerifiedOrganizations() {
  const [orgs, setOrgs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get count
  const { data: count } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'getOrganizationCount',
  })

  // Query organizations (simplified - use event indexer for production)
  useEffect(() => {
    if (!count) return

    const fetchOrgs = async () => {
      // This is a simplified version
      // In production, use event indexer API
      const organizations = []
      
      for (let i = 0; i < Number(count); i++) {
        // Query each org by address
        // This is inefficient - use event indexer instead
      }
      
      setOrgs(organizations)
      setIsLoading(false)
    }

    fetchOrgs()
  }, [count])

  return { organizations: orgs, isLoading }
}
```

**Better Approach**: Use Event Indexer API (see Task 4)

### Task 3: Create Tithe Integration (1-1.5 hours)

**File**: `frontend/src/app/create-tithe/page.tsx`

**Changes**:

1. Replace hardcoded churches with `useVerifiedOrganizations()`
2. Add `useWriteContract` for `createCommitment()`
3. Convert frequency to enum (0=WEEKLY, 1=BIWEEKLY, 2=MONTHLY, etc.)
4. Add proper ETH amount handling
5. Wait for confirmation and get commitment ID from event

**Code**:

```typescript
// Import
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACTS } from '@/config/contracts'
import { useVerifiedOrganizations } from '@/hooks/useVerifiedOrganizations'

// Replace VERIFIED_CHURCHES
const { organizations, isLoading } = useVerifiedOrganizations()

// Frequency mapping
const frequencyToEnum = {
  'weekly': 0,
  'biweekly': 1,
  'monthly': 2,
  'quarterly': 3,
  'yearly': 4,
}

// Transaction
const { writeContract, data: hash } = useWriteContract()
const { isSuccess } = useWaitForTransactionReceipt({ hash })

const handleConfirmCommitment = async () => {
  const amount = calculateMonthlyTithe().total // Get total amount
  const frequencyEnum = frequencyToEnum[formData.frequency]
  
  try {
    writeContract({
      ...CONTRACTS.tithe,
      functionName: 'createCommitment',
      args: [
        formData.churchAddress, // Need to store address, not just ID
        parseEther(amount.toString()),
        '0x0000000000000000000000000000000000000000', // ETH
        frequencyEnum,
        0, // No end time
      ],
      value: parseEther(amount.toString()), // First payment
    })
  } catch (error) {
    console.error('Commitment creation error:', error)
    alert('Failed to create commitment. Please try again.')
  }
}
```

### Task 4: Event Indexer API (1 hour)

**Create**: `frontend/src/app/api/events/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Read indexed events
    const indexedPath = path.join(process.cwd(), '..', 'indexed-events.json')
    const data = JSON.parse(fs.readFileSync(indexedPath, 'utf8'))
    
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const type = searchParams.get('type')
    
    if (type === 'commitments' && address) {
      const commitments = data.events.titheCommitments.filter(
        (c: any) => c.giver.toLowerCase() === address.toLowerCase()
      )
      return NextResponse.json({ commitments })
    }
    
    if (type === 'payments' && address) {
      const payments = data.events.tithePayments.filter(
        (p: any) => {
          const commitment = data.events.titheCommitments.find(
            (c: any) => c.commitmentId === p.commitmentId
          )
          return commitment?.giver.toLowerCase() === address.toLowerCase()
        }
      )
      return NextResponse.json({ payments })
    }
    
    if (type === 'organizations') {
      const orgs = data.events.organizations.filter(
        (o: any) => o.verified === true
      )
      return NextResponse.json({ organizations: orgs })
    }
    
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

**Usage in Components**:

```typescript
// Frontend component
const [commitments, setCommitments] = useState([])

useEffect(() => {
  if (!address) return
  
  fetch(`/api/events?type=commitments&address=${address}`)
    .then(res => res.json())
    .then(data => setCommitments(data.commitments))
}, [address])
```

### Task 5: My Commitments Integration (1 hour)

**File**: `frontend/src/app/my-commitments/page.tsx`

**Changes**:
1. Fetch real commitments from API
2. Add pause/resume contract calls
3. Show real execution history

---

## 📋 Quick Testing Checklist

After each integration:

- [ ] Page loads without errors
- [ ] Wallet connects successfully
- [ ] Contract address is correct
- [ ] ABI is loaded properly
- [ ] Transaction prompts in wallet
- [ ] Transaction confirms on Base Sepolia
- [ ] Success state shows correct data
- [ ] Block explorer link works

---

## 🔍 Debugging Tips

### Common Issues

**1. "Contract function not found"**
- Check ABI is imported correctly
- Verify function name matches contract
- Ensure contract address is correct

**2. "Insufficient funds"**
- Need Base Sepolia ETH from faucet
- Check if value is set correctly
- Verify gas estimation

**3. "Wrong network"**
- Add network switcher component
- Check if chain ID is 84532
- Prompt user to switch network

**4. "Transaction reverted"**
- Check contract requirements (e.g., organization verified)
- Verify parameters are correct
- Check contract state (e.g., not paused)

### Debugging Tools

```typescript
// Add logging
console.log('Contract config:', CONTRACTS.tithe)
console.log('Transaction args:', args)
console.log('Transaction hash:', hash)

// Check contract state
const { data: isPaused } = useReadContract({
  ...CONTRACTS.tithe,
  functionName: 'paused',
})
console.log('Contract paused?', isPaused)
```

---

## 🎯 Success Criteria

**Phase 1 Complete** when:
- ✅ Frontend merged to main
- ✅ Contracts configured
- ✅ Wallet connects to Base Sepolia
- ✅ Register Church works end-to-end
- ✅ One real transaction confirmed

**Phase 2 Complete** when:
- ✅ Create Tithe works end-to-end
- ✅ My Commitments shows real data
- ✅ Event indexer API working

**Phase 3 Complete** when:
- ✅ All 7 pages integrated
- ✅ All features working on testnet
- ✅ Demo-ready for hackathon

---

## 📞 Need Help?

**Documentation**:
- [Wagmi Docs](https://wagmi.sh/)
- [Viem Docs](https://viem.sh/)
- [Our Integration Guide](./INTEGRATION_GUIDE.md)
- [Our Security Review](./SECURITY_REVIEW.md)

**Contracts**:
- Deployment addresses in `deployments/baseSepolia-84532.json`
- Contract code in `contracts/`
- Test data in `test-data.json`

---

## 🚀 Let's Get Started!

**Recommended First Task**: Merge frontend and setup contracts config

**Time Required**: 30 minutes  
**Risk**: Low  
**Impact**: Unlocks all other integration work

**Ready?** Let's do this! 🎉

---

**Created**: October 4, 2025  
**Status**: ✅ **Ready to Execute**  
**Next**: Merge frontend branch

