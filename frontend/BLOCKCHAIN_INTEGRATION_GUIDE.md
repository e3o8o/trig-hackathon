# Blockchain Integration Guide - Churches & Mission Protection

## Overview
This guide explains how to migrate from static demo data to blockchain-based church registry and mission protection.

**Current State**: Demo mode with static data  
**Target State**: Fully blockchain-integrated  
**Estimated Time**: 2-4 hours per feature

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐             │
│  │ ChurchRegistry   │    │ MissionProtection│             │
│  │   Contract       │◄───┤    Contract      │             │
│  └──────────────────┘    └──────────────────┘             │
│         │                         │                         │
│         │ registerChurch()        │ purchasePolicy()       │
│         │ verifyLeader()          │ fileClai()            │
│         │ getVerifiedChurches()   │ verifyClaim()         │
│         │                         │                         │
└─────────┼─────────────────────────┼─────────────────────────┘
          │                         │
          ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Register     │  │  Create      │  │  Mission     │     │
│  │  Church      │  │   Tithe      │  │ Protection   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                   useChurches() hook                        │
│                            │                                 │
│                    wagmi + viem                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Migration

### Phase 1: Smart Contract Development

#### 1. ChurchRegistry Contract

```solidity
// contracts/ChurchRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChurchRegistry {
    struct Church {
        address churchAddress;
        string name;
        string streetAddress;
        string city;
        string stateProvince;
        string country;
        string denomination;
        uint256 stakeAmount;
        uint256 registeredAt;
        bool verified;
        address[] verifiedLeaders;
    }
    
    mapping(address => Church) public churches;
    address[] public churchAddresses;
    
    uint256 public constant STAKE_AMOUNT = 1 ether;
    
    event ChurchRegistered(address indexed churchAddress, string name);
    event LeaderVerified(address indexed churchAddress, address indexed leader);
    
    function registerChurch(
        string memory name,
        string memory streetAddress,
        string memory city,
        string memory stateProvince,
        string memory country,
        string memory denomination
    ) external payable {
        require(msg.value >= STAKE_AMOUNT, "Must stake 1 ETH");
        require(churches[msg.sender].churchAddress == address(0), "Already registered");
        
        churches[msg.sender] = Church({
            churchAddress: msg.sender,
            name: name,
            streetAddress: streetAddress,
            city: city,
            stateProvince: stateProvince,
            country: country,
            denomination: denomination,
            stakeAmount: msg.value,
            registeredAt: block.timestamp,
            verified: true, // Auto-verified upon stake
            verifiedLeaders: new address[](0)
        });
        
        churchAddresses.push(msg.sender);
        
        emit ChurchRegistered(msg.sender, name);
    }
    
    function verifyLeader(address leader) external payable {
        require(churches[msg.sender].verified, "Church not verified");
        require(msg.value >= 0.1 ether, "Leader must stake 0.1 ETH");
        
        churches[msg.sender].verifiedLeaders.push(leader);
        
        emit LeaderVerified(msg.sender, leader);
    }
    
    function getVerifiedChurches() external view returns (Church[] memory) {
        uint256 verifiedCount = 0;
        
        // Count verified churches
        for (uint256 i = 0; i < churchAddresses.length; i++) {
            if (churches[churchAddresses[i]].verified) {
                verifiedCount++;
            }
        }
        
        // Create array of verified churches
        Church[] memory verifiedChurches = new Church[](verifiedCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < churchAddresses.length; i++) {
            if (churches[churchAddresses[i]].verified) {
                verifiedChurches[index] = churches[churchAddresses[i]];
                index++;
            }
        }
        
        return verifiedChurches;
    }
    
    function getChurchById(address churchAddress) external view returns (Church memory) {
        return churches[churchAddress];
    }
    
    function isChurchVerified(address churchAddress) external view returns (bool) {
        return churches[churchAddress].verified;
    }
    
    function getVerifiedLeaders(address churchAddress) external view returns (address[] memory) {
        return churches[churchAddress].verifiedLeaders;
    }
}
```

#### 2. MissionProtection Contract

