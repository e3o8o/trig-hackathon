const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("TrigImmutableCore", function () {
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
      expect(await trigCore.conditionCounter()).to.equal(0);
    });

    it("Should not be paused on deployment", async function () {
      expect(await trigCore.paused()).to.equal(false);
    });
  });

  describe("Time-Based Conditions", function () {
    it("Should create a time-based condition", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400; // 1 day after trigger

      await trigCore.connect(user1).createCondition(
        0, // TIME_BASED
        triggerData,
        payoutAmount,
        ethers.ZeroAddress, // Native ETH
        expirationTime,
        { value: payoutAmount }
      );

      const condition = await trigCore.getCondition(0);
      expect(condition.conditionId).to.equal(0);
      expect(condition.creator).to.equal(user1.address);
      expect(condition.conditionType).to.equal(0); // TIME_BASED
      expect(condition.payoutAmount).to.equal(payoutAmount);
      expect(condition.status).to.equal(0); // ACTIVE
    });

    it("Should execute time-based condition when time is reached", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 100; // 100 seconds from now
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      // Create condition
      await trigCore.connect(user1).createCondition(
        0, // TIME_BASED
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Fast forward time
      await time.increaseTo(futureTime + 1);

      // Check condition is met
      expect(await trigCore.isConditionMet(0)).to.equal(true);

      // Record user1 balance before execution
      const balanceBefore = await ethers.provider.getBalance(user1.address);

      // Execute condition
      await trigCore.connect(user2).executeCondition(0);

      // Verify condition status changed
      const condition = await trigCore.getCondition(0);
      expect(condition.status).to.equal(1); // EXECUTED
      expect(condition.executor).to.equal(user2.address);

      // Verify user1 received payout
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(payoutAmount);
    });

    it("Should not execute time-based condition before time is reached", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 86400;

      await trigCore.connect(user1).createCondition(
        0, // TIME_BASED
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Try to execute before time
      await expect(
        trigCore.connect(user2).executeCondition(0)
      ).to.be.revertedWith("Condition not met");
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
      expect(condition.conditionType).to.equal(1); // BLOCK_BASED
    });
  });

  describe("Token Balance Conditions", function () {
    let mockToken;

    beforeEach(async function () {
      // Deploy a mock ERC20 token
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
      expect(condition.conditionType).to.equal(2); // TOKEN_BALANCE
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
      expect(condition.conditionType).to.equal(3); // MULTISIG_APPROVAL
    });

    it("Should add approvals and execute when threshold is met", async function () {
      const requiredApprovals = 2;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [requiredApprovals]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = Math.floor(Date.now() / 1000) + 86400;

      // Create condition
      await trigCore.connect(user1).createCondition(
        3, // MULTISIG_APPROVAL
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Add first approval
      await trigCore.connect(owner).addApproval(0);
      expect(await trigCore.approvalCounts(0)).to.equal(1);

      // Condition not met yet
      expect(await trigCore.isConditionMet(0)).to.equal(false);

      // Add second approval
      await trigCore.connect(user2).addApproval(0);
      expect(await trigCore.approvalCounts(0)).to.equal(2);

      // Now condition is met
      expect(await trigCore.isConditionMet(0)).to.equal(true);

      // Execute condition
      await trigCore.connect(user2).executeCondition(0);

      const condition = await trigCore.getCondition(0);
      expect(condition.status).to.equal(1); // EXECUTED
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
        0, // TIME_BASED
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
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const condition = await trigCore.getCondition(0);
      expect(condition.status).to.equal(3); // CANCELLED

      // Verify refund (accounting for gas)
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      expect(balanceAfter).to.be.closeTo(balanceBefore + payoutAmount - gasUsed, ethers.parseEther("0.001"));
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
  });

  describe("Mark Expired", function () {
    it("Should mark condition as expired after expiration time", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 100;
      const triggerData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256"],
        [futureTime]
      );
      const payoutAmount = ethers.parseEther("1.0");
      const expirationTime = futureTime + 200; // Expires 200 seconds after trigger

      await trigCore.connect(user1).createCondition(
        0,
        triggerData,
        payoutAmount,
        ethers.ZeroAddress,
        expirationTime,
        { value: payoutAmount }
      );

      // Fast forward past expiration
      await time.increaseTo(expirationTime + 1);

      // Mark as expired
      await trigCore.connect(user2).markExpired(0);

      const condition = await trigCore.getCondition(0);
      expect(condition.status).to.equal(2); // EXPIRED
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to pause", async function () {
      await trigCore.connect(owner).pause();
      expect(await trigCore.paused()).to.equal(true);
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
      expect(userConditions[0]).to.equal(0);
      expect(userConditions[1]).to.equal(1);
    });
  });
});

