# 🔌 Steward Integration Guide

**Technical Guide for Developers**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Contract ABIs](#contract-abis)
3. [Frontend Integration](#frontend-integration)
4. [Event Listening](#event-listening)
5. [Common Patterns](#common-patterns)
6. [Best Practices](#best-practices)
7. [Error Handling](#error-handling)
8. [Example Code](#example-code)

---

## 🚀 Quick Start

### Installation

```bash
npm install ethers@^6.10.0
# or
npm install viem wagmi @rainbow-me/rainbowkit
```

### Contract Addresses (Base Sepolia)

```typescript
const CONTRACTS = {
  trigCore: "0x0932b427fce27cAf69b36BAd1C33325835740DE0",
  oracle: "0xd17e248f1De95D944c24c8AD5A609A460E7A2a41",
  tithe: "0xF13D32355F9B8a9889B5D3C745529f4bf4558E66",
  mission: "0x5a8278171AAfC8477f9Ff9621fe8eB4e2723C50e"
};

const CHAIN_ID = 84532; // Base Sepolia
```

### Basic Setup (ethers.js v6)

```typescript
import { ethers } from "ethers";

// Connect to Base Sepolia
const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

// Connect wallet
const signer = await provider.getSigner();

// Get contract instance
const oracle = new ethers.Contract(
  CONTRACTS.oracle,
  ORACLE_ABI,
  signer
);
```

---

## 📜 Contract ABIs

### Import from Artifacts

```typescript
import TrigCoreABI from "../artifacts/contracts/core/TrigImmutableCore.sol/TrigImmutableCore.json";
import OracleABI from "../artifacts/contracts/steward/StewardOracleRegistry.sol/StewardOracleRegistry.json";
import TitheABI from "../artifacts/contracts/steward/AutomatedTithe.sol/AutomatedTithe.json";
import MissionABI from "../artifacts/contracts/steward/MissionProtection.sol/MissionProtection.json";

const TrigCore = new ethers.Contract(CONTRACTS.trigCore, TrigCoreABI.abi, signer);
```

### Key Function Signatures

**TrigImmutableCore**:
```typescript
createCondition(
  conditionType: number,
  triggerData: BytesLike,
  payoutAmount: bigint,
  payoutToken: string,
  expirationTime: number
): Promise<ContractTransaction>

executeCondition(conditionId: bigint): Promise<ContractTransaction>
cancelCondition(conditionId: bigint): Promise<ContractTransaction>
getCondition(conditionId: bigint): Promise<Condition>
```

**StewardOracleRegistry**:
```typescript
registerOrganization(
  name: string,
  description: string,
  website: string
): Promise<ContractTransaction>

registerVerifier(): Promise<ContractTransaction>
verifyOrganization(organization: string): Promise<ContractTransaction>
isOrganizationVerified(organization: string): Promise<boolean>
```

**AutomatedTithe**:
```typescript
createCommitment(
  organization: string,
  amount: bigint,
  token: string,
  frequency: number,
  endTime: number
): Promise<ContractTransaction>

executeTithePayment(commitmentId: bigint): Promise<ContractTransaction>
pauseCommitment(commitmentId: bigint): Promise<ContractTransaction>
getCommitment(commitmentId: bigint): Promise<Commitment>
```

**MissionProtection**:
```typescript
purchasePolicy(
  organization: string,
  eventType: number,
  eventName: string,
  location: string,
  startDate: number,
  endDate: number,
  coverageAmount: bigint,
  paymentToken: string
): Promise<ContractTransaction>

submitClaim(
  policyId: bigint,
  claimAmount: bigint,
  reason: string
): Promise<ContractTransaction>
```

---

## 🎨 Frontend Integration

### React Hooks (Wagmi)

```typescript
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import ORACLE_ABI from './abis/StewardOracleRegistry.json';

// Read data
function useIsVerified(address: string) {
  return useContractRead({
    address: CONTRACTS.oracle,
    abi: ORACLE_ABI,
    functionName: 'isOrganizationVerified',
    args: [address],
  });
}

// Write transaction
function useRegisterOrg() {
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.oracle,
    abi: ORACLE_ABI,
    functionName: 'registerOrganization',
    args: ['Church Name', 'Description', 'https://website.com'],
    value: parseEther('0.1'),
  });

  return useContractWrite(config);
}
```

### Component Example

```typescript
function OrganizationCard({ address }: { address: string }) {
  const { data: isVerified } = useIsVerified(address);
  const { data: org } = useContractRead({
    address: CONTRACTS.oracle,
    abi: ORACLE_ABI,
    functionName: 'getOrganization',
    args: [address],
  });

  return (
    <div>
      <h3>{org?.name}</h3>
      <p>{org?.description}</p>
      {isVerified ? (
        <span className="verified">✅ Verified</span>
      ) : (
        <span className="pending">⏳ Pending</span>
      )}
    </div>
  );
}
```

---

## 📡 Event Listening

### Using Ethers.js

```typescript
// Listen for organization registrations
oracle.on("OrganizationRegistered", (organization, name, stake, event) => {
  console.log(`New org: ${name} (${organization})`);
  console.log(`Stake: ${ethers.formatEther(stake)} ETH`);
  
  // Update UI
  updateOrganizationList();
});

// Listen for verifications
oracle.on("OrganizationVerified", (organization, verifier, event) => {
  console.log(`${organization} verified by ${verifier}`);
  
  // Check if fully verified
  checkVerificationStatus(organization);
});

// Listen for tithe payments
tithe.on("TithePaid", (commitmentId, organization, amount, event) => {
  console.log(`Payment: ${ethers.formatEther(amount)} ETH → ${organization}`);
  
  // Update giving history
  updateGivingHistory();
});
```

### Event Filtering

```typescript
// Get historical events
const filter = oracle.filters.OrganizationRegistered(null, null, null);
const events = await oracle.queryFilter(filter, fromBlock, toBlock);

events.forEach(event => {
  console.log(event.args);
});

// Filter by specific organization
const orgFilter = tithe.filters.TithePaid(null, organizationAddress, null);
const payments = await tithe.queryFilter(orgFilter);
```

### Using Event Indexer

```typescript
import { EventIndexer } from './scripts/indexer/event-indexer';

const indexer = new EventIndexer();
await indexer.loadExistingData();

// Query indexed data
const verifiedOrgs = indexer.getVerifiedOrganizations();
const userCommitments = indexer.getTitheCommitmentsByGiver(address);
const orgDonations = indexer.getTitheCommitmentsByOrganization(orgAddress);
```

---

## 🔄 Common Patterns

### 1. Register and Verify Organization

```typescript
async function registerAndWaitForVerification(
  name: string,
  description: string,
  website: string
) {
  // Step 1: Register
  const stake = ethers.parseEther("0.1");
  const tx = await oracle.registerOrganization(
    name,
    description,
    website,
    { value: stake }
  );
  await tx.wait();
  
  const orgAddress = await signer.getAddress();
  console.log(`Registered: ${orgAddress}`);
  
  // Step 2: Listen for verifications
  return new Promise((resolve) => {
    let verificationCount = 0;
    
    oracle.on("OrganizationVerified", async (org, verifier) => {
      if (org === orgAddress) {
        verificationCount++;
        console.log(`Verification ${verificationCount}/3 from ${verifier}`);
        
        if (verificationCount >= 3) {
          const isVerified = await oracle.isOrganizationVerified(orgAddress);
          if (isVerified) {
            oracle.removeAllListeners("OrganizationVerified");
            resolve(true);
          }
        }
      }
    });
  });
}
```

### 2. Create Recurring Tithe

```typescript
async function setupMonthlyTithe(
  organization: string,
  monthlyAmount: string
) {
  const amount = ethers.parseEther(monthlyAmount);
  const frequency = 2; // MONTHLY
  const endTime = 0; // Indefinite
  
  // Check organization is verified
  const isVerified = await oracle.isOrganizationVerified(organization);
  if (!isVerified) {
    throw new Error("Organization not verified");
  }
  
  // Create commitment
  const tx = await tithe.createCommitment(
    organization,
    amount,
    ethers.ZeroAddress, // ETH
    frequency,
    endTime,
    { value: amount } // First payment
  );
  
  const receipt = await tx.wait();
  
  // Get commitment ID from event
  const event = receipt.logs.find(
    log => log.topics[0] === tithe.interface.getEvent("CommitmentCreated").topicHash
  );
  const commitmentId = event.args.commitmentId;
  
  console.log(`Created commitment #${commitmentId}`);
  return commitmentId;
}
```

### 3. Purchase Mission Protection

```typescript
async function purchaseMissionPolicy(
  organization: string,
  eventName: string,
  location: string,
  coverage: string,
  tripDuration: number // days
) {
  const coverageAmount = ethers.parseEther(coverage);
  const premium = await mission.calculatePremium(coverageAmount);
  
  const now = Math.floor(Date.now() / 1000);
  const startDate = now + 86400; // Tomorrow
  const endDate = startDate + (tripDuration * 86400);
  
  const tx = await mission.purchasePolicy(
    organization,
    0, // MISSION_TRIP
    eventName,
    location,
    startDate,
    endDate,
    coverageAmount,
    ethers.ZeroAddress,
    { value: premium }
  );
  
  const receipt = await tx.wait();
  const event = receipt.logs.find(
    log => log.topics[0] === mission.interface.getEvent("PolicyPurchased").topicHash
  );
  
  const policyId = event.args.policyId;
  console.log(`Policy #${policyId} purchased`);
  console.log(`Premium paid: ${ethers.formatEther(premium)} ETH`);
  
  return policyId;
}
```

### 4. Auto-Execute Due Payments

```typescript
async function executeAllDuePayments() {
  // Get all active commitments
  const commitmentCount = await tithe.commitmentCounter();
  
  for (let i = 0; i < commitmentCount; i++) {
    try {
      const commitment = await tithe.getCommitment(i);
      
      // Skip if not active
      if (commitment.status !== 1) continue; // 1 = ACTIVE
      
      // Check if payment due
      const isDue = await tithe.isPaymentDue(i);
      if (isDue) {
        console.log(`Executing payment for commitment #${i}`);
        
        const tx = await tithe.executeTithePayment(i, {
          value: commitment.amount
        });
        await tx.wait();
        
        console.log(`✅ Payment executed for #${i}`);
      }
    } catch (error) {
      console.error(`Failed to execute #${i}:`, error.message);
    }
  }
}
```

---

## ✅ Best Practices

### 1. Transaction Handling

```typescript
async function safeTransactionExecution<T>(
  txPromise: Promise<T>,
  confirmations: number = 1
): Promise<T> {
  try {
    const tx = await txPromise;
    console.log(`Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait(confirmations);
    console.log(`Confirmed in block ${receipt.blockNumber}`);
    
    return receipt;
  } catch (error) {
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('User rejected transaction');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient funds for gas + value');
    } else {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }
}
```

### 2. Gas Estimation

```typescript
async function estimateGasWithBuffer(
  contract: Contract,
  functionName: string,
  args: any[],
  value?: bigint
): Promise<bigint> {
  const estimated = await contract[functionName].estimateGas(...args, { value });
  
  // Add 20% buffer
  const buffer = (estimated * 20n) / 100n;
  return estimated + buffer;
}
```

### 3. Amount Validation

```typescript
function validateAmount(amount: string): boolean {
  try {
    const parsed = ethers.parseEther(amount);
    return parsed > 0n && parsed < ethers.parseEther("1000000");
  } catch {
    return false;
  }
}

function formatDisplayAmount(wei: bigint, decimals: number = 4): string {
  const eth = ethers.formatEther(wei);
  return parseFloat(eth).toFixed(decimals);
}
```

### 4. Network Checks

```typescript
async function ensureCorrectNetwork(provider: Provider) {
  const network = await provider.getNetwork();
  
  if (network.chainId !== 84532n) {
    throw new Error('Please connect to Base Sepolia (Chain ID: 84532)');
  }
}
```

---

## 🚨 Error Handling

### Common Error Messages

```typescript
const ERROR_MESSAGES: Record<string, string> = {
  "Organization not verified": "This organization needs 3 verifications before accepting donations",
  "Payment not due yet": "Next payment is not yet due. Check back later.",
  "Commitment not active": "This commitment has been paused or cancelled",
  "Insufficient contract balance": "Contract doesn't have enough funds to process this claim",
  "Already verified by you": "You have already verified this organization",
  "Policy has expired": "This policy is no longer active",
};

function getUserFriendlyError(error: Error): string {
  const message = error.message;
  
  // Check for known errors
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (message.includes(key)) {
      return value;
    }
  }
  
  // Generic errors
  if (message.includes("insufficient funds")) {
    return "You don't have enough ETH for this transaction";
  }
  if (message.includes("user rejected")) {
    return "Transaction was cancelled";
  }
  
  return "Transaction failed. Please try again.";
}
```

### Try-Catch Wrapper

```typescript
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorCallback: (error: Error) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error("Operation failed:", error);
    errorCallback(error);
    return null;
  }
}

// Usage
const result = await withErrorHandling(
  () => tithe.createCommitment(...),
  (error) => toast.error(getUserFriendlyError(error))
);
```

---

## 💻 Example Code

### Complete React Component

```typescript
import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther } from 'viem';

export function CreateTitheForm({ organizationAddress }: { organizationAddress: string }) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('0.01');
  const [frequency, setFrequency] = useState(2); // MONTHLY
  
  // Check if organization is verified
  const { data: isVerified } = useContractRead({
    address: CONTRACTS.oracle,
    abi: ORACLE_ABI,
    functionName: 'isOrganizationVerified',
    args: [organizationAddress],
  });
  
  // Prepare transaction
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.tithe,
    abi: TITHE_ABI,
    functionName: 'createCommitment',
    args: [
      organizationAddress,
      parseEther(amount),
      '0x0000000000000000000000000000000000000000', // ETH
      frequency,
      0, // Indefinite
    ],
    value: parseEther(amount),
    enabled: isVerified && parseFloat(amount) > 0,
  });
  
  const { write, isLoading, isSuccess } = useContractWrite(config);
  
  if (!isVerified) {
    return <div>Organization not verified yet</div>;
  }
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); write?.(); }}>
      <input
        type="number"
        step="0.001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (ETH)"
      />
      
      <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))}>
        <option value={0}>Weekly</option>
        <option value={1}>Biweekly</option>
        <option value={2}>Monthly</option>
        <option value={3}>Quarterly</option>
        <option value={4}>Yearly</option>
      </select>
      
      <button type="submit" disabled={!write || isLoading}>
        {isLoading ? 'Creating...' : 'Create Commitment'}
      </button>
      
      {isSuccess && <div>✅ Commitment created!</div>}
    </form>
  );
}
```

### Complete Script

```typescript
import { ethers } from "ethers";
import TitheABI from "./abis/AutomatedTithe.json";

async function main() {
  // Setup
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const tithe = new ethers.Contract(CONTRACTS.tithe, TitheABI, wallet);
  
  // Create commitment
  console.log("Creating monthly tithe commitment...");
  const tx = await tithe.createCommitment(
    "0x...", // organization
    ethers.parseEther("0.01"),
    ethers.ZeroAddress,
    2, // MONTHLY
    0,
    { value: ethers.parseEther("0.01") }
  );
  
  console.log(`Transaction: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`Confirmed in block ${receipt.blockNumber}`);
  
  // Get commitment ID
  const event = receipt.logs.find(
    log => log.topics[0] === tithe.interface.getEvent("CommitmentCreated").topicHash
  );
  const commitmentId = event.args.commitmentId;
  
  console.log(`✅ Commitment created with ID: ${commitmentId}`);
}

main().catch(console.error);
```

---

## 📚 Additional Resources

### Documentation
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [Wagmi Docs](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Base Docs](https://docs.base.org/)

### Tools
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Remix IDE](https://remix.ethereum.org/)

### Examples
- Demo Scripts: `/scripts/demo/`
- Test Files: `/test/`
- Event Indexer: `/scripts/indexer/`

---

**Last Updated**: October 3, 2025  
**Contracts Version**: v1.0 (Hackathon MVP)  
**Network**: Base Sepolia (Chain ID: 84532)

