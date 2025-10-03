const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Event Indexer for Trig Protocol + Steward Contracts
 * 
 * Indexes all events from deployed contracts and stores them in JSON database
 * Provides query API for frontend consumption
 */

class EventIndexer {
    constructor() {
        this.events = {
            conditions: [],
            organizations: [],
            verifications: [],
            titheCommitments: [],
            tithePayments: [],
            missionPolicies: [],
            claims: []
        };
        this.lastIndexedBlock = 0;
        this.dbPath = path.join(__dirname, "..", "..", "indexed-events.json");
    }

    async loadExistingData() {
        if (fs.existsSync(this.dbPath)) {
            const data = JSON.parse(fs.readFileSync(this.dbPath, "utf8"));
            this.events = data.events || this.events;
            this.lastIndexedBlock = data.lastIndexedBlock || 0;
            console.log(`📂 Loaded existing data from block ${this.lastIndexedBlock}`);
        }
    }

    async saveData() {
        const data = {
            lastIndexedBlock: this.lastIndexedBlock,
            lastUpdated: new Date().toISOString(),
            events: this.events,
            summary: {
                totalConditions: this.events.conditions.length,
                totalOrganizations: this.events.organizations.length,
                totalVerifications: this.events.verifications.length,
                totalTitheCommitments: this.events.titheCommitments.length,
                totalTithePayments: this.events.tithePayments.length,
                totalMissionPolicies: this.events.missionPolicies.length,
                totalClaims: this.events.claims.length
            }
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
        console.log(`💾 Saved events to ${this.dbPath}`);
    }

    async indexTrigCore(trigCore, fromBlock, toBlock) {
        console.log(`\n🔍 Indexing TrigImmutableCore events...`);
        
        // Index ConditionCreated events
        const conditionFilter = trigCore.filters.ConditionCreated();
        const conditionEvents = await trigCore.queryFilter(conditionFilter, fromBlock, toBlock);
        
        for (const event of conditionEvents) {
            const { conditionId, creator, conditionType, payoutAmount } = event.args;
            this.events.conditions.push({
                conditionId: conditionId.toString(),
                creator: creator,
                conditionType: Number(conditionType),
                conditionTypeName: this.getConditionTypeName(Number(conditionType)),
                payoutAmount: ethers.formatEther(payoutAmount),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp
            });
        }

        // Index ConditionExecuted events
        const executedFilter = trigCore.filters.ConditionExecuted();
        const executedEvents = await trigCore.queryFilter(executedFilter, fromBlock, toBlock);
        
        for (const event of executedEvents) {
            const { conditionId, executor, payoutAmount } = event.args;
            
            // Update the condition in our index
            const condition = this.events.conditions.find(c => c.conditionId === conditionId.toString());
            if (condition) {
                condition.status = "EXECUTED";
                condition.executor = executor;
                condition.executedAt = (await event.getBlock()).timestamp;
                condition.executionTxHash = event.transactionHash;
            }
        }

        // Index ConditionCancelled events
        const cancelledFilter = trigCore.filters.ConditionCancelled();
        const cancelledEvents = await trigCore.queryFilter(cancelledFilter, fromBlock, toBlock);
        
        for (const event of cancelledEvents) {
            const { conditionId } = event.args;
            const condition = this.events.conditions.find(c => c.conditionId === conditionId.toString());
            if (condition) {
                condition.status = "CANCELLED";
                condition.cancelledAt = (await event.getBlock()).timestamp;
                condition.cancellationTxHash = event.transactionHash;
            }
        }

        console.log(`✅ Indexed ${conditionEvents.length} conditions`);
        console.log(`   • ${executedEvents.length} executed`);
        console.log(`   • ${cancelledEvents.length} cancelled`);
    }

    async indexOracleRegistry(oracle, fromBlock, toBlock) {
        console.log(`\n🔍 Indexing StewardOracleRegistry events...`);
        
        // Index OrganizationRegistered events
        const orgFilter = oracle.filters.OrganizationRegistered();
        const orgEvents = await oracle.queryFilter(orgFilter, fromBlock, toBlock);
        
        for (const event of orgEvents) {
            const { organization, name, stakeAmount } = event.args;
            this.events.organizations.push({
                address: organization,
                name: name,
                stake: ethers.formatEther(stakeAmount),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp,
                verified: false
            });
        }

        // Index OrganizationVerified events
        const verifiedFilter = oracle.filters.OrganizationVerified();
        const verifiedEvents = await oracle.queryFilter(verifiedFilter, fromBlock, toBlock);
        
        for (const event of verifiedEvents) {
            const { organization, verifier } = event.args;
            
            this.events.verifications.push({
                organization: organization,
                verifier: verifier,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp
            });

            // Update organization verification status
            const org = this.events.organizations.find(o => o.address.toLowerCase() === organization.toLowerCase());
            if (org) {
                org.verified = true;
                org.verifiedAt = (await event.getBlock()).timestamp;
            }
        }

        console.log(`✅ Indexed ${orgEvents.length} organizations`);
        console.log(`   • ${verifiedEvents.length} verifications`);
    }

    async indexAutomatedTithe(tithe, fromBlock, toBlock) {
        console.log(`\n🔍 Indexing AutomatedTithe events...`);
        
        // Index CommitmentCreated events
        const commitmentFilter = tithe.filters.CommitmentCreated();
        const commitmentEvents = await tithe.queryFilter(commitmentFilter, fromBlock, toBlock);
        
        for (const event of commitmentEvents) {
            const { commitmentId, giver, organization, amount, frequency } = event.args;
            this.events.titheCommitments.push({
                commitmentId: commitmentId.toString(),
                giver: giver,
                organization: organization,
                amount: ethers.formatEther(amount),
                frequency: Number(frequency),
                frequencyName: this.getFrequencyName(Number(frequency)),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp,
                status: "ACTIVE"
            });
        }

        // Index TithePaid events
        const paymentFilter = tithe.filters.TithePaid();
        const paymentEvents = await tithe.queryFilter(paymentFilter, fromBlock, toBlock);
        
        for (const event of paymentEvents) {
            const { commitmentId, organization, amount } = event.args;
            this.events.tithePayments.push({
                commitmentId: commitmentId.toString(),
                organization: organization,
                amount: ethers.formatEther(amount),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp
            });
        }

        // Index CommitmentPaused/Resumed events
        const pausedFilter = tithe.filters.CommitmentPaused();
        const pausedEvents = await tithe.queryFilter(pausedFilter, fromBlock, toBlock);
        
        for (const event of pausedEvents) {
            const { commitmentId } = event.args;
            const commitment = this.events.titheCommitments.find(c => c.commitmentId === commitmentId.toString());
            if (commitment) {
                commitment.status = "PAUSED";
            }
        }

        const resumedFilter = tithe.filters.CommitmentResumed();
        const resumedEvents = await tithe.queryFilter(resumedFilter, fromBlock, toBlock);
        
        for (const event of resumedEvents) {
            const { commitmentId } = event.args;
            const commitment = this.events.titheCommitments.find(c => c.commitmentId === commitmentId.toString());
            if (commitment) {
                commitment.status = "ACTIVE";
            }
        }

        console.log(`✅ Indexed ${commitmentEvents.length} tithe commitments`);
        console.log(`   • ${paymentEvents.length} payments`);
        console.log(`   • ${pausedEvents.length} paused, ${resumedEvents.length} resumed`);
    }

    async indexMissionProtection(mission, fromBlock, toBlock) {
        console.log(`\n🔍 Indexing MissionProtection events...`);
        
        // Index PolicyPurchased events
        const policyFilter = mission.filters.PolicyPurchased();
        const policyEvents = await mission.queryFilter(policyFilter, fromBlock, toBlock);
        
        for (const event of policyEvents) {
            const { policyId, policyholder, organization, coverageAmount, premium } = event.args;
            this.events.missionPolicies.push({
                policyId: policyId.toString(),
                policyholder: policyholder,
                organization: organization,
                coverageAmount: ethers.formatEther(coverageAmount),
                premium: ethers.formatEther(premium),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp,
                status: "ACTIVE"
            });
        }

        // Index ClaimSubmitted events
        const claimFilter = mission.filters.ClaimSubmitted();
        const claimEvents = await mission.queryFilter(claimFilter, fromBlock, toBlock);
        
        for (const event of claimEvents) {
            const { policyId, claimAmount } = event.args;
            this.events.claims.push({
                policyId: policyId.toString(),
                claimAmount: ethers.formatEther(claimAmount),
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
                timestamp: (await event.getBlock()).timestamp,
                status: "PENDING"
            });

            // Update policy status
            const policy = this.events.missionPolicies.find(p => p.policyId === policyId.toString());
            if (policy) {
                policy.status = "CLAIM_SUBMITTED";
            }
        }

        // Index ClaimPaid events
        const paidFilter = mission.filters.ClaimPaid();
        const paidEvents = await mission.queryFilter(paidFilter, fromBlock, toBlock);
        
        for (const event of paidEvents) {
            const { policyId, amount } = event.args;
            const claim = this.events.claims.find(c => c.policyId === policyId.toString() && c.status === "PENDING");
            if (claim) {
                claim.status = "APPROVED";
                claim.paidAmount = ethers.formatEther(amount);
                claim.processedAt = (await event.getBlock()).timestamp;
            }

            // Update policy status
            const policy = this.events.missionPolicies.find(p => p.policyId === policyId.toString());
            if (policy) {
                policy.status = "CLAIM_PAID";
            }
        }

        console.log(`✅ Indexed ${policyEvents.length} mission policies`);
        console.log(`   • ${claimEvents.length} claims submitted`);
        console.log(`   • ${paidEvents.length} claims paid`);
    }

    getConditionTypeName(type) {
        const types = ["TIME_BASED", "BLOCK_BASED", "TOKEN_BALANCE", "MULTISIG_APPROVAL"];
        return types[type] || "UNKNOWN";
    }

    getFrequencyName(frequency) {
        const frequencies = ["WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];
        return frequencies[frequency] || "UNKNOWN";
    }

    // Query API methods
    getConditionsByCreator(creator) {
        return this.events.conditions.filter(c => 
            c.creator.toLowerCase() === creator.toLowerCase()
        );
    }

    getConditionsByStatus(status) {
        return this.events.conditions.filter(c => c.status === status);
    }

    getOrganizationByAddress(address) {
        return this.events.organizations.find(o => 
            o.address.toLowerCase() === address.toLowerCase()
        );
    }

    getVerifiedOrganizations() {
        return this.events.organizations.filter(o => o.verified);
    }

    getTitheCommitmentsByGiver(giver) {
        return this.events.titheCommitments.filter(c => 
            c.giver.toLowerCase() === giver.toLowerCase()
        );
    }

    getTitheCommitmentsByOrganization(organization) {
        return this.events.titheCommitments.filter(c => 
            c.organization.toLowerCase() === organization.toLowerCase()
        );
    }

    getMissionPoliciesByHolder(policyholder) {
        return this.events.missionPolicies.filter(p => 
            p.policyholder.toLowerCase() === policyholder.toLowerCase()
        );
    }

    getClaimsByPolicy(policyId) {
        return this.events.claims.filter(c => c.policyId === policyId);
    }
}

async function main() {
    console.log("\n" + "═".repeat(60));
    console.log("🔍 TRIG PROTOCOL EVENT INDEXER");
    console.log("═".repeat(60) + "\n");

    const indexer = new EventIndexer();
    await indexer.loadExistingData();

    // Load deployed contract addresses
    const deploymentPath = path.join(__dirname, "..", "..", "deployments", `${network.name}-${network.config.chainId}.json`);
    const stewardPath = path.join(__dirname, "..", "..", "deployments", `steward-${network.name}-${network.config.chainId}.json`);

    if (!fs.existsSync(deploymentPath) || !fs.existsSync(stewardPath)) {
        console.error("❌ Deployment files not found. Please deploy contracts first.");
        return;
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const stewardDeployment = JSON.parse(fs.readFileSync(stewardPath, "utf8"));

    const trigCoreAddress = deployment.contracts.TrigImmutableCore.address;
    const oracleAddress = stewardDeployment.contracts.StewardOracleRegistry.address;
    const titheAddress = stewardDeployment.contracts.AutomatedTithe.address;
    const missionAddress = stewardDeployment.contracts.MissionProtection.address;

    console.log("📦 Contract Addresses:");
    console.log(`   TrigCore:  ${trigCoreAddress}`);
    console.log(`   Oracle:    ${oracleAddress}`);
    console.log(`   Tithe:     ${titheAddress}`);
    console.log(`   Mission:   ${missionAddress}\n`);

    // Get contract instances
    const trigCore = await ethers.getContractAt("TrigImmutableCore", trigCoreAddress);
    const oracle = await ethers.getContractAt("StewardOracleRegistry", oracleAddress);
    const tithe = await ethers.getContractAt("AutomatedTithe", titheAddress);
    const mission = await ethers.getContractAt("MissionProtection", missionAddress);

    // Determine block range
    const currentBlock = await ethers.provider.getBlockNumber();
    const fromBlock = indexer.lastIndexedBlock + 1;

    console.log("📊 Block Range:");
    console.log(`   From: ${fromBlock}`);
    console.log(`   To:   ${currentBlock}`);
    console.log(`   Blocks to index: ${currentBlock - fromBlock + 1}\n`);

    if (fromBlock > currentBlock) {
        console.log("✅ No new blocks to index.\n");
        return;
    }

    // Index all contracts
    await indexer.indexTrigCore(trigCore, fromBlock, currentBlock);
    await indexer.indexOracleRegistry(oracle, fromBlock, currentBlock);
    await indexer.indexAutomatedTithe(tithe, fromBlock, currentBlock);
    await indexer.indexMissionProtection(mission, fromBlock, currentBlock);

    // Update last indexed block
    indexer.lastIndexedBlock = currentBlock;

    // Save indexed data
    await indexer.saveData();

    console.log("\n" + "═".repeat(60));
    console.log("📊 INDEXING SUMMARY");
    console.log("═".repeat(60) + "\n");

    console.log(`✅ Total Conditions:       ${indexer.events.conditions.length}`);
    console.log(`✅ Total Organizations:    ${indexer.events.organizations.length}`);
    console.log(`✅ Total Verifications:    ${indexer.events.verifications.length}`);
    console.log(`✅ Total Tithe Commitments: ${indexer.events.titheCommitments.length}`);
    console.log(`✅ Total Tithe Payments:   ${indexer.events.tithePayments.length}`);
    console.log(`✅ Total Mission Policies: ${indexer.events.missionPolicies.length}`);
    console.log(`✅ Total Claims:           ${indexer.events.claims.length}\n`);

    console.log("═".repeat(60));
    console.log("✅ INDEXING COMPLETE!");
    console.log("═".repeat(60) + "\n");

    console.log("💡 Query API available in indexed-events.json");
    console.log("   Use the EventIndexer class methods to query events\n");
}

// Export for use in other scripts
module.exports = { EventIndexer };

// Run if executed directly
if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}