```solidity
// contracts/MissionProtection.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ChurchRegistry.sol";

contract MissionProtection {
    ChurchRegistry public churchRegistry;
    
    struct Policy {
        uint256 policyId;
        address missionary;
        address churchAddress;
        string destination;
        string country;
        uint256 startDate;
        uint256 endDate;
        uint256 coverageAmount;
        uint256 premiumPaid;
        string tripPurpose;
        bool active;
        uint256 purchasedAt;
    }
    
    struct Claim {
        uint256 claimId;
        uint256 policyId;
        address missionary;
        string evidence;
        uint256 claimAmount;
        uint256 approvals;
        mapping(address => bool) hasApproved;
        bool paid;
        uint256 filedAt;
    }
    
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    uint256 public nextPolicyId = 1;
    uint256 public nextClaimId = 1;
    
    uint256 public constant REQUIRED_APPROVALS = 2; // 2-of-3 multisig
    
    event PolicyPurchased(uint256 indexed policyId, address indexed missionary, uint256 coverageAmount);
    event ClaimFiled(uint256 indexed claimId, uint256 indexed policyId, address indexed missionary);
    event ClaimApproved(uint256 indexed claimId, address indexed approver);
    event ClaimPaid(uint256 indexed claimId, uint256 amount);
    
    constructor(address _churchRegistry) {
        churchRegistry = ChurchRegistry(_churchRegistry);
    }
    
    function purchasePolicy(
        address churchAddress,
        string memory destination,
        string memory country,
        uint256 startDate,
        uint256 endDate,
        uint256 coverageAmount,
        string memory tripPurpose
    ) external payable {
        require(msg.value > 0, "Premium required");
        require(coverageAmount > 0, "Coverage amount required");
        
        policies[nextPolicyId] = Policy({
            policyId: nextPolicyId,
            missionary: msg.sender,
            churchAddress: churchAddress,
            destination: destination,
            country: country,
            startDate: startDate,
            endDate: endDate,
            coverageAmount: coverageAmount,
            premiumPaid: msg.value,
            tripPurpose: tripPurpose,
            active: true,
            purchasedAt: block.timestamp
        });
        
        emit PolicyPurchased(nextPolicyId, msg.sender, coverageAmount);
        nextPolicyId++;
    }
    
    function fileClaim(
        uint256 policyId,
        string memory evidence,
        uint256 claimAmount
    ) external {
        Policy storage policy = policies[policyId];
        require(policy.missionary == msg.sender, "Not policy owner");
        require(policy.active, "Policy not active");
        require(claimAmount <= policy.coverageAmount, "Claim exceeds coverage");
        
        claims[nextClaimId].claimId = nextClaimId;
        claims[nextClaimId].policyId = policyId;
        claims[nextClaimId].missionary = msg.sender;
        claims[nextClaimId].evidence = evidence;
        claims[nextClaimId].claimAmount = claimAmount;
        claims[nextClaimId].approvals = 0;
        claims[nextClaimId].paid = false;
        claims[nextClaimId].filedAt = block.timestamp;
        
        emit ClaimFiled(nextClaimId, policyId, msg.sender);
        nextClaimId++;
    }
    
    function approveClaim(uint256 claimId) external {
        Claim storage claim = claims[claimId];
        Policy storage policy = policies[claim.policyId];
        
        // Must be verified church leader
        address[] memory leaders = churchRegistry.getVerifiedLeaders(policy.churchAddress);
        bool isLeader = false;
        for (uint256 i = 0; i < leaders.length; i++) {
            if (leaders[i] == msg.sender) {
                isLeader = true;
                break;
            }
        }
        require(isLeader, "Not a verified leader");
        require(!claim.hasApproved[msg.sender], "Already approved");
        require(!claim.paid, "Claim already paid");
        
        claim.hasApproved[msg.sender] = true;
        claim.approvals++;
        
        emit ClaimApproved(claimId, msg.sender);
        
        // Auto-pay if threshold reached
        if (claim.approvals >= REQUIRED_APPROVALS) {
            _payClaim(claimId);
        }
    }
    
    function _payClaim(uint256 claimId) internal {
        Claim storage claim = claims[claimId];
        require(!claim.paid, "Already paid");
        require(claim.approvals >= REQUIRED_APPROVALS, "Insufficient approvals");
        
        claim.paid = true;
        policies[claim.policyId].active = false;
        
        (bool success, ) = claim.missionary.call{value: claim.claimAmount}("");
        require(success, "Payment failed");
        
        emit ClaimPaid(claimId, claim.claimAmount);
    }
}
```

---

### Phase 2: Frontend Integration

#### 1. Create Custom Hook

```typescript
// src/hooks/useChurches.ts
import { useReadContract } from 'wagmi'
import { CHURCH_REGISTRY_ADDRESS } from '@/config/contracts'
import { churchRegistryAbi } from '@/config/abis'

export interface Church {
  churchAddress: string
  name: string
  streetAddress: string
  city: string
  stateProvince: string
  country: string
  denomination: string
  stakeAmount: bigint
  registeredAt: bigint
  verified: boolean
  verifiedLeaders: string[]
}

export function useChurches() {
  const { 
    data: churches, 
    isLoading, 
    isError,
    refetch 
  } = useReadContract({
    address: CHURCH_REGISTRY_ADDRESS,
    abi: churchRegistryAbi,
    functionName: 'getVerifiedChurches',
  })

  // Transform blockchain data to frontend format
  const formattedChurches = (churches as Church[] || []).map(church => ({
    id: church.churchAddress,
    name: church.name,
    location: `${church.city}, ${church.stateProvince}`,
    denomination: church.denomination,
    verified: church.verified
  }))

  return {
    churches: formattedChurches,
    rawChurches: churches,
    isLoading,
    isError,
    refetch
  }
}
```

