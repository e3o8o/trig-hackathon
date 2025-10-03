const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Checking Account Balances\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());
  console.log("");

  console.log("📍 Deployer Address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💵 Balance:", ethers.formatEther(balance), "ETH");
  console.log("");

  if (balance === 0n) {
    console.log("❌ Account has no funds!");
    console.log("");
    console.log("To get Base Sepolia testnet ETH:");
    console.log("  1. Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
    console.log("  2. Connect wallet:", deployer.address);
    console.log("  3. Request 0.1 ETH");
    console.log("");
  } else {
    console.log("✅ Account is funded and ready for deployment!");
    console.log("");
    
    // Estimate deployment cost
    const gasPrice = (await ethers.provider.getFeeData()).gasPrice;
    const estimatedGas = 2500000n; // Approximate deployment gas
    const estimatedCost = gasPrice * estimatedGas;
    
    console.log("📊 Deployment Estimate:");
    console.log("   Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
    console.log("   Estimated Gas:", estimatedGas.toString());
    console.log("   Estimated Cost:", ethers.formatEther(estimatedCost), "ETH");
    console.log("");
    
    if (balance > estimatedCost) {
      console.log("✅ Sufficient balance for deployment");
    } else {
      console.log("⚠️  Balance may be insufficient for deployment");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

