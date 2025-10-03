const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrigImmutableCore - Basic Tests", function () {
  let trigCore;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const TrigImmutableCore = await ethers.getContractFactory("TrigImmutableCore");
    trigCore = await TrigImmutableCore.deploy(owner.address);
    await trigCore.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await trigCore.owner()).to.equal(owner.address);
    });

    it("Should start with condition counter at 0", async function () {
      expect(await trigCore.conditionCounter()).to.equal(0n);
    });

    it("Should not be paused on deployment", async function () {
      expect(await trigCore.paused()).to.equal(false);
    });

    it("Should be able to receive ETH", async function () {
      const sendTx = await owner.sendTransaction({
        to: await trigCore.getAddress(),
        value: ethers.parseEther("1.0")
      });
      await sendTx.wait();

      const balance = await ethers.provider.getBalance(await trigCore.getAddress());
      expect(balance).to.equal(ethers.parseEther("1.0"));
    });
  });

  describe("Time-Based Condition Creation", function () {
    it("Should create a time-based condition with correct parameters", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400; // 1 day after trigger

      const tx = await trigCore.connect(user1).createCondition(
        0, // TIME_BASED
        triggerData,
        payoutAmount,
        ethers.ZeroAddress, // Native ETH
        expirationTime,
        { value: payoutAmount }
      );

      await tx.wait();

      // Verify ConditionCreated event
      await expect(tx)
        .to.emit(trigCore, "ConditionCreated")
        .withArgs(0, user1.address, 0, payoutAmount);

      // Verify condition was stored correctly
      const condition = await trigCore.getCondition(0);
      expect(condition.conditionId).to.equal(0n);
      expect(condition.creator).to.equal(user1.address);
      expect(condition.conditionType).to.equal(0); // TIME_BASED
      expect(condition.payoutAmount).to.equal(payoutAmount);
      expect(condition.payoutToken).to.equal(ethers.ZeroAddress);
      expect(condition.status).to.equal(0); // ACTIVE
      expect(condition.expirationTime).to.equal(BigInt(expirationTime));
      expect(condition.executedAt).to.equal(0n);
      expect(condition.executor).to.equal(ethers.ZeroAddress);

      // Verify condition counter incremented
      expect(await trigCore.conditionCounter()).to.equal(1n);
    });

    it("Should revert if payout amount is 0", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const expirationTime = futureTime + 86400;

      await expect(
        trigCore.connect(user1).createCondition(
          0,
          triggerData,
          0, // Zero payout
          ethers.ZeroAddress,
          expirationTime,
          { value: 0 }
        )
      ).to.be.revertedWith("Payout must be > 0");
    });

    it("Should revert if expiration time is in the past", async function () {
      const pastTime = Math.floor(Date.now() / 1000) - 100;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [pastTime]
      );
      const payoutAmount = ethers.parseEther("1.0");

      await expect(
        trigCore.connect(user1).createCondition(
          0,
          triggerData,
          payoutAmount,
          ethers.ZeroAddress,
          pastTime,
          { value: payoutAmount }
        )
      ).to.be.revertedWith("Expiration must be future");
    });

    it("Should revert if insufficient ETH sent", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await expect(
        trigCore.connect(user1).createCondition(
          0,
          triggerData,
          payoutAmount,
          ethers.ZeroAddress,
          expirationTime,
          { value: ethers.parseEther("0.5") } // Insufficient
        )
      ).to.be.revertedWith("Insufficient ETH sent");
    });
  });

  describe("Block-Based Conditions", function () {
    it("Should create a block-based condition", async function () {
      const currentBlock = await ethers.provider.getBlockNumber();
      const targetBlock = currentBlock + 10;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [targetBlock]
      );
      const payoutAmount = ethers.parseEther("0.5");
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      await trigCore.connect(user1).createCondition(
        1, // BLOCK_BASED
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      const condition = await trigCore.getCondition(0);
      expect(Number(condition.conditionType)).to.equal(1); // BLOCK_BASED
      expect(condition.payoutAmount).to.equal(payoutAmount);
    });
  });

  describe("Token Balance Conditions", function () {
    let mockToken;

    beforeEach(async function () {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      mockToken = await MockERC20.deploy("Mock Token", "MOCK", ethers.parseEther("1000000"));
      await mockToken.waitForDeployment();
    });

    it("Should create a token balance condition", async function () {
      const minBalance = ethers.parseEther("100");
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [await mockToken.getAddress(), user2.address, minBalance]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      await trigCore.connect(user1).createCondition(
        2, // TOKEN_BALANCE
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      const condition = await trigCore.getCondition(0);
      expect(Number(condition.conditionType)).to.equal(2); // TOKEN_BALANCE
    });
  });

  describe("Multisig Approval Conditions", function () {
    it("Should create a multisig condition", async function () {
      const requiredApprovals = 2;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [requiredApprovals]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      await trigCore.connect(user1).createCondition(
        3, // MULTISIG_APPROVAL
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      const condition = await trigCore.getCondition(0);
      expect(Number(condition.conditionType)).to.equal(3); // MULTISIG_APPROVAL
    });

    it("Should add approvals correctly", async function () {
      const requiredApprovals = 2;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [requiredApprovals]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      // Create condition
      await trigCore.connect(user1).createCondition(
        3,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Add first approval
      const tx1 = await trigCore.connect(owner).addApproval(0);
      await tx1.wait();
      
      await expect(tx1)
        .to.emit(trigCore, "ApprovalAdded")
        .withArgs(0, owner.address);

      expect(await trigCore.approvalCounts(0)).to.equal(1n);
      expect(await trigCore.conditionApprovals(0, owner.address)).to.equal(true);

      // Condition not met yet
      expect(await trigCore.isConditionMet(0)).to.equal(false);

      // Add second approval
      await trigCore.connect(user2).addApproval(0);
      expect(await trigCore.approvalCounts(0)).to.equal(2n);

      // Now condition is met
      expect(await trigCore.isConditionMet(0)).to.equal(true);
    });

    it("Should not allow duplicate approvals", async function () {
      const requiredApprovals = 2;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [requiredApprovals]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      await trigCore.connect(user1).createCondition(
        3,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Add approval
      await trigCore.connect(owner).addApproval(0);

      // Try to add again
      await expect(
        trigCore.connect(owner).addApproval(0)
      ).to.be.revertedWith("Already approved");
    });
  });

  describe("Cancel Condition", function () {
    it("Should allow creator to cancel active condition", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      const balanceBefore = await ethers.provider.getBalance(user1.address);

      // Cancel condition
      const tx = await trigCore.connect(user1).cancelCondition(0);
      const receipt = await tx.wait();

      // Verify event
      await expect(tx)
        .to.emit(trigCore, "ConditionCancelled")
        .withArgs(0, user1.address);

      const condition = await trigCore.getCondition(0);
      expect(Number(condition.status)).to.equal(3); // CANCELLED

      // Verify refund received
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      expect(balanceAfter).to.be.closeTo(
        balanceBefore + payoutAmount - gasUsed,
        ethers.parseEther("0.001")
      );
    });

    it("Should not allow non-creator to cancel condition", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      await expect(
        trigCore.connect(user2).cancelCondition(0)
      ).to.be.revertedWith("Only creator can cancel");
    });

    it("Should not allow cancelling non-active condition", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Cancel once
      await trigCore.connect(user1).cancelCondition(0);

      // Try to cancel again
      await expect(
        trigCore.connect(user1).cancelCondition(0)
      ).to.be.revertedWith("Condition not active");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to pause", async function () {
      await trigCore.connect(owner).pause();
      expect(await trigCore.paused()).to.equal(true);
    });

    it("Should allow owner to unpause", async function () {
      await trigCore.connect(owner).pause();
      await trigCore.connect(owner).unpause();
      expect(await trigCore.paused()).to.equal(false);
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        trigCore.connect(user1).pause()
      ).to.be.reverted;
    });

    it("Should not allow condition creation when paused", async function () {
      await trigCore.connect(owner).pause();

      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await expect(
        trigCore.connect(user1).createCondition(
          0,
          triggerData,
          payoutAmount,
          ethers.ZeroAddress,
          expirationTime,
          { value: payoutAmount }
        )
      ).to.be.reverted;
    });
  });

  describe("View Functions", function () {
    it("Should return user conditions", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      // Create two conditions
      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      const userConditions = await trigCore.getUserConditions(user1.address);
      expect(userConditions.length).to.equal(2);
      expect(userConditions[0]).to.equal(0n);
      expect(userConditions[1]).to.equal(1n);
    });

    it("Should return condition status", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      expect(Number(await trigCore.getConditionStatus(0))).to.equal(0); // ACTIVE
    });
  });

  describe("Multiple Conditions", function () {
    it("Should handle multiple conditions correctly", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("0.5");
      const expirationTime = futureTime + 86400;

      // User1 creates 2 conditions
      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // User2 creates 1 condition
      await trigCore.connect(user2).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Verify counter
      expect(await trigCore.conditionCounter()).to.equal(3n);

      // Verify user conditions
      const user1Conditions = await trigCore.getUserConditions(user1.address);
      const user2Conditions = await trigCore.getUserConditions(user2.address);

      expect(user1Conditions.length).to.equal(2);
      expect(user2Conditions.length).to.equal(1);
    });
  });
});

