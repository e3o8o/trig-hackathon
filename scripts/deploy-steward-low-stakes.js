const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("\n🚀 Starting Steward Contracts Deployment (LOW STAKES VERSION)...");

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

    // Set LOW minimum stakes for testing
    console.log("\n⚙️  Setting LOW minimum stakes for testing...");
    const lowOrgStake = ethers.parseEther("0.00001"); // 0.00001 ETH
    const lowVerifierStake = ethers.parseEther("0.00005"); // 0.00005 ETH
    
    console.log(`   Setting minOrganizationStake to ${ethers.formatEther(lowOrgStake)} ETH...`);
    const tx1 = await oracleRegistry.setMinOrganizationStake(lowOrgStake);
    await tx1.wait();
    console.log(`   ✅ Organization stake updated`);
    
    console.log(`   Setting minVerifierStake to ${ethers.formatEther(lowVerifierStake)} ETH...`);
    const tx2 = await oracleRegistry.setMinVerifierStake(lowVerifierStake);
    await tx2.wait();
    console.log(`   ✅ Verifier stake updated`);

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
    const missionOwner = await missionProtection.owner();
    const policyCounter = await missionProtection.policyCounter();
    const premiumRate = await missionProtection.premiumRate();
    console.log(`   Owner: ${missionOwner}`);
    console.log(`   Policy Counter: ${policyCounter}`);
    console.log(`   Premium Rate: ${Number(premiumRate) / 100}%`);

    console.log("\n" + "═".repeat(60));
    console.log("SAVING DEPLOYMENT INFO");
    console.log("═".repeat(60));

    const deploymentInfo = {
        network: network.name,
        chainId: chainId.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            TrigImmutableCore: {
                address: trigCoreAddress
            },
            StewardOracleRegistry: {
                address: oracleRegistryAddress,
                minOrganizationStake: ethers.formatEther(minOrgStake) + " ETH",
                minVerifierStake: ethers.formatEther(minVerifierStake) + " ETH",
                requiredVerifications: requiredVerifications.toString()
            },
            AutomatedTithe: {
                address: automatedTitheAddress,
                commitmentCounter: commitmentCounter.toString()
            },
            MissionProtection: {
                address: missionProtectionAddress,
                policyCounter: policyCounter.toString(),
                premiumRate: (Number(premiumRate) / 100) + "%"
            }
        }
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const filename = `steward-low-stakes-${network.name}-${chainId}.json`;
    const filepath = path.join(deploymentsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n✅ Deployment info saved to: ${filename}`);

    console.log("\n" + "═".repeat(60));
    console.log("✅ DEPLOYMENT COMPLETE!");
    console.log("═".repeat(60));
    console.log("\n📝 Summary:");
    console.log(`   TrigImmutableCore:        ${trigCoreAddress}`);
    console.log(`   StewardOracleRegistry:    ${oracleRegistryAddress}`);
    console.log(`   AutomatedTithe:           ${automatedTitheAddress}`);
    console.log(`   MissionProtection:        ${missionProtectionAddress}`);
    console.log(`\n   Min Organization Stake:   ${ethers.formatEther(minOrgStake)} ETH`);
    console.log(`   Min Verifier Stake:       ${ethers.formatEther(minVerifierStake)} ETH`);
    console.log("\n🎉 All contracts deployed with LOW stakes for testing!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });

