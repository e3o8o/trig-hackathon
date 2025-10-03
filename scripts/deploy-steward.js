const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("\n🚀 Starting Steward Contracts Deployment...");

    const [deployer] = await ethers.getSigners();
    console.log(`\n📍 Deploying from address: ${deployer.address}`);
    console.log(`💰 Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

    const chainId = network.config.chainId;
    console.log(`\n🌐 Network: ${network.name}`);
    console.log(`🔗 Chain ID: ${chainId}`);

    // Read TrigImmutableCore deployment info
    const coreDeploymentPath = path.join(__dirname, "..", "deployments", `${network.name}-${chainId}.json`);
    
    let trigCoreAddress;
    if (fs.existsSync(coreDeploymentPath)) {
        const coreDeployment = JSON.parse(fs.readFileSync(coreDeploymentPath, "utf8"));
        trigCoreAddress = coreDeployment.contracts.TrigImmutableCore.address;
        console.log(`\n✅ Found TrigImmutableCore at: ${trigCoreAddress}`);
    } else {
        throw new Error("TrigImmutableCore not deployed. Please deploy core contracts first.");
    }

    console.log("\n" + "═".repeat(60));
    console.log("DEPLOYING STEWARD CONTRACTS");
    console.log("═".repeat(60));

    // 1. Deploy StewardOracleRegistry
    console.log("\n📦 1/3: Deploying StewardOracleRegistry...");
    const StewardOracleRegistry = await ethers.getContractFactory("StewardOracleRegistry");
    const oracleRegistry = await StewardOracleRegistry.deploy(deployer.address);
    await oracleRegistry.waitForDeployment();
    const oracleRegistryAddress = await oracleRegistry.getAddress();
    console.log(`✅ StewardOracleRegistry deployed to: ${oracleRegistryAddress}`);

    // 2. Deploy AutomatedTithe
    console.log("\n📦 2/3: Deploying AutomatedTithe...");
    const AutomatedTithe = await ethers.getContractFactory("AutomatedTithe");
    const automatedTithe = await AutomatedTithe.deploy(
        trigCoreAddress,
        oracleRegistryAddress,
        deployer.address
    );
    await automatedTithe.waitForDeployment();
    const automatedTitheAddress = await automatedTithe.getAddress();
    console.log(`✅ AutomatedTithe deployed to: ${automatedTitheAddress}`);

    // 3. Deploy MissionProtection
    console.log("\n📦 3/3: Deploying MissionProtection...");
    const MissionProtection = await ethers.getContractFactory("MissionProtection");
    const missionProtection = await MissionProtection.deploy(
        trigCoreAddress,
        oracleRegistryAddress,
        deployer.address
    );
    await missionProtection.waitForDeployment();
    const missionProtectionAddress = await missionProtection.getAddress();
    console.log(`✅ MissionProtection deployed to: ${missionProtectionAddress}`);

    console.log("\n" + "═".repeat(60));
    console.log("VERIFYING DEPLOYMENTS");
    console.log("═".repeat(60));

    // Verify StewardOracleRegistry
    console.log("\n🔍 Verifying StewardOracleRegistry...");
    const minOrgStake = await oracleRegistry.minOrganizationStake();
    const minVerifierStake = await oracleRegistry.minVerifierStake();
    const requiredVerifications = await oracleRegistry.requiredVerifications();
    console.log(`   Min Organization Stake: ${ethers.formatEther(minOrgStake)} ETH`);
    console.log(`   Min Verifier Stake: ${ethers.formatEther(minVerifierStake)} ETH`);
    console.log(`   Required Verifications: ${requiredVerifications}`);

    // Verify AutomatedTithe
    console.log("\n🔍 Verifying AutomatedTithe...");
    const titheOwner = await automatedTithe.owner();
    const commitmentCounter = await automatedTithe.commitmentCounter();
    console.log(`   Owner: ${titheOwner}`);
    console.log(`   Commitment Counter: ${commitmentCounter}`);

    // Verify MissionProtection
    console.log("\n🔍 Verifying MissionProtection...");
    const protectionOwner = await missionProtection.owner();
    const policyCounter = await missionProtection.policyCounter();
    const premiumRate = await missionProtection.premiumRate();
    console.log(`   Owner: ${protectionOwner}`);
    console.log(`   Policy Counter: ${policyCounter}`);
    console.log(`   Premium Rate: ${Number(premiumRate) / 100}%`);

    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: chainId.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            TrigImmutableCore: {
                address: trigCoreAddress,
            },
            StewardOracleRegistry: {
                address: oracleRegistryAddress,
                minOrganizationStake: ethers.formatEther(minOrgStake),
                minVerifierStake: ethers.formatEther(minVerifierStake),
                requiredVerifications: requiredVerifications.toString(),
                blockNumber: (await ethers.provider.getBlock("latest")).number,
                transactionHash: oracleRegistry.deploymentTransaction().hash,
            },
            AutomatedTithe: {
                address: automatedTitheAddress,
                trigCore: trigCoreAddress,
                oracleRegistry: oracleRegistryAddress,
                blockNumber: (await ethers.provider.getBlock("latest")).number,
                transactionHash: automatedTithe.deploymentTransaction().hash,
            },
            MissionProtection: {
                address: missionProtectionAddress,
                trigCore: trigCoreAddress,
                oracleRegistry: oracleRegistryAddress,
                premiumRate: (Number(premiumRate) / 100).toString() + "%",
                blockNumber: (await ethers.provider.getBlock("latest")).number,
                transactionHash: missionProtection.deploymentTransaction().hash,
            },
        },
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }
    const filename = path.join(deploymentsDir, `steward-${network.name}-${chainId}.json`);
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${filename}`);

    if (network.name === "localhost") {
        console.log("\n🧪 Local deployment - no block explorer available");
    } else {
        console.log("\n✨ To verify contracts on Etherscan/BaseScan:");
        console.log(`\nStewardOracleRegistry:`);
        console.log(`npx hardhat verify --network ${network.name} ${oracleRegistryAddress} "${deployer.address}"`);
        console.log(`\nAutomatedTithe:`);
        console.log(`npx hardhat verify --network ${network.name} ${automatedTitheAddress} "${trigCoreAddress}" "${oracleRegistryAddress}" "${deployer.address}"`);
        console.log(`\nMissionProtection:`);
        console.log(`npx hardhat verify --network ${network.name} ${missionProtectionAddress} "${trigCoreAddress}" "${oracleRegistryAddress}" "${deployer.address}"`);
    }

    console.log("\n" + "═".repeat(60));
    console.log("🎉 STEWARD CONTRACTS DEPLOYMENT COMPLETE!");
    console.log("═".repeat(60));
    console.log(`\n📋 Summary:`);
    console.log(`   Network: ${network.name}`);
    console.log(`   TrigImmutableCore: ${trigCoreAddress}`);
    console.log(`   StewardOracleRegistry: ${oracleRegistryAddress}`);
    console.log(`   AutomatedTithe: ${automatedTitheAddress}`);
    console.log(`   MissionProtection: ${missionProtectionAddress}`);
    console.log(`\n✨ All contracts deployed and verified!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

