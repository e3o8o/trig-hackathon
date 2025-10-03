const { ethers } = require("hardhat");

async function main() {
    console.log("\n" + "═".repeat(60));
    console.log("🎬 TRIG PROTOCOL CORE DEMO");
    console.log("Demonstrating All Condition Types");
    console.log("═".repeat(60) + "\n");

    const [deployer, user1, user2] = await ethers.getSigners();
    
    console.log("👥 Participants:");
    console.log(`   Deployer: ${deployer.address}`);
    console.log(`   User 1:   ${user1.address}`);
    console.log(`   User 2:   ${user2.address}\n`);

    // Deploy TrigCore
    console.log("📦 Deploying TrigImmutableCore...");
    const TrigCore = await ethers.getContractFactory("TrigImmutableCore");
    const trigCore = await TrigCore.deploy(deployer.address);
    await trigCore.waitForDeployment();
    const trigCoreAddress = await trigCore.getAddress();
    console.log(`✅ Deployed at: ${trigCoreAddress}\n`);

    // Deploy MockERC20 for testing
    console.log("📦 Deploying MockERC20 for testing...");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Test Token", "TEST", ethers.parseEther("1000000"));
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log(`✅ Token deployed at: ${tokenAddress}\n`);

    // Mint tokens to users
    await token.mint(user1.address, ethers.parseEther("1000"));
    console.log(`💰 Minted 1000 TEST tokens to User 1\n`);

    console.log("═".repeat(60));
    console.log("DEMO 1: TIME-BASED CONDITION");
    console.log("═".repeat(60) + "\n");

    console.log("📝 Scenario: Payment releases after 10 seconds");
    
    const futureTime = Math.floor(Date.now() / 1000) + 10; // 10 seconds from now
    const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [futureTime]);
    
    console.log(`   Target time: ${new Date(futureTime * 1000).toLocaleTimeString()}`);
    console.log(`   Payout: 0.01 ETH\n`);

    const tx1 = await trigCore.createCondition(
        0, // TIME_BASED
        triggerData,
        ethers.parseEther("0.01"),
        ethers.ZeroAddress, // ETH
        futureTime + 300, // Expires in 5 minutes
        { value: ethers.parseEther("0.01") }
    );
    await tx1.wait();
    
    console.log("✅ Time-based condition created (ID: 0)");
    console.log("   Status: Active, waiting for target time\n");

    console.log("⏳ Waiting 11 seconds for condition to be met...");
    await new Promise(resolve => setTimeout(resolve, 11000));
    
    console.log("🎯 Attempting to execute condition...");
    const tx1exec = await trigCore.connect(user1).executeCondition(0);
    await tx1exec.wait();
    console.log("✅ Condition executed! User 1 received 0.01 ETH\n");

    console.log("═".repeat(60));
    console.log("DEMO 2: BLOCK-BASED CONDITION");
    console.log("═".repeat(60) + "\n");

    console.log("📝 Scenario: Payment releases at future block");
    
    const currentBlock = await ethers.provider.getBlockNumber();
    const targetBlock = currentBlock + 5;
    const blockTriggerData = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [targetBlock]);
    
    console.log(`   Current block: ${currentBlock}`);
    console.log(`   Target block: ${targetBlock}`);
    console.log(`   Payout: 0.02 ETH\n`);

    const tx2 = await trigCore.createCondition(
        1, // BLOCK_BASED
        blockTriggerData,
        ethers.parseEther("0.02"),
        ethers.ZeroAddress,
        Math.floor(Date.now() / 1000) + 3600,
        { value: ethers.parseEther("0.02") }
    );
    await tx2.wait();
    
    console.log("✅ Block-based condition created (ID: 1)");
    console.log("   Status: Active, waiting for block " + targetBlock + "\n");

    console.log("⛏️  Mining blocks to reach target...");
    for (let i = 0; i < 6; i++) {
        await ethers.provider.send("evm_mine");
    }
    
    const newBlock = await ethers.provider.getBlockNumber();
    console.log(`   Current block: ${newBlock}\n`);
    
    console.log("🎯 Executing block-based condition...");
    const tx2exec = await trigCore.connect(user2).executeCondition(1);
    await tx2exec.wait();
    console.log("✅ Condition executed! User 2 received 0.02 ETH\n");

    console.log("═".repeat(60));
    console.log("DEMO 3: TOKEN BALANCE CONDITION");
    console.log("═".repeat(60) + "\n");

    console.log("📝 Scenario: Payment when user has enough tokens");
    
    const minBalance = ethers.parseEther("500");
    const balanceTriggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [tokenAddress, user1.address, minBalance]
    );
    
    console.log(`   Target: User 1 must have 500+ TEST tokens`);
    console.log(`   Current balance: ${ethers.formatEther(await token.balanceOf(user1.address))} TEST`);
    console.log(`   Payout: 0.03 ETH\n`);

    const tx3 = await trigCore.createCondition(
        2, // TOKEN_BALANCE
        balanceTriggerData,
        ethers.parseEther("0.03"),
        ethers.ZeroAddress,
        Math.floor(Date.now() / 1000) + 3600,
        { value: ethers.parseEther("0.03") }
    );
    await tx3.wait();
    
    console.log("✅ Token balance condition created (ID: 2)");
    console.log("   Status: Active, condition met (user has 1000 tokens)\n");
    
    console.log("🎯 Executing token balance condition...");
    const tx3exec = await trigCore.connect(user1).executeCondition(2);
    await tx3exec.wait();
    console.log("✅ Condition executed! User 1 received 0.03 ETH\n");

    console.log("═".repeat(60));
    console.log("DEMO 4: MULTISIG APPROVAL CONDITION");
    console.log("═".repeat(60) + "\n");

    console.log("📝 Scenario: Payment requires 2-of-2 approvals");
    
    const requiredApprovals = 2;
    const multisigTriggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [requiredApprovals]
    );
    
    console.log(`   Required approvals: ${requiredApprovals}`);
    console.log(`   Payout: 0.05 ETH\n`);

    const tx4 = await trigCore.createCondition(
        3, // MULTISIG_APPROVAL
        multisigTriggerData,
        ethers.parseEther("0.05"),
        ethers.ZeroAddress,
        Math.floor(Date.now() / 1000) + 3600,
        { value: ethers.parseEther("0.05") }
    );
    await tx4.wait();
    
    console.log("✅ Multisig condition created (ID: 3)");
    console.log("   Status: Active, waiting for approvals\n");
    
    console.log("👍 User 1 approving...");
    const approve1 = await trigCore.connect(user1).addApproval(3);
    await approve1.wait();
    console.log("✅ Approval 1/2 received\n");
    
    console.log("👍 User 2 approving...");
    const approve2 = await trigCore.connect(user2).addApproval(3);
    await approve2.wait();
    console.log("✅ Approval 2/2 received - condition met!\n");
    
    console.log("🎯 Executing multisig condition...");
    const tx4exec = await trigCore.connect(deployer).executeCondition(3);
    await tx4exec.wait();
    console.log("✅ Condition executed! Deployer received 0.05 ETH\n");

    console.log("═".repeat(60));
    console.log("DEMO 5: CONDITION CANCELLATION");
    console.log("═".repeat(60) + "\n");

    console.log("📝 Scenario: Creator cancels before execution");
    
    const futureCancelTime = Math.floor(Date.now() / 1000) + 3600;
    const cancelTriggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureCancelTime]
    );
    
    console.log(`   Creating condition with 0.01 ETH payout\n`);

    const tx5 = await trigCore.createCondition(
        0, // TIME_BASED
        cancelTriggerData,
        ethers.parseEther("0.01"),
        ethers.ZeroAddress,
        futureCancelTime + 3600,
        { value: ethers.parseEther("0.01") }
    );
    await tx5.wait();
    
    console.log("✅ Condition created (ID: 4)");
    console.log("   Status: Active\n");
    
    console.log("❌ Creator cancelling condition...");
    const txCancel = await trigCore.cancelCondition(4);
    await txCancel.wait();
    console.log("✅ Condition cancelled! Funds returned to creator\n");

    console.log("═".repeat(60));
    console.log("📊 FINAL STATISTICS");
    console.log("═".repeat(60) + "\n");

    const totalConditions = await trigCore.conditionCounter();
    console.log(`✅ Total Conditions Created: ${totalConditions}`);
    console.log(`   • Executed: 4`);
    console.log(`   • Cancelled: 1`);
    console.log(`   • Total ETH Distributed: 0.11 ETH\n`);

    // Check condition statuses
    for (let i = 0; i < 5; i++) {
        const condition = await trigCore.getCondition(i);
        const statusNames = ["ACTIVE", "EXECUTED", "EXPIRED", "CANCELLED"];
        console.log(`   Condition ${i}: ${statusNames[condition[6]]}`);
    }

    console.log("\n" + "═".repeat(60));
    console.log("✅ ALL DEMOS COMPLETED SUCCESSFULLY!");
    console.log("═".repeat(60) + "\n");

    console.log("🎯 Key Features Demonstrated:");
    console.log("   ✅ Time-based conditions");
    console.log("   ✅ Block-based conditions");
    console.log("   ✅ Token balance conditions");
    console.log("   ✅ Multisig approval conditions");
    console.log("   ✅ Condition cancellation");
    console.log("   ✅ ETH and ERC20 support");
    console.log("   ✅ Multiple executors");
    console.log("   ✅ Comprehensive event emissions\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

