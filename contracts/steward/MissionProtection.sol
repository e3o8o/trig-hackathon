// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../core/TrigImmutableCore.sol";
import "./StewardOracleRegistry.sol";

/**
 * @title MissionProtection
 * @author Trig Protocol Team
 * @notice Parametric insurance for mission trips and events
 * @dev Integrates with TrigImmutableCore for automated claim processing
 * @custom:security-contact security@trignetwork.com
 */
contract MissionProtection is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // ==================== DATA STRUCTURES ====================
    
    enum PolicyStatus {
        ACTIVE,
        CLAIMED,
        EXPIRED,
        CANCELLED
    }
    
    enum EventType {
        MISSION_TRIP,
        CHURCH_EVENT,
        RELIEF_OPERATION,
        CONSTRUCTION_PROJECT,
        MEDICAL_MISSION
    }
    
    struct Policy {
        uint256 policyId;
        address policyholder;
        address organization;
        EventType eventType;
        string eventName;
        string location;
        uint256 startDate;
        uint256 endDate;
        uint256 coverageAmount;
        uint256 premium;
        address coverageToken; // address(0) for ETH
        PolicyStatus status;
        uint256 purchaseTime;
        uint256 trigConditionId; // Linked Trig condition
        bool claimSubmitted;
        uint256 claimTime;
        uint256 payoutAmount;
    }
    
    struct Coverage {
        uint256 tripCancellation;
        uint256 emergencyEvacuation;
        uint256 medicalExpenses;
        uint256 equipmentLoss;
        uint256 delayCompensation;
    }
    
    // ==================== STATE VARIABLES ====================
    
    /// @notice Reference to TrigImmutableCore contract
    TrigImmutableCore public immutable trigCore;
    
    /// @notice Reference to StewardOracleRegistry contract
    StewardOracleRegistry public immutable oracleRegistry;
    
    /// @notice Mapping from policy ID to policy data
    mapping(uint256 => Policy) public policies;
    
    /// @notice Mapping from policy ID to coverage details
    mapping(uint256 => Coverage) public policyCoverages;
    
    /// @notice Mapping from policyholder to their policy IDs
    mapping(address => uint256[]) public holderPolicies;
    
    /// @notice Mapping from organization to their policy IDs
    mapping(address => uint256[]) public organizationPolicies;
    
    /// @notice Counter for policy IDs
    uint256 public policyCounter;
    
    /// @notice Premium rate per $1000 coverage (in basis points)
    /// @dev 100 = 1% premium
    uint256 public premiumRate = 200; // 2% default
    
    /// @notice Total premiums collected
    uint256 public totalPremiumsCollected;
    
    /// @notice Total claims paid
    uint256 public totalClaimsPaid;
    
    /// @notice Total active coverage amount
    uint256 public totalActiveCoverage;
    
    /// @notice Protocol fee percentage (in basis points)
    uint256 public protocolFee = 100; // 1%
    
    /// @notice Accumulated protocol fees
    uint256 public accumulatedFees;
    
    // ==================== EVENTS ====================
    
    event PolicyPurchased(
        uint256 indexed policyId,
        address indexed policyholder,
        address indexed organization,
        uint256 coverageAmount,
        uint256 premium
    );
    
    event ClaimSubmitted(
        uint256 indexed policyId,
        address indexed policyholder,
        uint256 claimAmount
    );
    
    event ClaimPaid(
        uint256 indexed policyId,
        address indexed policyholder,
        uint256 payoutAmount
    );
    
    event PolicyCancelled(
        uint256 indexed policyId,
        address indexed policyholder,
        uint256 refundAmount
    );
    
    event PolicyExpired(
        uint256 indexed policyId
    );
    
    event PremiumRateUpdated(
        uint256 oldRate,
        uint256 newRate
    );
    
    // ==================== CONSTRUCTOR ====================
    
    constructor(
        address payable _trigCore,
        address payable _oracleRegistry,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_trigCore != address(0), "Invalid TrigCore address");
        require(_oracleRegistry != address(0), "Invalid OracleRegistry address");
        
        trigCore = TrigImmutableCore(_trigCore);
        oracleRegistry = StewardOracleRegistry(_oracleRegistry);
    }
    
    // ==================== POLICY FUNCTIONS ====================
    
    /**
     * @notice Purchase a mission protection policy
     * @param organization Verified organization address
     * @param eventType Type of event
     * @param eventName Name of the event
     * @param location Location of the event
     * @param startDate Event start timestamp
     * @param endDate Event end timestamp
     * @param coverageAmount Total coverage amount
     * @param coverageToken Token for coverage (address(0) for ETH)
     */
    function purchasePolicy(
        address organization,
        EventType eventType,
        string calldata eventName,
        string calldata location,
        uint256 startDate,
        uint256 endDate,
        uint256 coverageAmount,
        address coverageToken
    ) external payable nonReentrant whenNotPaused returns (uint256) {
        require(
            oracleRegistry.isOrganizationVerified(organization),
            "Organization not verified"
        );
        require(startDate > block.timestamp, "Start date must be in future");
        require(endDate > startDate, "End date must be after start");
        require(coverageAmount > 0, "Coverage amount must be > 0");
        require(bytes(eventName).length > 0, "Event name required");
        require(bytes(location).length > 0, "Location required");
        
        // Calculate premium
        uint256 premium = calculatePremium(coverageAmount);
        require(msg.value == premium, "Incorrect premium amount");
        
        uint256 policyId = policyCounter++;
        
        policies[policyId] = Policy({
            policyId: policyId,
            policyholder: msg.sender,
            organization: organization,
            eventType: eventType,
            eventName: eventName,
            location: location,
            startDate: startDate,
            endDate: endDate,
            coverageAmount: coverageAmount,
            premium: premium,
            coverageToken: coverageToken,
            status: PolicyStatus.ACTIVE,
            purchaseTime: block.timestamp,
            trigConditionId: 0,
            claimSubmitted: false,
            claimTime: 0,
            payoutAmount: 0
        });
        
        holderPolicies[msg.sender].push(policyId);
        organizationPolicies[organization].push(policyId);
        
        // Calculate protocol fee
        uint256 fee = (premium * protocolFee) / 10000;
        accumulatedFees += fee;
        
        // Update stats
        totalPremiumsCollected += premium;
        totalActiveCoverage += coverageAmount;
        
        emit PolicyPurchased(
            policyId,
            msg.sender,
            organization,
            coverageAmount,
            premium
        );
        
        return policyId;
    }
    
    /**
     * @notice Submit a claim on a policy
     * @param policyId ID of the policy
     * @param claimAmount Amount to claim
     * @param claimReason Reason for the claim
     */
    function submitClaim(
        uint256 policyId,
        uint256 claimAmount,
        string calldata claimReason
    ) external nonReentrant whenNotPaused {
        Policy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not the policyholder");
        require(policy.status == PolicyStatus.ACTIVE, "Policy not active");
        require(!policy.claimSubmitted, "Claim already submitted");
        require(claimAmount > 0, "Claim amount must be > 0");
        require(claimAmount <= policy.coverageAmount, "Claim exceeds coverage");
        require(block.timestamp >= policy.startDate, "Event not started");
        require(block.timestamp <= policy.endDate + 30 days, "Claim period expired");
        require(bytes(claimReason).length > 0, "Claim reason required");
        
        policy.claimSubmitted = true;
        policy.claimTime = block.timestamp;
        
        emit ClaimSubmitted(policyId, msg.sender, claimAmount);
    }
    
    /**
     * @notice Process and approve a claim (owner only)
     * @param policyId ID of the policy
     * @param approvedAmount Amount approved for payout
     */
    function processClaim(uint256 policyId, uint256 approvedAmount)
        external
        onlyOwner
        nonReentrant
    {
        Policy storage policy = policies[policyId];
        require(policy.claimSubmitted, "No claim submitted");
        require(policy.status == PolicyStatus.ACTIVE, "Policy not active");
        require(approvedAmount > 0, "Approved amount must be > 0");
        require(approvedAmount <= policy.coverageAmount, "Exceeds coverage");
        require(address(this).balance >= approvedAmount, "Insufficient contract balance");
        
        policy.status = PolicyStatus.CLAIMED;
        policy.payoutAmount = approvedAmount;
        
        // Update stats
        totalClaimsPaid += approvedAmount;
        totalActiveCoverage -= policy.coverageAmount;
        
        // Transfer payout
        (bool success, ) = policy.policyholder.call{value: approvedAmount}("");
        require(success, "Payout transfer failed");
        
        emit ClaimPaid(policyId, policy.policyholder, approvedAmount);
    }
    
    /**
     * @notice Cancel a policy before it starts
     * @param policyId ID of the policy to cancel
     */
    function cancelPolicy(uint256 policyId) external nonReentrant {
        Policy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not the policyholder");
        require(policy.status == PolicyStatus.ACTIVE, "Policy not active");
        require(block.timestamp < policy.startDate, "Event already started");
        
        policy.status = PolicyStatus.CANCELLED;
        
        // Calculate refund (90% of premium, 10% cancellation fee)
        uint256 refundAmount = (policy.premium * 9000) / 10000;
        
        // Update stats
        totalActiveCoverage -= policy.coverageAmount;
        
        // Transfer refund
        if (refundAmount > 0) {
            (bool success, ) = msg.sender.call{value: refundAmount}("");
            require(success, "Refund transfer failed");
        }
        
        emit PolicyCancelled(policyId, msg.sender, refundAmount);
    }
    
    /**
     * @notice Mark expired policies
     * @param policyId ID of the policy to expire
     */
    function expirePolicy(uint256 policyId) external {
        Policy storage policy = policies[policyId];
        require(policy.status == PolicyStatus.ACTIVE, "Policy not active");
        require(block.timestamp > policy.endDate + 30 days, "Not expired yet");
        
        policy.status = PolicyStatus.EXPIRED;
        totalActiveCoverage -= policy.coverageAmount;
        
        emit PolicyExpired(policyId);
    }
    
    // ==================== CALCULATION FUNCTIONS ====================
    
    /**
     * @notice Calculate premium for a coverage amount
     * @param coverageAmount Amount of coverage
     */
    function calculatePremium(uint256 coverageAmount)
        public
        view
        returns (uint256)
    {
        // Premium = (coverageAmount * premiumRate) / 10000
        // Example: $10,000 coverage at 2% = $200 premium
        return (coverageAmount * premiumRate) / 10000;
    }
    
    /**
     * @notice Calculate refund for early cancellation
     * @param policyId ID of the policy
     */
    function calculateCancellationRefund(uint256 policyId)
        external
        view
        returns (uint256)
    {
        Policy memory policy = policies[policyId];
        
        if (policy.status != PolicyStatus.ACTIVE) {
            return 0;
        }
        
        if (block.timestamp >= policy.startDate) {
            return 0; // No refund after event starts
        }
        
        // 90% refund before event starts
        return (policy.premium * 9000) / 10000;
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @notice Get policy details
     * @param policyId ID of the policy
     */
    function getPolicy(uint256 policyId)
        external
        view
        returns (
            address policyholder,
            address organization,
            EventType eventType,
            string memory eventName,
            string memory location,
            uint256 startDate,
            uint256 endDate,
            uint256 coverageAmount,
            uint256 premium,
            PolicyStatus status,
            bool claimSubmitted,
            uint256 payoutAmount
        )
    {
        Policy memory p = policies[policyId];
        return (
            p.policyholder,
            p.organization,
            p.eventType,
            p.eventName,
            p.location,
            p.startDate,
            p.endDate,
            p.coverageAmount,
            p.premium,
            p.status,
            p.claimSubmitted,
            p.payoutAmount
        );
    }
    
    /**
     * @notice Get all policy IDs for a holder
     * @param holder Address of the policyholder
     */
    function getHolderPolicies(address holder)
        external
        view
        returns (uint256[] memory)
    {
        return holderPolicies[holder];
    }
    
    /**
     * @notice Get all policy IDs for an organization
     * @param organization Address of the organization
     */
    function getOrganizationPolicies(address organization)
        external
        view
        returns (uint256[] memory)
    {
        return organizationPolicies[organization];
    }
    
    /**
     * @notice Get contract statistics
     */
    function getStats()
        external
        view
        returns (
            uint256 totalPolicies,
            uint256 premiumsCollected,
            uint256 claimsPaid,
            uint256 activeCoverage
        )
    {
        return (
            policyCounter,
            totalPremiumsCollected,
            totalClaimsPaid,
            totalActiveCoverage
        );
    }
    
    /**
     * @notice Check if a policy is active
     * @param policyId ID of the policy
     */
    function isPolicyActive(uint256 policyId) external view returns (bool) {
        return policies[policyId].status == PolicyStatus.ACTIVE;
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @notice Update premium rate
     * @param newRate New premium rate in basis points
     */
    function setPremiumRate(uint256 newRate) external onlyOwner {
        require(newRate > 0 && newRate <= 1000, "Invalid rate"); // Max 10%
        
        uint256 oldRate = premiumRate;
        premiumRate = newRate;
        
        emit PremiumRateUpdated(oldRate, newRate);
    }
    
    /**
     * @notice Update protocol fee
     * @param newFee New protocol fee in basis points
     */
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high"); // Max 5%
        protocolFee = newFee;
    }
    
    /**
     * @notice Withdraw accumulated protocol fees
     * @param to Address to send fees to
     */
    function withdrawFees(address payable to) external onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 amount = accumulatedFees;
        require(amount > 0, "No fees to withdraw");
        
        accumulatedFees = 0;
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }
    
    /**
     * @notice Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice Emergency withdrawal (only when paused)
     * @param to Address to send funds to
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address payable to, uint256 amount)
        external
        onlyOwner
    {
        require(paused(), "Must be paused");
        require(to != address(0), "Invalid address");
        require(amount <= address(this).balance, "Insufficient balance");
        
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}

