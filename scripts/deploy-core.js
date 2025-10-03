const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting TrigImmutableCore deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying from address:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ ERROR: Deployer account has no funds!");
    console.log("Please add funds to:", deployer.address);
    process.exit(1);
  }

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Deploying to network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());
  console.log("");

  // Deploy TrigImmutableCore
  console.log("📦 Deploying TrigImmutableCore contract...");
  const TrigImmutableCore = await ethers.getContractFactory("TrigImmutableCore");
  
  const trigCore = await TrigImmutableCore.deploy(deployer.address);
  await trigCore.waitForDeployment();

  const coreAddress = await trigCore.getAddress();
  console.log("✅ TrigImmutableCore deployed to:", coreAddress);
  console.log("");

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const owner = await trigCore.owner();
  const isPaused = await trigCore.paused();
  const counter = await trigCore.conditionCounter();

  console.log("   Owner:", owner);
  console.log("   Paused:", isPaused);
  console.log("   Condition Counter:", counter.toString());
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      TrigImmutableCore: {
        address: coreAddress,
        owner: owner,
        blockNumber: trigCore.deploymentTransaction().blockNumber,
        transactionHash: trigCore.deploymentTransaction().hash,
      }
    }
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save to file
  const filename = `${network.name}-${network.chainId}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  console.log("💾 Deployment info saved to:", filepath);
  console.log("");

  // Print summary
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(60));
  console.log("");
  console.log("📋 Summary:");
  console.log("   Network:", network.name);
  console.log("   TrigImmutableCore:", coreAddress);
  console.log("");
  
  if (network.chainId === 84532n) {
    console.log("🔗 View on BaseScan:");
    console.log(`   https://sepolia.basescan.org/address/${coreAddress}`);
    console.log("");
    console.log("📝 To verify contract:");
    console.log(`   npx hardhat verify --network baseSepolia ${coreAddress} "${deployer.address}"`);
  } else if (network.chainId === 31337n) {
    console.log("🧪 Local deployment - no block explorer available");
  }
  
  console.log("");
  console.log("✨ Ready to use!");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

