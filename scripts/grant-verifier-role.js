const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("\n🔑 Grant Verifier Role Tool");
  console.log("═".repeat(60));

  const [deployer] = await ethers.getSigners();
  const chainId = network.config.chainId;

  console.log(`\n📍 Using account: ${deployer.address}`);
  console.log(`🌐 Network: ${network.name} (Chain ID: ${chainId})`);

  // Load deployment info
  const deploymentPath = path.join(__dirname, "..", "deployments", `steward-${network.name}-${chainId}.json`);
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

  // Check if deployer is admin
  const isAdmin = await oracle.hasRole(await oracle.DEFAULT_ADMIN_ROLE(), deployer.address);
  console.log(`\n👑 Deployer is admin: ${isAdmin ? "✅ YES" : "❌ NO"}`);

  if (!isAdmin) {
    console.log("\n❌ You must be an admin to grant verifier roles!");
    process.exit(1);
  }

  // Get addresses to grant role to
  console.log("\n📝 Addresses to grant VERIFIER_ROLE:");
  
  const addressesToGrant = [
    "0xd591Ea697A2530a45133fFD949ffD8C9bE20706b", // Verifier 1 (deployer)
    "0xd7fb5C170b8Fd6901C041b19698Ded2E7f866c0a", // Verifier 2
    "0x5D3C9286FB3D6a7116605B1E2F564Aa00C0f97be", // Verifier 3 (new)
  ];

  if (addressesToGrant.length === 0) {
    console.log("⚠️  No addresses specified to grant role.");
    console.log("   Modify the script or use on localhost with test accounts.");
    return;
  }

  const VERIFIER_ROLE = await oracle.VERIFIER_ROLE();

  for (const address of addressesToGrant) {
    const hasRole = await oracle.hasRole(VERIFIER_ROLE, address);
    
    if (hasRole) {
      console.log(`✅ ${address} already has VERIFIER_ROLE`);
    } else {
      console.log(`⏳ Granting VERIFIER_ROLE to ${address}...`);
      try {
        const tx = await oracle.grantRole(VERIFIER_ROLE, address);
        await tx.wait();
        console.log(`✅ Role granted! Tx: ${tx.hash}`);
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    console.log();
  }

  console.log("═".repeat(60));
  console.log("✅ Verifier role assignment complete!");
  console.log("\n💡 NOTE: These verifiers don't have stake, but can still verify orgs.");
  console.log("   This is admin-granted permission, bypassing the stake requirement.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });

