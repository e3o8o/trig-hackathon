const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("\n🔍 Check Verifiers Tool");
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

  // Check verifier count
  const verifierCount = await oracle.getVerifierCount();
  console.log(`\n📊 Verifier Count: ${verifierCount}`);

  // Check verifier list
  console.log(`\n📝 Verifier List:`);
  for (let i = 0; i < Number(verifierCount); i++) {
    try {
      const verifierAddress = await oracle.verifierList(i);
      const verifierInfo = await oracle.getVerifier(verifierAddress);
      console.log(`  ${i + 1}. ${verifierAddress}`);
      console.log(`     Stake: ${(Number(verifierInfo[0]) / 1e18).toFixed(5)} ETH`);
      console.log(`     Verifications: ${verifierInfo[1]}`);
      console.log(`     Active: ${verifierInfo[3]}`);
    } catch (err) {
      console.log(`  ${i + 1}. Error loading verifier ${i}: ${err.message}`);
    }
  }

  // Check who has VERIFIER_ROLE
  const VERIFIER_ROLE = await oracle.VERIFIER_ROLE();
  console.log(`\n🔑 Addresses with VERIFIER_ROLE:`);
  
  const testAddresses = [
    "0xd591Ea697A2530a45133fFD949ffD8C9bE20706b",
    "0xd7fb5C170b8Fd6901C041b19698Ded2E7f866c0a", 
    "0x5D3C9286FB3D6a7116605B1E2F564Aa00C0f97be"
  ];

  for (const addr of testAddresses) {
    const hasRole = await oracle.hasRole(VERIFIER_ROLE, addr);
    console.log(`  ${addr}: ${hasRole ? '✅ YES' : '❌ NO'}`);
  }

  console.log(`\n════════════════════════════════════════════════════════════`);
  console.log(`✅ Verifier check complete!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
