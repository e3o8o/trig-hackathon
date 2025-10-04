# 🔍 Organization Verification Guide

Guide to verifying registered organizations for the Steward platform.

---

## 📋 **Overview**

When a church/organization registers on Steward, they go into **PENDING** status and need **3 verifiers** to approve them before they can receive tithes.

### **Verification Requirements:**
- ✅ Organization must be registered (staked 0.00001 ETH)
- ✅ Need 3 independent verifiers to approve
- ✅ Each verifier can only verify once per organization
- ✅ After 3 verifications → Organization becomes **VERIFIED**

---

## 🔑 **Who Can Verify?**

1. **Deployer** (✅ Automatic)
   - Already has VERIFIER_ROLE
   - Can verify immediately

2. **Staked Verifiers** (✅ Permissionless)
   - Anyone can stake 0.00005 ETH to become a verifier
   - Call `registerVerifier()` on the contract

3. **Admin-Granted Verifiers** (✅ Admin Only)
   - Admin can grant VERIFIER_ROLE to trusted addresses
   - No stake required
   - Good for demo/testing

---

## 🚀 **Option 1: Auto-Verify Script** (Easiest)

Use the deployer account (already a verifier) to verify organizations:

### **On Base Sepolia:**
```bash
npx hardhat run scripts/verify-organizations.js --network baseSepolia
```

### **On Localhost:**
```bash
npx hardhat run scripts/verify-organizations.js --network localhost
```

### **What it does:**
1. Checks all registered organizations
2. Shows their verification status
3. Automatically verifies pending organizations
4. Shows progress toward 3 required verifications

### **Example Output:**
```
🔍 Organization Verification Tool
═══════════════════════════════════════

📍 Using account: 0xd591Ea697A2530a45133fFD949ffD8C9bE20706b
🌐 Network: baseSepolia (Chain ID: 84532)

✅ Oracle Registry: 0xcc206C0ac32649ba7197Cb93c268e1675eca7024
🔑 Deployer is verifier: ✅ YES

📋 Fetching organizations...
   Found 1 organization(s)

1. Test Church
   Address: 0x1234...5678
   Status: PENDING
   Verifications: 0/3
   ⏳ Attempting to verify...
   ✅ Verified! Tx: 0xabc...def
   Progress: 1/3 verifications
```

---

## 🎯 **Option 2: Grant Verifier Role** (For Multiple Verifiers)

Grant VERIFIER_ROLE to specific addresses (admin only):

### **Edit the script first:**
```javascript
// In scripts/grant-verifier-role.js
const addressesToGrant = [
  "0x1234567890123456789012345678901234567890", // Verifier 1
  "0x2345678901234567890123456789012345678901", // Verifier 2
  "0x3456789012345678901234567890123456789012", // Verifier 3
];
```

### **Run:**
```bash
npx hardhat run scripts/grant-verifier-role.js --network baseSepolia
```

### **What it does:**
1. Checks if you're admin
2. Grants VERIFIER_ROLE to specified addresses
3. These addresses can now verify organizations (no stake needed!)

### **Benefits:**
- ✅ Quick setup for demo
- ✅ No need to get testnet ETH for verifiers
- ✅ Can verify immediately
- ✅ Admin controlled

---

## 🧪 **Testing Full Verification Flow**

To test the complete 3-verifier system:

### **Method 1: Use 3 Different Wallets**
```bash
# 1. Verify with deployer (already done above)
npx hardhat run scripts/verify-organizations.js --network baseSepolia

# 2. Grant role to 2 more addresses
# Edit grant-verifier-role.js with 2 addresses
npx hardhat run scripts/grant-verifier-role.js --network baseSepolia

# 3. Have each address call verifyOrganization
# (Would need to switch private keys or use UI)
```

### **Method 2: Quick Demo Script**
Create a script that uses deployer + 2 granted addresses to verify:

```javascript
// Coming soon: auto-verify-with-multiple.js
// This would use deployer + 2 test accounts to fully verify
```

---

## 📊 **Verification Status**

Organizations can be in 4 states:

| Status | Value | Description |
|--------|-------|-------------|
| **PENDING** | 0 | Registered, waiting for verifications |
| **VERIFIED** | 1 | ✅ Fully verified (3+ verifications) |
| **SUSPENDED** | 2 | Temporarily suspended by admin |
| **REVOKED** | 3 | Permanently revoked |

---

## 🎬 **For Hackathon Demo**

### **Quick Setup (5 minutes):**

1. **Register a church** (via UI)
   ```
   Go to: http://localhost:3000/register-church
   Stake: 0.00001 ETH
   ```

2. **Grant verifier roles** (if needed)
   ```bash
   # Edit script with 2 test addresses
   npx hardhat run scripts/grant-verifier-role.js --network baseSepolia
   ```

3. **Auto-verify the organization**
   ```bash
   # Run 3 times with different accounts, OR
   # Just run once and explain "needs 2 more verifiers"
   npx hardhat run scripts/verify-organizations.js --network baseSepolia
   ```

4. **Show the result in UI**
   - Organization shows as "Verified" ✅
   - Users can now create tithe commitments

### **Demo Talking Points:**
- ✅ "Organizations must be verified by 3 independent verifiers"
- ✅ "This prevents fraud and ensures legitimacy"
- ✅ "Verifiers stake their own ETH, so they have skin in the game"
- ✅ "For this demo, I'm using the admin verifier role"
- ✅ "In production, churches would have 3+ community verifiers"

---

## 🔗 **Contract Functions**

### **Check Organization Status:**
```javascript
const oracle = await ethers.getContractAt("StewardOracleRegistry", oracleAddress);
const orgInfo = await oracle.getOrganization(organizationAddress);
// Returns: [name, description, website, stake, registrationTime, verifierCount, reputationScore, status]
```

### **Verify Organization:**
```javascript
await oracle.verifyOrganization(organizationAddress);
```

### **Check if Address is Verifier:**
```javascript
const VERIFIER_ROLE = await oracle.VERIFIER_ROLE();
const isVerifier = await oracle.hasRole(VERIFIER_ROLE, address);
```

### **Grant Verifier Role (Admin Only):**
```javascript
const VERIFIER_ROLE = await oracle.VERIFIER_ROLE();
await oracle.grantRole(VERIFIER_ROLE, address);
```

---

## 💡 **Tips**

1. **Single Verifier Demo:** Run the verify script once, show it needs 2 more verifiers
2. **Full Demo:** Grant role to 2 test addresses and verify from each
3. **UI Integration:** Could create a "Verifier Dashboard" page (optional)
4. **Production:** Would have community verifiers with real stake

---

## ⚠️ **Important Notes**

- Organizations in PENDING status **cannot receive tithes**
- The `createCommitment` function checks: `require(oracleRegistry.isOrganizationVerified(organization))`
- This is a key security feature to prevent scam organizations
- In production, you'd have a robust verifier network

---

## 🎯 **Current Deployment**

**Base Sepolia:**
- Oracle: `0xcc206C0ac32649ba7197Cb93c268e1675eca7024`
- Min Org Stake: 0.00001 ETH
- Min Verifier Stake: 0.00005 ETH
- Required Verifications: 3

**Deployer (Auto-Verifier):**
- `0xd591Ea697A2530a45133fFD949ffD8C9bE20706b`
- Has VERIFIER_ROLE by default

---

**Ready to verify some churches! 🎉**

