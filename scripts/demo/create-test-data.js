const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("\n" + "═".repeat(60));
    console.log("🎬 CREATING TEST DATA FOR STEWARD CONTRACTS");
    console.log("═".repeat(60) + "\n");

    const [deployer, org1, org2, org3, verifier1, verifier2, verifier3, giver1, giver2] = await ethers.getSigners();
    
    console.log("👥 Test Accounts:");
    console.log(`   Deployer:   ${deployer.address}`);
    console.log(`   Org 1:      ${org1.address}`);
    console.log(`   Org 2:      ${org2.address}`);
    console.log(`   Org 3:      ${org3.address}`);
    console.log(`   Verifier 1: ${verifier1.address}`);
    console.log(`   Verifier 2: ${verifier2.address}`);
    console.log(`   Verifier 3: ${verifier3.address}`);
    console.log(`   Giver 1:    ${giver1.address}`);
    console.log(`   Giver 2:    ${giver2.address}\n`);

    // Load deployment addresses
    const deploymentPath = path.join(__dirname, "..", "..", "deployments", "localhost-31337.json");
    const stewardPath = path.join(__dirname, "..", "..", "deployments", "steward-localhost-31337.json");
    
    let trigCoreAddress, oracleAddress, titheAddress, missionAddress;
    
    if (fs.existsSync(deploymentPath) && fs.existsSync(stewardPath)) {
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        const stewardDeployment = JSON.parse(fs.readFileSync(stewardPath, "utf8"));
        
        trigCoreAddress = deployment.contracts.TrigImmutableCore.address;
        oracleAddress = stewardDeployment.contracts.StewardOracleRegistry.address;
        titheAddress = stewardDeployment.contracts.AutomatedTithe.address;
        missionAddress = stewardDeployment.contracts.MissionProtection.address;
        
        console.log("📦 Using deployed contracts:");
        console.log(`   TrigCore:  ${trigCoreAddress}`);
        console.log(`   Oracle:    ${oracleAddress}`);
        console.log(`   Tithe:     ${titheAddress}`);
        console.log(`   Mission:   ${missionAddress}\n`);
    } else {
        console.log("⚠️  Deployment files not found. Deploying contracts...\n");
        
        // Deploy contracts
        console.log("📦 Deploying TrigImmutableCore...");
        const TrigCore = await ethers.getContractFactory("TrigImmutableCore");
        const trigCore = await TrigCore.deploy(deployer.address);
        await trigCore.waitForDeployment();
        trigCoreAddress = await trigCore.getAddress();
        console.log(`✅ Deployed at: ${trigCoreAddress}`);
        
        console.log("📦 Deploying StewardOracleRegistry...");
        const Oracle = await ethers.getContractFactory("StewardOracleRegistry");
        const oracle = await Oracle.deploy(deployer.address);
        await oracle.waitForDeployment();
        oracleAddress = await oracle.getAddress();
        console.log(`✅ Deployed at: ${oracleAddress}`);
        
        console.log("📦 Deploying AutomatedTithe...");
        const Tithe = await ethers.getContractFactory("AutomatedTithe");
        const tithe = await Tithe.deploy(trigCoreAddress, oracleAddress, deployer.address);
        await tithe.waitForDeployment();
        titheAddress = await tithe.getAddress();
        console.log(`✅ Deployed at: ${titheAddress}`);
        
        console.log("📦 Deploying MissionProtection...");
        const Mission = await ethers.getContractFactory("MissionProtection");
        const mission = await Mission.deploy(trigCoreAddress, oracleAddress, deployer.address);
        await mission.waitForDeployment();
        missionAddress = await mission.getAddress();
        console.log(`✅ Deployed at: ${missionAddress}\n`);
    }

    // Get contract instances
    const Oracle = await ethers.getContractFactory("StewardOracleRegistry");
    const Tithe = await ethers.getContractFactory("AutomatedTithe");
    const Mission = await ethers.getContractFactory("MissionProtection");

    const oracle = Oracle.attach(oracleAddress);
    const tithe = Tithe.attach(titheAddress);
    const mission = Mission.attach(missionAddress);

    console.log("═".repeat(60));
    console.log("STEP 1: Register Verifiers");
    console.log("═".repeat(60) + "\n");

    const minVerifierStake = await oracle.minVerifierStake();
    console.log(`   Required stake: ${ethers.formatEther(minVerifierStake)} ETH\n`);

    console.log("👤 Registering Verifier 1...");
    const tx1 = await oracle.connect(verifier1).registerVerifier({ value: minVerifierStake });
    await tx1.wait();
    console.log(`✅ Verifier 1 registered: ${verifier1.address}`);

    console.log("👤 Registering Verifier 2...");
    const tx2 = await oracle.connect(verifier2).registerVerifier({ value: minVerifierStake });
    await tx2.wait();
    console.log(`✅ Verifier 2 registered: ${verifier2.address}`);

    console.log("👤 Registering Verifier 3...");
    const tx3 = await oracle.connect(verifier3).registerVerifier({ value: minVerifierStake });
    await tx3.wait();
    console.log(`✅ Verifier 3 registered: ${verifier3.address}\n`);

    console.log("═".repeat(60));
    console.log("STEP 2: Register Organizations");
    console.log("═".repeat(60) + "\n");

    const minOrgStake = await oracle.minOrganizationStake();
    console.log(`   Required stake: ${ethers.formatEther(minOrgStake)} ETH\n`);

    const organizations = [
        {
            signer: org1,
            name: "Grace Community Church",
            description: "A vibrant community church serving the local area",
            website: "https://gracecommunity.org"
        },
        {
            signer: org2,
            name: "Hope Mission International",
            description: "Supporting missions and relief efforts worldwide",
            website: "https://hopemission.org"
        },
        {
            signer: org3,
            name: "Faith Foundation",
            description: "Building faith and supporting communities",
            website: "https://faithfoundation.org"
        }
    ];

    for (let i = 0; i < organizations.length; i++) {
        const org = organizations[i];
        console.log(`⛪ Registering ${org.name}...`);
        const txReg = await oracle.connect(org.signer).registerOrganization(
            org.name,
            org.description,
            org.website,
            { value: minOrgStake }
        );
        await txReg.wait();
        console.log(`✅ Registered: ${org.signer.address}`);
    }

    console.log("\n" + "═".repeat(60));
    console.log("STEP 3: Verify Organizations");
    console.log("═".repeat(60) + "\n");

    console.log("   Each organization needs 3 verifications...\n");

    for (let i = 0; i < organizations.length; i++) {
        const orgAddress = organizations[i].signer.address;
        console.log(`⛪ Verifying ${organizations[i].name}:`);
        
        // Verifier 1
        const txV1 = await oracle.connect(verifier1).verifyOrganization(orgAddress);
        await txV1.wait();
        console.log(`   ✅ Verification 1/3 by ${verifier1.address.substring(0, 10)}...`);
        
        // Verifier 2
        const txV2 = await oracle.connect(verifier2).verifyOrganization(orgAddress);
        await txV2.wait();
        console.log(`   ✅ Verification 2/3 by ${verifier2.address.substring(0, 10)}...`);
        
        // Verifier 3
        const txV3 = await oracle.connect(verifier3).verifyOrganization(orgAddress);
        await txV3.wait();
        console.log(`   ✅ Verification 3/3 by ${verifier3.address.substring(0, 10)}...`);
        
        const isVerified = await oracle.isOrganizationVerified(orgAddress);
        console.log(`   🎉 Organization ${isVerified ? "VERIFIED" : "PENDING"}\n`);
    }

    console.log("═".repeat(60));
    console.log("STEP 4: Create Tithe Commitments");
    console.log("═".repeat(60) + "\n");

    console.log("💰 Giver 1 creating monthly tithe to Grace Community Church...");
    const titheAmount1 = ethers.parseEther("0.01");
    const txTithe1 = await tithe.connect(giver1).createCommitment(
        org1.address,
        titheAmount1,
        ethers.ZeroAddress, // ETH
        2, // MONTHLY
        0, // No end time
        { value: titheAmount1 }
    );
    await txTithe1.wait();
    console.log(`✅ Commitment created (ID: 0, 0.01 ETH/month)\n`);

    console.log("💰 Giver 2 creating weekly tithe to Hope Mission...");
    const titheAmount2 = ethers.parseEther("0.005");
    const txTithe2 = await tithe.connect(giver2).createCommitment(
        org2.address,
        titheAmount2,
        ethers.ZeroAddress,
        0, // WEEKLY
        0,
        { value: titheAmount2 }
    );
    await txTithe2.wait();
    console.log(`✅ Commitment created (ID: 1, 0.005 ETH/week)\n`);

    console.log("═".repeat(60));
    console.log("STEP 5: Purchase Mission Protection Policies");
    console.log("═".repeat(60) + "\n");

    const coverageAmount = ethers.parseEther("1");
    const premium = await mission.calculatePremium(coverageAmount);
    const startDate = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
    const endDate = startDate + (7 * 86400); // 1 week trip

    console.log(`📋 Policy Details:`);
    console.log(`   Coverage: ${ethers.formatEther(coverageAmount)} ETH`);
    console.log(`   Premium: ${ethers.formatEther(premium)} ETH (2%)`);
    console.log(`   Duration: 7 days\n`);

    console.log("🛡️ Giver 1 purchasing policy for Grace Community mission trip...");
    const txPolicy1 = await mission.connect(giver1).purchasePolicy(
        org1.address,
        0, // MISSION_TRIP
        "Summer Mission Trip to Guatemala",
        "Guatemala City, Guatemala",
        startDate,
        endDate,
        coverageAmount,
        ethers.ZeroAddress,
        { value: premium }
    );
    await txPolicy1.wait();
    console.log(`✅ Policy purchased (ID: 0)\n`);

    console.log("🛡️ Giver 2 purchasing policy for Hope Mission relief operation...");
    const txPolicy2 = await mission.connect(giver2).purchasePolicy(
        org2.address,
        2, // RELIEF_OPERATION
        "Hurricane Relief Mission",
        "Houston, Texas",
        startDate,
        endDate + 86400, // 8 days
        ethers.parseEther("2"),
        ethers.ZeroAddress,
        { value: await mission.calculatePremium(ethers.parseEther("2")) }
    );
    await txPolicy2.wait();
    console.log(`✅ Policy purchased (ID: 1)\n`);

    console.log("═".repeat(60));
    console.log("📊 TEST DATA SUMMARY");
    console.log("═".repeat(60) + "\n");

    const orgCount = await oracle.getOrganizationCount();
    const verifierCount = await oracle.getVerifierCount();
    const commitmentCount = await tithe.commitmentCounter();
    const policyCount = await mission.policyCounter();

    console.log("✅ Organizations Registered: " + orgCount);
    console.log("   • Grace Community Church (verified)");
    console.log("   • Hope Mission International (verified)");
    console.log("   • Faith Foundation (verified)\n");

    console.log("✅ Verifiers Registered: " + verifierCount);
    console.log("   • 3 active verifiers with 0.5 ETH stake each\n");

    console.log("✅ Tithe Commitments: " + commitmentCount);
    console.log("   • Monthly: 1 (0.01 ETH)");
    console.log("   • Weekly: 1 (0.005 ETH)\n");

    console.log("✅ Mission Protection Policies: " + policyCount);
    console.log("   • Mission Trip: 1 (1 ETH coverage)");
    console.log("   • Relief Operation: 1 (2 ETH coverage)\n");

    // Save test data for reference
    const testData = {
        network: "localhost",
        timestamp: new Date().toISOString(),
        contracts: {
            trigCore: trigCoreAddress,
            oracle: oracleAddress,
            tithe: titheAddress,
            mission: missionAddress
        },
        accounts: {
            organizations: [
                { name: "Grace Community Church", address: org1.address },
                { name: "Hope Mission International", address: org2.address },
                { name: "Faith Foundation", address: org3.address }
            ],
            verifiers: [
                verifier1.address,
                verifier2.address,
                verifier3.address
            ],
            givers: [
                giver1.address,
                giver2.address
            ]
        },
        testData: {
            organizations: orgCount.toString(),
            verifiers: verifierCount.toString(),
            titheCommitments: commitmentCount.toString(),
            missionPolicies: policyCount.toString()
        }
    };

    const testDataPath = path.join(__dirname, "..", "..", "test-data.json");
    fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
    console.log(`💾 Test data saved to: test-data.json\n`);

    console.log("═".repeat(60));
    console.log("✅ TEST DATA CREATION COMPLETE!");
    console.log("═".repeat(60) + "\n");

    console.log("🎯 You can now:");
    console.log("   • Test tithe payments");
    console.log("   • Submit mission protection claims");
    console.log("   • Demonstrate the full system");
    console.log("   • Build frontend with real data\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

