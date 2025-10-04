const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("\n🔍 Organization Verification Tool");
  console.log("═".repeat(60));

  const [deployer] = await ethers.getSigners();
  const chainId = network.config.chainId;

  console.log(`\n📍 Using account: ${deployer.address}`);
  console.log(`🌐 Network: ${network.name} (Chain ID: ${chainId})`);

  // Load deployment info
  const deploymentPath = path.join(__dirname, "..", "deployments", `steward-low-stakes-${network.name}-${chainId}.json`);
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const oracleAddress = deploymentInfo.contracts.StewardOracleRegistry.address;

  console.log(`\n✅ Oracle Registry: ${oracleAddress}`);

  // Connect to contract
  const Oracle = await ethers.getContractFactory("StewardOracleRegistry");
  const oracle = Oracle.attach(oracleAddress);

  // Check if deployer is a verifier
  const isVerifier = await oracle.hasRole(await oracle.VERIFIER_ROLE(), deployer.address);
  console.log(`\n🔑 Deployer is verifier: ${isVerifier ? "✅ YES" : "❌ NO"}`);

  if (!isVerifier) {
    console.log("\n⚠️  Deployer is not a verifier!");
    console.log("   To become a verifier, run:");
    console.log(`   npx hardhat run scripts/register-verifier.js --network ${network.name}`);
    process.exit(1);
  }

  // Get list of organizations
  console.log("\n📋 Fetching organizations...");
  const orgList = await oracle.getOrganizationList();
  
  if (orgList.length === 0) {
    console.log("   No organizations registered yet.");
    return;
  }

  console.log(`   Found ${orgList.length} organization(s)\n`);

  // Check each organization
  for (let i = 0; i < orgList.length; i++) {
    const orgAddress = orgList[i];
    const orgInfo = await oracle.getOrganization(orgAddress);
    
    // orgInfo structure: [name, description, website, stake, registrationTime, verifierCount, reputationScore, status]
    const name = orgInfo[0];
    const status = orgInfo[7]; // 0=PENDING, 1=VERIFIED, 2=SUSPENDED, 3=REVOKED
    const verifierCount = Number(orgInfo[5]);
    const requiredVerifications = Number(await oracle.requiredVerifications());

    const statusText = ["PENDING", "VERIFIED", "SUSPENDED", "REVOKED"][status];
    
    console.log(`${i + 1}. ${name}`);
    console.log(`   Address: ${orgAddress}`);
    console.log(`   Status: ${statusText}`);
    console.log(`   Verifications: ${verifierCount}/${requiredVerifications}`);

    if (status === 0) { // PENDING
      console.log(`   ⏳ Attempting to verify...`);
      try {
        const tx = await oracle.verifyOrganization(orgAddress);
        await tx.wait();
        console.log(`   ✅ Verified! Tx: ${tx.hash}`);
        
        // Check new verification count
        const newOrgInfo = await oracle.getOrganization(orgAddress);
        const newVerifierCount = Number(newOrgInfo[5]);
        const newStatus = newOrgInfo[7];
        
        if (newStatus === 1) {
          console.log(`   🎉 Organization is now FULLY VERIFIED!`);
        } else {
          console.log(`   Progress: ${newVerifierCount}/${requiredVerifications} verifications`);
        }
      } catch (error) {
        if (error.message.includes("Already verified")) {
          console.log(`   ℹ️  Already verified by you`);
        } else {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    } else if (status === 1) {
      console.log(`   ✅ Already fully verified`);
    }
    console.log();
  }

  console.log("═".repeat(60));
  console.log("✅ Verification check complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });

