const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Steward Contracts Integration Tests", function () {
    let trigCore, oracle, tithe, mission;
    let deployer, org1, org2, verifier1, verifier2, verifier3, giver1, giver2;
    let minOrgStake, minVerifierStake;

    beforeEach(async function () {
        [deployer, org1, org2, verifier1, verifier2, verifier3, giver1, giver2] = await ethers.getSigners();

        // Deploy TrigCore
        const TrigCore = await ethers.getContractFactory("TrigImmutableCore");
        trigCore = await TrigCore.deploy(deployer.address);
        await trigCore.waitForDeployment();

        // Deploy Oracle
        const Oracle = await ethers.getContractFactory("StewardOracleRegistry");
        oracle = await Oracle.deploy(deployer.address);
        await oracle.waitForDeployment();

        // Deploy Tithe
        const Tithe = await ethers.getContractFactory("AutomatedTithe");
        tithe = await Tithe.deploy(
            await trigCore.getAddress(),
            await oracle.getAddress(),
            deployer.address
        );
        await tithe.waitForDeployment();

        // Deploy Mission
        const Mission = await ethers.getContractFactory("MissionProtection");
        mission = await Mission.deploy(
            await trigCore.getAddress(),
            await oracle.getAddress(),
            deployer.address
        );
        await mission.waitForDeployment();

        minOrgStake = await oracle.minOrganizationStake();
        minVerifierStake = await oracle.minVerifierStake();
    });

    describe("End-to-End: Organization Registration & Verification", function () {
        it("Should complete full organization verification flow", async function () {
            // Register verifiers
            await oracle.connect(verifier1).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier2).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier3).registerVerifier({ value: minVerifierStake });

            expect(await oracle.getVerifierCount()).to.equal(3n);

            // Register organization
            await oracle.connect(org1).registerOrganization(
                "Test Church",
                "A test church",
                "https://test.org",
                { value: minOrgStake }
            );

            expect(await oracle.getOrganizationCount()).to.equal(1n);
            expect(await oracle.isOrganizationVerified(org1.address)).to.be.false;

            // Verify organization
            await oracle.connect(verifier1).verifyOrganization(org1.address);
            expect(await oracle.isOrganizationVerified(org1.address)).to.be.false; // Need 3

            await oracle.connect(verifier2).verifyOrganization(org1.address);
            expect(await oracle.isOrganizationVerified(org1.address)).to.be.false; // Need 3

            await oracle.connect(verifier3).verifyOrganization(org1.address);
            expect(await oracle.isOrganizationVerified(org1.address)).to.be.true; // Verified!
        });

        it("Should prevent duplicate verifications from same verifier", async function () {
            await oracle.connect(verifier1).registerVerifier({ value: minVerifierStake });
            await oracle.connect(org1).registerOrganization(
                "Test Church",
                "A test church",
                "https://test.org",
                { value: minOrgStake }
            );

            await oracle.connect(verifier1).verifyOrganization(org1.address);
            
            await expect(
                oracle.connect(verifier1).verifyOrganization(org1.address)
            ).to.be.revertedWith("Already verified by you");
        });
    });

    describe("End-to-End: Automated Tithe Flow", function () {
        beforeEach(async function () {
            // Setup: Register and verify organization
            await oracle.connect(verifier1).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier2).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier3).registerVerifier({ value: minVerifierStake });

            await oracle.connect(org1).registerOrganization(
                "Test Church",
                "A test church",
                "https://test.org",
                { value: minOrgStake }
            );

            await oracle.connect(verifier1).verifyOrganization(org1.address);
            await oracle.connect(verifier2).verifyOrganization(org1.address);
            await oracle.connect(verifier3).verifyOrganization(org1.address);
        });

        it("Should create and execute tithe commitment", async function () {
            const titheAmount = ethers.parseEther("0.01");
            
            // Create commitment
            await tithe.connect(giver1).createCommitment(
                org1.address,
                titheAmount,
                ethers.ZeroAddress,
                2, // MONTHLY
                0, // No end time
                { value: titheAmount }
            );

            expect(await tithe.commitmentCounter()).to.equal(1n);

            // Check commitment
            const commitment = await tithe.getCommitment(0);
            expect(commitment[0]).to.equal(giver1.address); // giver
            expect(commitment[1]).to.equal(org1.address); // organization
            expect(commitment[2]).to.equal(titheAmount); // amount

            // Execute second payment after time passes
            await time.increase(31 * 24 * 60 * 60); // 31 days

            const org1BalanceBefore = await ethers.provider.getBalance(org1.address);
            
            await tithe.connect(giver1).executeTithePayment(0, { value: titheAmount });
            
            const org1BalanceAfter = await ethers.provider.getBalance(org1.address);
            expect(org1BalanceAfter - org1BalanceBefore).to.equal(titheAmount);
        });

        it("Should prevent tithe to unverified organization", async function () {
            const titheAmount = ethers.parseEther("0.01");
            
            await expect(
                tithe.connect(giver1).createCommitment(
                    org2.address, // Not verified
                    titheAmount,
                    ethers.ZeroAddress,
                    2,
                    0,
                    { value: titheAmount }
                )
            ).to.be.revertedWith("Organization not verified");
        });

        it("Should allow pause and resume of commitment", async function () {
            const titheAmount = ethers.parseEther("0.01");
            
            await tithe.connect(giver1).createCommitment(
                org1.address,
                titheAmount,
                ethers.ZeroAddress,
                2,
                0,
                { value: titheAmount }
            );

            // Pause
            await tithe.connect(giver1).pauseCommitment(0);
            
            // Try to execute (should fail)
            await time.increase(31 * 24 * 60 * 60);
            await expect(
                tithe.connect(giver1).executeTithePayment(0, { value: titheAmount })
            ).to.be.revertedWith("Commitment not active");

            // Resume
            await tithe.connect(giver1).resumeCommitment(0);
            
            // Now should work
            await tithe.connect(giver1).executeTithePayment(0, { value: titheAmount });
        });
    });

    describe("End-to-End: Mission Protection Flow", function () {
        beforeEach(async function () {
            // Setup: Register and verify organization
            await oracle.connect(verifier1).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier2).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier3).registerVerifier({ value: minVerifierStake });

            await oracle.connect(org1).registerOrganization(
                "Test Church",
                "A test church",
                "https://test.org",
                { value: minOrgStake }
            );

            await oracle.connect(verifier1).verifyOrganization(org1.address);
            await oracle.connect(verifier2).verifyOrganization(org1.address);
            await oracle.connect(verifier3).verifyOrganization(org1.address);
        });

        it("Should purchase policy and process claim", async function () {
            const coverageAmount = ethers.parseEther("1");
            const premium = await mission.calculatePremium(coverageAmount);
            
            const currentTime = await time.latest();
            const startDate = currentTime + 86400; // Tomorrow
            const endDate = startDate + (7 * 86400); // 1 week

            // Purchase policy
            await mission.connect(giver1).purchasePolicy(
                org1.address,
                0, // MISSION_TRIP
                "Summer Mission Trip",
                "Guatemala",
                startDate,
                endDate,
                coverageAmount,
                ethers.ZeroAddress,
                { value: premium }
            );

            expect(await mission.policyCounter()).to.equal(1n);

            // Move time to during the trip
            await time.increaseTo(startDate + 86400);

            // Submit claim
            const claimAmount = ethers.parseEther("0.5");
            await mission.connect(giver1).submitClaim(
                0,
                claimAmount,
                "Trip cancelled due to weather"
            );

            // Fund the contract to pay claims (premiums collected)
            await deployer.sendTransaction({
                to: await mission.getAddress(),
                value: ethers.parseEther("1")
            });

            // Process claim (owner approves)
            const giver1BalanceBefore = await ethers.provider.getBalance(giver1.address);
            
            await mission.connect(deployer).processClaim(0, claimAmount);
            
            const giver1BalanceAfter = await ethers.provider.getBalance(giver1.address);
            expect(giver1BalanceAfter - giver1BalanceBefore).to.equal(claimAmount);
        });

        it("Should prevent policy for unverified organization", async function () {
            const coverageAmount = ethers.parseEther("1");
            const premium = await mission.calculatePremium(coverageAmount);
            const currentTime = await time.latest();

            await expect(
                mission.connect(giver1).purchasePolicy(
                    org2.address, // Not verified
                    0,
                    "Test Trip",
                    "Location",
                    currentTime + 86400,
                    currentTime + (8 * 86400),
                    coverageAmount,
                    ethers.ZeroAddress,
                    { value: premium }
                )
            ).to.be.revertedWith("Organization not verified");
        });

        it("Should allow policy cancellation with refund", async function () {
            const coverageAmount = ethers.parseEther("1");
            const premium = await mission.calculatePremium(coverageAmount);
            const currentTime = await time.latest();
            const startDate = currentTime + 86400;
            const endDate = startDate + (7 * 86400);

            await mission.connect(giver1).purchasePolicy(
                org1.address,
                0,
                "Test Trip",
                "Location",
                startDate,
                endDate,
                coverageAmount,
                ethers.ZeroAddress,
                { value: premium }
            );

            const giver1BalanceBefore = await ethers.provider.getBalance(giver1.address);
            
            // Cancel before trip starts
            const tx = await mission.connect(giver1).cancelPolicy(0);
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            
            const giver1BalanceAfter = await ethers.provider.getBalance(giver1.address);
            
            // Should get 90% refund
            const expectedRefund = (premium * 9000n) / 10000n;
            const actualRefund = giver1BalanceAfter - giver1BalanceBefore + gasUsed;
            
            expect(actualRefund).to.be.closeTo(expectedRefund, ethers.parseEther("0.001"));
        });
    });

    describe("Multi-Contract Integration", function () {
        it("Should handle multiple organizations with multiple commitments and policies", async function () {
            // Register verifiers
            await oracle.connect(verifier1).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier2).registerVerifier({ value: minVerifierStake });
            await oracle.connect(verifier3).registerVerifier({ value: minVerifierStake });

            // Register and verify 2 organizations
            await oracle.connect(org1).registerOrganization("Church 1", "Desc", "https://1.org", { value: minOrgStake });
            await oracle.connect(org2).registerOrganization("Church 2", "Desc", "https://2.org", { value: minOrgStake });

            // Verify org1
            await oracle.connect(verifier1).verifyOrganization(org1.address);
            await oracle.connect(verifier2).verifyOrganization(org1.address);
            await oracle.connect(verifier3).verifyOrganization(org1.address);

            // Verify org2
            await oracle.connect(verifier1).verifyOrganization(org2.address);
            await oracle.connect(verifier2).verifyOrganization(org2.address);
            await oracle.connect(verifier3).verifyOrganization(org2.address);

            // Create tithes to both
            await tithe.connect(giver1).createCommitment(
                org1.address,
                ethers.parseEther("0.01"),
                ethers.ZeroAddress,
                2,
                0,
                { value: ethers.parseEther("0.01") }
            );

            await tithe.connect(giver2).createCommitment(
                org2.address,
                ethers.parseEther("0.02"),
                ethers.ZeroAddress,
                2,
                0,
                { value: ethers.parseEther("0.02") }
            );

            // Create policies for both
            const currentTime = await time.latest();
            const premium1 = await mission.calculatePremium(ethers.parseEther("1"));
            const premium2 = await mission.calculatePremium(ethers.parseEther("2"));

            await mission.connect(giver1).purchasePolicy(
                org1.address,
                0,
                "Trip 1",
                "Location",
                currentTime + 86400,
                currentTime + (8 * 86400),
                ethers.parseEther("1"),
                ethers.ZeroAddress,
                { value: premium1 }
            );

            await mission.connect(giver2).purchasePolicy(
                org2.address,
                0,
                "Trip 2",
                "Location",
                currentTime + 86400,
                currentTime + (8 * 86400),
                ethers.parseEther("2"),
                ethers.ZeroAddress,
                { value: premium2 }
            );

            // Verify all counts
            expect(await oracle.getOrganizationCount()).to.equal(2n);
            expect(await tithe.commitmentCounter()).to.equal(2n);
            expect(await mission.policyCounter()).to.equal(2n);
        });
    });
});

