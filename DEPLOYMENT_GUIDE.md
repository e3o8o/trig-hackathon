# 🚀 Deployment Guide

## Quick Reference

### ✅ **Completed Deployments**

| Network | Status | Address |
|---------|--------|---------|
| Localhost | ✅ Deployed | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| Base Sepolia | ⏳ Ready | Awaiting funds |

---

## 📋 **Prerequisites**

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Required for Base Sepolia deployment
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Optional - for contract verification
BASESCAN_API_KEY=your_basescan_api_key
```

**⚠️ SECURITY WARNING**: Never commit your `.env` file or private keys!

### 2. Get Testnet ETH

To deploy to Base Sepolia, you need testnet ETH:

#### **Option A: Base Sepolia Faucet**
1. Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Connect your wallet
3. Request 0.1 ETH (enough for deployment)

#### **Option B: Bridge from Sepolia**
1. Get Sepolia ETH from: https://sepoliafaucet.com
2. Bridge to Base Sepolia: https://bridge.base.org

---

## 🏠 **Local Deployment**

### Step 1: Start Local Node

```bash
npx hardhat node
```

This starts a local Ethereum node with 20 pre-funded accounts.

### Step 2: Deploy

In a new terminal:

```bash
npm run deploy:local
```

Or:

```bash
npx hardhat run scripts/deploy-core.js --network localhost
```

### Step 3: Verify

Check `deployments/localhost-31337.json` for deployment details.

**✅ Local deployment complete!**

---

## 🌐 **Base Sepolia Testnet Deployment**

### Step 1: Check Balance

```bash
# Check your deployer address balance
npx hardhat run --network baseSepolia scripts/check-balance.js
```

If balance is 0, get testnet ETH (see Prerequisites above).

### Step 2: Deploy

```bash
npm run deploy:sepolia
```

Or:

```bash
npx hardhat run scripts/deploy-core.js --network baseSepolia
```

### Step 3: Verify Contract

After deployment, verify on BaseScan:

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> "<DEPLOYER_ADDRESS>"
```

Example:
```bash
npx hardhat verify --network baseSepolia 0x123...abc "0xf39...266"
```

---

## 📁 **Deployment Artifacts**

All deployments are saved in the `deployments/` directory:

```
deployments/
├── localhost-31337.json       # Local deployments
└── baseSepolia-84532.json     # Base Sepolia deployments
```

Each file contains:
- Network information
- Deployer address
- Contract addresses
- Block numbers
- Transaction hashes
- Timestamps

---

## 🧪 **Testing Deployed Contracts**

### Interact via Hardhat Console

```bash
# For localhost
npx hardhat console --network localhost

# For Base Sepolia
npx hardhat console --network baseSepolia
```

Then in the console:

```javascript
// Load deployment info
const deployment = require('./deployments/localhost-31337.json');
const address = deployment.contracts.TrigImmutableCore.address;

// Get contract instance
const TrigCore = await ethers.getContractFactory("TrigImmutableCore");
const trigCore = TrigCore.attach(address);

// Check owner
const owner = await trigCore.owner();
console.log("Owner:", owner);

// Check if paused
const paused = await trigCore.paused();
console.log("Paused:", paused);

// Check condition counter
const counter = await trigCore.conditionCounter();
console.log("Conditions:", counter.toString());
```

### Create a Test Condition

```javascript
// Time-based condition for 1 hour from now
const futureTime = Math.floor(Date.now() / 1000) + 3600;
const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
  ["uint256"],
  [futureTime]
);

const tx = await trigCore.createCondition(
  0, // TIME_BASED
  triggerData,
  ethers.parseEther("0.01"),
  ethers.ZeroAddress,
  futureTime + 86400,
  { value: ethers.parseEther("0.01") }
);

await tx.wait();
console.log("Condition created!");
```

---

## 🔍 **Verification Commands**

### Verify on BaseScan

```bash
# Basic verification
npx hardhat verify --network baseSepolia <ADDRESS> "<CONSTRUCTOR_ARG>"

# With multiple constructor arguments
npx hardhat verify --network baseSepolia <ADDRESS> \
  --constructor-args arguments.js
```

### Check Verification Status

Visit BaseScan after verification:
```
https://sepolia.basescan.org/address/<CONTRACT_ADDRESS>#code
```

---

## 📊 **Gas Costs**

Estimated gas costs for deployment:

| Network | Gas Price | Est. Cost | Notes |
|---------|-----------|-----------|-------|
| Localhost | Free | 0 ETH | Local testing |
| Base Sepolia | ~0.001 gwei | ~0.0001 ETH | Testnet |
| Base Mainnet | Variable | ~$5-15 | Production |

**TrigImmutableCore Deployment**: ~2.5M gas

---

## 🚨 **Troubleshooting**

### "Insufficient funds" Error

**Problem**: Deployer account has no ETH  
**Solution**: Add testnet ETH (see Prerequisites)

### "Network not found" Error

**Problem**: Hardhat config network mismatch  
**Solution**: Check `hardhat.config.js` has correct network name

### "Contract already deployed" Error

**Problem**: Attempting to deploy to same address  
**Solution**: Use different deployer or clear deployment cache

### "Verification failed" Error

**Problem**: Contract bytecode doesn't match  
**Solution**: 
1. Wait 1-2 minutes after deployment
2. Ensure compiler settings match
3. Check constructor arguments are correct

---

## 🎯 **Best Practices**

### 1. Test Locally First
Always test on localhost before deploying to testnet.

### 2. Use Environment Variables
Never hardcode private keys or sensitive data.

### 3. Verify Contracts
Always verify contracts on block explorers for transparency.

### 4. Save Deployment Info
Keep deployment artifacts in version control (except private keys).

### 5. Document Changes
Update this guide when adding new contracts or networks.

---

## 🔗 **Useful Links**

### Base Sepolia
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Chain ID**: 84532

### Documentation
- **Hardhat**: https://hardhat.org/docs
- **Base**: https://docs.base.org
- **OpenZeppelin**: https://docs.openzeppelin.com

---

## 📝 **Deployment Checklist**

### Before Deployment
- [ ] Environment variables configured
- [ ] Deployer wallet funded
- [ ] Contracts compiled (`npx hardhat compile`)
- [ ] Tests passing (`npx hardhat test`)
- [ ] Network configuration verified

### After Deployment
- [ ] Deployment artifacts saved
- [ ] Contract verified on block explorer
- [ ] Ownership transferred (if needed)
- [ ] Deployment documented
- [ ] Team notified

---

## 🎉 **Quick Start**

### Deploy Everything (Localhost)

```bash
# 1. Start node (in one terminal)
npx hardhat node

# 2. Deploy (in another terminal)
npm run deploy:local

# 3. Check deployment
cat deployments/localhost-31337.json
```

### Deploy to Base Sepolia

```bash
# 1. Set up .env file with PRIVATE_KEY
echo "PRIVATE_KEY=your_key_here" > .env

# 2. Get testnet ETH
# Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

# 3. Deploy
npm run deploy:sepolia

# 4. Verify
npx hardhat verify --network baseSepolia <ADDRESS> "<DEPLOYER>"
```

---

**Status**: ✅ Ready for deployment  
**Last Updated**: October 3, 2025

