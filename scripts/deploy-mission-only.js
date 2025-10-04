const { ethers, network } = require("hardhat");

async function main() {
    console.log("\n🚀 Deploying MissionProtection only...");

    const [deployer] = await ethers.getSigners();
    console.log(`📍 Deploying from: ${deployer.address}`);
    console.log(`💰 Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

    // Use already deployed addresses
    const trigCoreAddress = "0x0932b427fce27cAf69b36BAd1C33325835740DE0";
    const oracleRegistryAddress = "0xcc206C0ac32649ba7197Cb93c268e1675eca7024";

    console.log(`\n✅ Using TrigCore: ${trigCoreAddress}`);
    console.log(`✅ Using Oracle: ${oracleRegistryAddress}`);

    console.log("\n📦 Deploying MissionProtection...");
    const MissionProtection = await ethers.getContractFactory("MissionProtection");
    const missionProtection = await MissionProtection.deploy(
        trigCoreAddress,
        oracleRegistryAddress,
        deployer.address
    );
    await missionProtection.waitForDeployment();
    const missionProtectionAddress = await missionProtection.getAddress();
    
    console.log(`✅ MissionProtection deployed to: ${missionProtectionAddress}`);
    
    console.log("\n✅ ALL CONTRACTS DEPLOYED:");
    console.log(`   TrigCore:          ${trigCoreAddress}`);
    console.log(`   Oracle (LOW STAKES): ${oracleRegistryAddress}`);
    console.log(`   AutomatedTithe:    0xe4B1318bb19256D2055c194a703824a4B1BA0f27`);
    console.log(`   MissionProtection: ${missionProtectionAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

