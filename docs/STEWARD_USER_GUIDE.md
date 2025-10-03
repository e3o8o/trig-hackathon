# 📖 Steward User Guide

**Complete Guide to Using Trig Protocol + Steward Contracts**

---

## 🎯 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [For Organizations](#for-organizations)
4. [For Verifiers](#for-verifiers)
5. [For Givers](#for-givers)
6. [For Mission Travelers](#for-mission-travelers)
7. [Contract Functions Reference](#contract-functions-reference)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## 🌟 Introduction

### What is Steward?

Steward is a blockchain-based platform for:
- **Automated Tithing**: Set it and forget it recurring donations
- **Mission Protection**: Parametric insurance for mission trips
- **Organization Verification**: Community-verified ministry organizations
- **Transparent Giving**: On-chain tracking of all donations

### Core Contracts

1. **TrigImmutableCore** - Parametric condition execution engine
2. **StewardOracleRegistry** - Organization verification & reputation
3. **AutomatedTithe** - Recurring donation automation
4. **MissionProtection** - Mission trip insurance policies

### Deployed on Base Sepolia Testnet

```
TrigImmutableCore:      0x0932b427fce27cAf69b36BAd1C33325835740DE0
StewardOracleRegistry:  0xd17e248f1De95D944c24c8AD5A609A460E7A2a41
AutomatedTithe:         0xF13D32355F9B8a9889B5D3C745529f4bf4558E66
MissionProtection:      0x5a8278171AAfC8477f9Ff9621fe8eB4e2723C50e
```

---

## 🚀 Getting Started

### Prerequisites

1. **Web3 Wallet**: MetaMask, Rainbow, or similar
2. **Base Sepolia ETH**: Get from faucet at https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
3. **Basic Understanding**: Blockchain transactions and gas fees

### Network Setup

**Network Name**: Base Sepolia  
**RPC URL**: https://sepolia.base.org  
**Chain ID**: 84532  
**Currency Symbol**: ETH  
**Block Explorer**: https://sepolia.basescan.org

### Getting Test ETH

1. Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Enter your wallet address
3. Complete verification
4. Receive 0.2 ETH (usually within minutes)

---

## ⛪ For Organizations

### Step 1: Register Your Organization

**Requirements**:
- 0.1 ETH minimum stake
- Organization name (max 100 characters)
- Description (max 500 characters)
- Website URL (max 100 characters)

**How to Register**:

```javascript
// Using ethers.js
const stake = ethers.parseEther("0.1"); // 0.1 ETH
const tx = await oracleRegistry.registerOrganization(
    "Grace Community Church",
    "A vibrant community church serving our local area",
    "https://gracecommunity.org",
    { value: stake }
);
await tx.wait();
```

**What Happens**:
1. Your 0.1 ETH stake is locked in the contract
2. Organization profile is created
3. Status: **PENDING** (needs 3 verifications)
4. Event emitted: `OrganizationRegistered`

### Step 2: Get Verified

**Verification Requirements**:
- 3 independent verifier approvals
- Verifiers must have 0.5 ETH stake each
- Each verifier can only approve once

**How to Find Verifiers**:
1. Join Steward Discord/Telegram
2. Submit verification request with documentation
3. Wait for community verifiers to review
4. Track verification status on-chain

**After Verification**:
- ✅ Status: **VERIFIED**
- ✅ Can receive tithe commitments
- ✅ Can be included in mission protection policies
- ✅ Visible in verified organizations list

### Step 3: Receive Donations

**Automatic Tithe Payments**:
- Givers create commitments to your organization
- Payments execute automatically (weekly, monthly, etc.)
- ETH sent directly to your organization address
- Track all donations via events

**Viewing Your Donations**:

```javascript
// Get all commitments to your organization
const commitments = await tithe.getOrganizationCommitments(orgAddress);

// Get total received
const totalReceived = await tithe.totalAmountGiven();
```

### Step 4: Manage Your Profile

**Update Leaders** (if supported):
```javascript
await oracleRegistry.addLeader(leaderAddress);
await oracleRegistry.removeLeader(leaderAddress);
```

**Withdraw Stake** (if leaving):
```javascript
await oracleRegistry.withdrawStake(yourAddress);
// Note: May have waiting period
```

---

## 🛡️ For Verifiers

### Becoming a Verifier

**Requirements**:
- 0.5 ETH minimum stake
- Good reputation (track record)
- Commitment to verify honestly

**Registration**:

```javascript
const stake = ethers.parseEther("0.5");
const tx = await oracleRegistry.registerVerifier({ value: stake });
await tx.wait();
// You now have VERIFIER_ROLE
```

### Verifying Organizations

**Process**:
1. Review organization's documentation
2. Verify legitimacy (website, social media, etc.)
3. Check for red flags
4. Submit on-chain verification

**Submit Verification**:

```javascript
await oracleRegistry.verifyOrganization(organizationAddress);
// Your verification is recorded
```

**Important**:
- ⚠️ You can only verify each organization ONCE
- ⚠️ False verifications can result in slashing
- ⚠️ Your stake is at risk if you verify malicious orgs

### Earning & Reputation

**Benefits**:
- Help build trusted community
- Earn reputation points
- Contribute to ecosystem security

**Risks**:
- Slashing for bad verifications
- Loss of verifier status if stake falls below minimum

---

## 💝 For Givers

### Creating a Tithe Commitment

**Choose Your Frequency**:
- WEEKLY (0) - Every 7 days
- BIWEEKLY (1) - Every 14 days
- MONTHLY (2) - Every 30 days
- QUARTERLY (3) - Every 90 days
- YEARLY (4) - Every 365 days

**Create Commitment**:

```javascript
const amount = ethers.parseEther("0.01"); // 0.01 ETH per payment
const frequency = 2; // MONTHLY
const endTime = 0; // 0 = indefinite, or timestamp

const tx = await tithe.createCommitment(
    organizationAddress,
    amount,
    ethers.ZeroAddress, // ETH (use token address for ERC20)
    frequency,
    endTime,
    { value: amount } // First payment
);
await tx.wait();
```

**What Happens**:
1. First payment executes immediately
2. Commitment is recorded on-chain
3. Subsequent payments due at regular intervals
4. Anyone can execute due payments (gas incentive)

### Managing Your Commitments

**Pause a Commitment**:
```javascript
await tithe.pauseCommitment(commitmentId);
// Pauses future payments
```

**Resume a Commitment**:
```javascript
await tithe.resumeCommitment(commitmentId);
// Resumes payments
```

**Cancel a Commitment**:
```javascript
await tithe.cancelCommitment(commitmentId);
// Permanently ends commitment
```

**View Your Commitments**:
```javascript
const commitments = await tithe.getGiverCommitments(yourAddress);
```

### Executing Payments

**Anyone Can Execute**:
```javascript
// Check if payment is due
const isDue = await tithe.isPaymentDue(commitmentId);

if (isDue) {
    const commitment = await tithe.getCommitment(commitmentId);
    await tithe.executeTithePayment(
        commitmentId,
        { value: commitment.amount } // Send payment amount
    );
}
```

**Why Allow Anyone?**:
- Enables automation services
- Gas incentive for executors
- You don't have to remember

---

## ✈️ For Mission Travelers

### Purchasing Mission Protection

**Policy Types**:
- MISSION_TRIP (0) - Short-term mission trips
- LONG_TERM_MISSION (1) - Multi-month assignments
- RELIEF_OPERATION (2) - Disaster relief
- CONFERENCE (3) - Ministry conferences
- OTHER (4) - Other ministry events

**Calculate Premium**:
```javascript
const coverage = ethers.parseEther("1"); // 1 ETH coverage
const premium = await mission.calculatePremium(coverage);
// Premium = coverage * 2% = 0.02 ETH
```

**Purchase Policy**:

```javascript
const currentTime = Math.floor(Date.now() / 1000);
const startDate = currentTime + 86400; // Tomorrow
const endDate = startDate + (7 * 86400); // 1 week trip

const tx = await mission.purchasePolicy(
    organizationAddress, // Your sending organization
    0, // MISSION_TRIP
    "Summer Mission Trip to Guatemala",
    "Guatemala City, Guatemala",
    startDate,
    endDate,
    coverage,
    ethers.ZeroAddress, // ETH
    { value: premium }
);
await tx.wait();
```

### Filing a Claim

**When to File**:
- Trip cancelled due to covered reason
- Emergency evacuation needed
- Medical emergency during trip
- Other covered events

**Submit Claim**:

```javascript
const claimAmount = ethers.parseEther("0.5"); // Partial claim

const tx = await mission.submitClaim(
    policyId,
    claimAmount,
    "Trip cancelled due to civil unrest. Embassy advisory issued."
);
await tx.wait();
```

**What Happens Next**:
1. Claim is recorded on-chain
2. Owner reviews claim evidence
3. Owner approves or rejects
4. If approved, funds sent automatically

### Cancelling a Policy

**Before Trip Starts**:
```javascript
await mission.cancelPolicy(policyId);
// 90% refund (10% cancellation fee)
```

**After Trip Starts**:
- No refund available
- Can still file claims during coverage period

---

## 📚 Contract Functions Reference

### TrigImmutableCore

**Create Condition**:
```solidity
function createCondition(
    ConditionType _conditionType,
    bytes calldata _triggerData,
    uint256 _payoutAmount,
    address _payoutToken,
    uint256 _expirationTime
) external payable returns (uint256)
```

**Execute Condition**:
```solidity
function executeCondition(uint256 _conditionId) external
```

**Cancel Condition**:
```solidity
function cancelCondition(uint256 _conditionId) external
```

### StewardOracleRegistry

**Register Organization**:
```solidity
function registerOrganization(
    string calldata _name,
    string calldata _description,
    string calldata _website
) external payable
```

**Register Verifier**:
```solidity
function registerVerifier() external payable
```

**Verify Organization**:
```solidity
function verifyOrganization(address _organization) external
```

**Check Verification**:
```solidity
function isOrganizationVerified(address _organization) 
    external 
    view 
    returns (bool)
```

### AutomatedTithe

**Create Commitment**:
```solidity
function createCommitment(
    address _organization,
    uint256 _amount,
    address _token,
    Frequency _frequency,
    uint256 _endTime
) external payable returns (uint256)
```

**Execute Payment**:
```solidity
function executeTithePayment(uint256 _commitmentId) external payable
```

**Pause/Resume**:
```solidity
function pauseCommitment(uint256 _commitmentId) external
function resumeCommitment(uint256 _commitmentId) external
```

### MissionProtection

**Purchase Policy**:
```solidity
function purchasePolicy(
    address _organization,
    EventType _eventType,
    string calldata _eventName,
    string calldata _location,
    uint256 _startDate,
    uint256 _endDate,
    uint256 _coverageAmount,
    address _paymentToken
) external payable returns (uint256)
```

**Submit Claim**:
```solidity
function submitClaim(
    uint256 _policyId,
    uint256 _claimAmount,
    string calldata _reason
) external
```

**Cancel Policy**:
```solidity
function cancelPolicy(uint256 _policyId) external
```

---

## 🔧 Troubleshooting

### Common Errors

**"Organization not verified"**
- Your organization needs 3 verifier approvals
- Contact verifiers in the community
- Provide documentation for verification

**"Payment not due yet"**
- Wait until payment interval has passed
- Check `isPaymentDue(commitmentId)`
- Last payment time + frequency must have passed

**"Insufficient contract balance"**
- MissionProtection contract needs funds to pay claims
- DeFi backing integration coming soon
- Contact admin to add liquidity

**"Commitment not active"**
- Check if commitment is paused
- Check if commitment has ended
- Use `getCommitment()` to see status

**"Already verified by you"**
- Each verifier can only verify an organization once
- Cannot verify same org multiple times

### Gas Optimization Tips

**Batch Operations**:
- Create multiple commitments in one session
- Execute multiple due payments together
- Group administrative actions

**Timing**:
- Execute during low network congestion
- Use gas price estimators
- Set reasonable gas limits

### Transaction Failed?

**Check**:
1. Sufficient ETH for gas + payment
2. Correct contract address
3. Valid parameters (amounts, addresses)
4. Network status (Base Sepolia operational)
5. Wallet connection

**Retry**:
- Increase gas limit slightly
- Wait for network congestion to clear
- Check transaction on block explorer

---

## ❓ FAQ

### General

**Q: Is this on mainnet?**  
A: Currently on Base Sepolia testnet. Mainnet deployment after security audit.

**Q: What are the fees?**  
A: Only gas fees. No protocol fees (for now).

**Q: Can I use tokens other than ETH?**  
A: Yes! All contracts support ERC20 tokens. Just pass token address instead of `ethers.ZeroAddress`.

### Organizations

**Q: How long does verification take?**  
A: Depends on verifier availability. Usually 1-7 days.

**Q: Can I update my organization info?**  
A: Not currently. Register new org if needed.

**Q: What happens to my stake?**  
A: Locked while registered. Can withdraw when leaving.

### Givers

**Q: Can I have multiple commitments?**  
A: Yes! Unlimited commitments to different or same organizations.

**Q: What if I run out of ETH?**  
A: Payment execution will fail. Top up your wallet.

**Q: Can I change commitment amount?**  
A: No. Cancel and create new commitment with different amount.

### Mission Travelers

**Q: What events are covered?**  
A: Check policy terms. Generally: cancellations, evacuations, medical emergencies.

**Q: How fast are claims processed?**  
A: Manual review by owner. Usually 1-3 days.

**Q: Can I get a refund after trip starts?**  
A: No. Cancellations only before trip start date.

### Technical

**Q: Why use blockchain?**  
A: Transparency, automation, immutability, global access.

**Q: What if I lose my private key?**  
A: Funds are lost. Use hardware wallet for large amounts.

**Q: Can contracts be upgraded?**  
A: No. Immutable by design. New versions require redeployment.

---

## 📞 Support

### Community
- Discord: [Join Here]
- Telegram: [Join Here]
- Twitter: [@TrigProtocol]

### Documentation
- Technical Docs: `/docs/`
- Architecture: `ARCHITECTURE.md`
- Security Review: `SECURITY_REVIEW.md`

### Code
- GitHub: https://github.com/e3o8o/trig-hackathon
- Block Explorer: https://sepolia.basescan.org

---

## 🎯 Quick Start Checklist

**For Organizations**:
- [ ] Get 0.1 ETH from faucet
- [ ] Register organization
- [ ] Submit verification docs
- [ ] Wait for 3 verifications
- [ ] Start receiving donations!

**For Givers**:
- [ ] Get test ETH
- [ ] Find verified organization
- [ ] Create tithe commitment
- [ ] Set it and forget it!

**For Mission Travelers**:
- [ ] Get test ETH
- [ ] Calculate coverage needed
- [ ] Purchase policy
- [ ] Keep receipts for claims

---

**Last Updated**: October 3, 2025  
**Version**: 1.0 (Hackathon MVP)  
**Network**: Base Sepolia Testnet