#### 2. Update Mission Protection Page

```typescript
// src/app/mission-protection/page.tsx

// Remove static list:
// const VERIFIED_CHURCHES = [...]

// Add hook:
import { useChurches } from '@/hooks/useChurches'

export default function MissionProtection() {
  // ... existing state
  
  const { churches: VERIFIED_CHURCHES, isLoading: churchesLoading } = useChurches()
  
  // Show loading state
  if (churchesLoading) {
    return <div>Loading churches...</div>
  }
  
  // Rest of component stays the same!
  // The dropdown will automatically use blockchain data
}
```

#### 3. Update Purchase Function

```typescript
// In MissionProtection component

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { MISSION_PROTECTION_ADDRESS } from '@/config/contracts'
import { missionProtectionAbi } from '@/config/abis'

const { writeContract, data: hash } = useWriteContract()

const handleSubmit = async () => {
  setIsProcessing(true)
  
  try {
    // Calculate premium in Wei
    const premiumWei = parseEther(premium.toString())
    
    // Call smart contract
    writeContract({
      address: MISSION_PROTECTION_ADDRESS,
      abi: missionProtectionAbi,
      functionName: 'purchasePolicy',
      args: [
        formData.churchId || '0x0000000000000000000000000000000000000000',
        formData.destination,
        formData.country,
        Math.floor(new Date(formData.startDate).getTime() / 1000),
        Math.floor(new Date(formData.endDate).getTime() / 1000),
        parseEther(formData.coverageAmount),
        formData.tripPurpose
      ],
      value: premiumWei
    })
  } catch (error) {
    console.error('Purchase failed:', error)
    setIsProcessing(false)
  }
}

// Wait for transaction
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
  hash,
})

// Update UI when transaction succeeds
useEffect(() => {
  if (isSuccess) {
    setPolicyId(`POLICY-${hash}`)
    setIsProcessing(false)
    setStep('success')
  }
}, [isSuccess])
```

---

### Phase 3: Configuration

#### 1. Contract Addresses

```typescript
// src/config/contracts.ts
export const CHURCH_REGISTRY_ADDRESS = '0x...' as const
export const MISSION_PROTECTION_ADDRESS = '0x...' as const
export const TRIG_PROTOCOL_ADDRESS = '0x...' as const
```

#### 2. ABIs

```typescript
// src/config/abis/churchRegistry.ts
export const churchRegistryAbi = [
  {
    inputs: [],
    name: 'getVerifiedChurches',
    outputs: [
      {
        components: [
          { name: 'churchAddress', type: 'address' },
          { name: 'name', type: 'string' },
          // ... other fields
        ],
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // ... other functions
] as const
```

---

## 🔄 Migration Checklist

### Contracts
- [ ] Write ChurchRegistry contract
- [ ] Write MissionProtection contract
- [ ] Write tests
- [ ] Deploy to testnet
- [ ] Verify contracts
- [ ] Deploy to mainnet

### Frontend
- [ ] Create useChurches hook
- [ ] Update mission-protection/page.tsx
- [ ] Update create-tithe/page.tsx
- [ ] Update register-church/page.tsx
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test with testnet
- [ ] Deploy to production

### Integration
- [ ] Connect Trig Protocol
- [ ] Test end-to-end flow
- [ ] Verify claim system works
- [ ] Test premium calculations
- [ ] Verify payout system

---

## 🎯 Benefits of Blockchain Integration

1. **Trustless**: No central authority controls church list
2. **Transparent**: All registrations on-chain
3. **Immutable**: Records cannot be altered
4. **Automated**: Claims paid automatically via smart contract
5. **Verifiable**: Anyone can verify church registration
6. **Stakeholder Aligned**: Staking creates accountability

---

## 📊 Data Flow (Production)

```
User Action: Register Church
       │
       ▼
Frontend Form Submission
       │
       ├─> Validate inputs
       ├─> Calculate gas
       └─> Call writeContract()
       │
       ▼
Blockchain Transaction
       │
       ├─> Church pays 1 ETH stake
       ├─> Data written to contract
       └─> Event emitted
       │
       ▼
Transaction Confirmed
       │
       ├─> Frontend detects confirmation
       ├─> Updates UI
       └─> Church now in registry
       │
       ▼
Other Users: Mission Protection
       │
       ├─> Call getVerifiedChurches()
       ├─> Receive updated list
       └─> See newly registered church
```

---

## 🚨 Important Notes

### Security
- Always validate on-chain, not just frontend
- Use SafeMath for calculations
- Implement reentrancy guards
- Test extensively before mainnet

### Gas Optimization
- Batch church queries where possible
- Cache church data in frontend
- Use events for historical data
- Consider layer 2 solutions

### User Experience
- Show transaction progress
- Handle failures gracefully
- Provide clear error messages
- Allow transaction retry

---

This guide provides everything needed to migrate from demo mode to full blockchain integration! 🚀
