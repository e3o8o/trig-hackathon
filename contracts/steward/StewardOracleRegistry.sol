// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StewardOracleRegistry
 * @author Trig Protocol Team
 * @notice Registry for verified organizations with staking-based verification
 * @dev Implements organization verification, leader management, and reputation tracking
 * @custom:security-contact security@trignetwork.com
 */
contract StewardOracleRegistry is AccessControl, Pausable, ReentrancyGuard {
    
    // ==================== ROLES ====================
    
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // ==================== DATA STRUCTURES ====================
    
    enum OrganizationStatus {
        PENDING,      // Application submitted
        VERIFIED,     // Fully verified
        SUSPENDED,    // Temporarily suspended
        REVOKED       // Permanently revoked
    }
    
    struct Organization {
        address organizationAddress;
        string name;
        string description;
        string website;
        uint256 registrationTime;
        OrganizationStatus status;
        uint256 stakeAmount;
        uint256 reputationScore;
        address[] leaders;
        uint256 verifierCount;
        mapping(address => bool) isLeader;
        mapping(address => bool) hasVerified;
    }
    
    struct Leader {
        address leaderAddress;
        address organization;
        string name;
        string role;
        uint256 addedTime;
        bool isActive;
    }
    
    struct Verifier {
        address verifierAddress;
        uint256 stakeAmount;
        uint256 verificationsCount;
        uint256 slashedAmount;
        bool isActive;
    }
    
    // ==================== STATE VARIABLES ====================
    
    /// @notice Minimum stake required for organization registration
    uint256 public minOrganizationStake = 0.1 ether;
    
    /// @notice Minimum stake required to become a verifier
    uint256 public minVerifierStake = 0.5 ether;
    
    /// @notice Number of verifications needed for organization approval
    uint256 public requiredVerifications = 3;
    
    /// @notice Slash percentage for malicious behavior (in basis points, e.g., 1000 = 10%)
    uint256 public slashPercentage = 1000; // 10%
    
    /// @notice Mapping from organization address to organization data
    mapping(address => Organization) private organizations;
    
    /// @notice Array of all registered organization addresses
    address[] public organizationList;
    
    /// @notice Mapping from leader address to leader data
    mapping(address => Leader) public leaders;
    
    /// @notice Mapping from verifier address to verifier data
    mapping(address => Verifier) public verifiers;
    
    /// @notice Array of all verifier addresses
    address[] public verifierList;
    
    // ==================== EVENTS ====================
    
    event OrganizationRegistered(
        address indexed organization,
        string name,
        uint256 stakeAmount
    );
    
    event OrganizationVerified(
        address indexed organization,
        address indexed verifier
    );
    
    event OrganizationStatusChanged(
        address indexed organization,
        OrganizationStatus newStatus
    );
    
    event LeaderAdded(
        address indexed organization,
        address indexed leader,
        string name,
        string role
    );
    
    event LeaderRemoved(
        address indexed organization,
        address indexed leader
    );
    
    event VerifierRegistered(
        address indexed verifier,
        uint256 stakeAmount
    );
    
    event VerifierSlashed(
        address indexed verifier,
        uint256 slashedAmount,
        string reason
    );
    
    event StakeIncreased(
        address indexed account,
        uint256 additionalAmount,
        uint256 newTotal
    );
    
    event StakeWithdrawn(
        address indexed account,
        uint256 amount
    );
    
    event ReputationUpdated(
        address indexed organization,
        uint256 oldScore,
        uint256 newScore
    );
    
    // ==================== CONSTRUCTOR ====================
    
    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(VERIFIER_ROLE, admin); // Admin is initial verifier
    }
    
    // ==================== ORGANIZATION FUNCTIONS ====================
    
    /**
     * @notice Register a new organization with stake
     * @param name Organization name
     * @param description Brief description
     * @param website Organization website
     */
    function registerOrganization(
        string calldata name,
        string calldata description,
        string calldata website
    ) external payable whenNotPaused {
        require(msg.value >= minOrganizationStake, "Insufficient stake");
        require(
            organizations[msg.sender].registrationTime == 0,
            "Organization already registered"
        );
        require(bytes(name).length > 0, "Name required");
        
        Organization storage org = organizations[msg.sender];
        org.organizationAddress = msg.sender;
        org.name = name;
        org.description = description;
        org.website = website;
        org.registrationTime = block.timestamp;
        org.status = OrganizationStatus.PENDING;
        org.stakeAmount = msg.value;
        org.reputationScore = 100; // Start with base score
        
        organizationList.push(msg.sender);
        
        emit OrganizationRegistered(msg.sender, name, msg.value);
    }
    
    /**
     * @notice Verify an organization (verifier function)
     * @param organization Address of organization to verify
     */
    function verifyOrganization(address organization)
        external
        onlyRole(VERIFIER_ROLE)
        whenNotPaused
    {
        Organization storage org = organizations[organization];
        require(org.registrationTime > 0, "Organization not registered");
        require(org.status == OrganizationStatus.PENDING, "Not in pending status");
        require(!org.hasVerified[msg.sender], "Already verified by you");
        
        org.hasVerified[msg.sender] = true;
        org.verifierCount++;
        
        verifiers[msg.sender].verificationsCount++;
        
        emit OrganizationVerified(organization, msg.sender);
        
        // Auto-approve if enough verifications
        if (org.verifierCount >= requiredVerifications) {
            org.status = OrganizationStatus.VERIFIED;
            emit OrganizationStatusChanged(organization, OrganizationStatus.VERIFIED);
        }
    }
    
    /**
     * @notice Add a leader to the organization
     * @param leader Address of the leader
     * @param name Leader's name
     * @param role Leader's role
     */
    function addLeader(
        address leader,
        string calldata name,
        string calldata role
    ) external whenNotPaused {
        Organization storage org = organizations[msg.sender];
        require(org.status == OrganizationStatus.VERIFIED, "Organization not verified");
        require(!org.isLeader[leader], "Already a leader");
        require(leader != address(0), "Invalid leader address");
        
        org.leaders.push(leader);
        org.isLeader[leader] = true;
        
        leaders[leader] = Leader({
            leaderAddress: leader,
            organization: msg.sender,
            name: name,
            role: role,
            addedTime: block.timestamp,
            isActive: true
        });
        
        emit LeaderAdded(msg.sender, leader, name, role);
    }
    
    /**
     * @notice Remove a leader from the organization
     * @param leader Address of the leader to remove
     */
    function removeLeader(address leader) external whenNotPaused {
        Organization storage org = organizations[msg.sender];
        require(org.isLeader[leader], "Not a leader");
        
        org.isLeader[leader] = false;
        leaders[leader].isActive = false;
        
        emit LeaderRemoved(msg.sender, leader);
    }
    
    /**
     * @notice Increase organization stake
     */
    function increaseOrganizationStake() external payable whenNotPaused {
        Organization storage org = organizations[msg.sender];
        require(org.registrationTime > 0, "Organization not registered");
        require(msg.value > 0, "Must send ETH");
        
        org.stakeAmount += msg.value;
        
        emit StakeIncreased(msg.sender, msg.value, org.stakeAmount);
    }
    
    // ==================== VERIFIER FUNCTIONS ====================
    
    /**
     * @notice Register as a verifier with stake
     */
    function registerVerifier() external payable whenNotPaused {
        require(msg.value >= minVerifierStake, "Insufficient stake");
        require(verifiers[msg.sender].verifierAddress == address(0), "Already registered");
        
        verifiers[msg.sender] = Verifier({
            verifierAddress: msg.sender,
            stakeAmount: msg.value,
            verificationsCount: 0,
            slashedAmount: 0,
            isActive: true
        });
        
        verifierList.push(msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        
        emit VerifierRegistered(msg.sender, msg.value);
    }
    
    /**
     * @notice Increase verifier stake
     */
    function increaseVerifierStake() external payable whenNotPaused {
        Verifier storage verifier = verifiers[msg.sender];
        require(verifier.isActive, "Not an active verifier");
        require(msg.value > 0, "Must send ETH");
        
        verifier.stakeAmount += msg.value;
        
        emit StakeIncreased(msg.sender, msg.value, verifier.stakeAmount);
    }
    
    /**
     * @notice Slash a verifier for malicious behavior (admin only)
     * @param verifier Address of verifier to slash
     * @param reason Reason for slashing
     */
    function slashVerifier(address verifier, string calldata reason)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Verifier storage v = verifiers[verifier];
        require(v.isActive, "Verifier not active");
        
        uint256 slashAmount = (v.stakeAmount * slashPercentage) / 10000;
        v.slashedAmount += slashAmount;
        v.stakeAmount -= slashAmount;
        
        if (v.stakeAmount < minVerifierStake) {
            v.isActive = false;
            _revokeRole(VERIFIER_ROLE, verifier);
        }
        
        emit VerifierSlashed(verifier, slashAmount, reason);
    }
    
    // ==================== REPUTATION FUNCTIONS ====================
    
    /**
     * @notice Update organization reputation (admin only)
     * @param organization Address of organization
     * @param newScore New reputation score
     */
    function updateReputation(address organization, uint256 newScore)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Organization storage org = organizations[organization];
        require(org.registrationTime > 0, "Organization not registered");
        
        uint256 oldScore = org.reputationScore;
        org.reputationScore = newScore;
        
        emit ReputationUpdated(organization, oldScore, newScore);
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @notice Get organization details
     * @param organization Address of organization
     */
    function getOrganization(address organization)
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory website,
            uint256 registrationTime,
            OrganizationStatus status,
            uint256 stakeAmount,
            uint256 reputationScore,
            address[] memory organizationLeaders,
            uint256 verifierCount
        )
    {
        Organization storage org = organizations[organization];
        return (
            org.name,
            org.description,
            org.website,
            org.registrationTime,
            org.status,
            org.stakeAmount,
            org.reputationScore,
            org.leaders,
            org.verifierCount
        );
    }
    
    /**
     * @notice Check if an organization is verified
     * @param organization Address to check
     */
    function isOrganizationVerified(address organization)
        external
        view
        returns (bool)
    {
        return organizations[organization].status == OrganizationStatus.VERIFIED;
    }
    
    /**
     * @notice Check if an address is a leader of an organization
     * @param leader Address to check
     * @param organization Organization address
     */
    function isLeaderOf(address leader, address organization)
        external
        view
        returns (bool)
    {
        return organizations[organization].isLeader[leader];
    }
    
    /**
     * @notice Get total number of registered organizations
     */
    function getOrganizationCount() external view returns (uint256) {
        return organizationList.length;
    }
    
    /**
     * @notice Get total number of verifiers
     */
    function getVerifierCount() external view returns (uint256) {
        return verifierList.length;
    }
    
    /**
     * @notice Get verifier details
     * @param verifier Address of verifier
     */
    function getVerifier(address verifier)
        external
        view
        returns (
            uint256 stakeAmount,
            uint256 verificationsCount,
            uint256 slashedAmount,
            bool isActive
        )
    {
        Verifier memory v = verifiers[verifier];
        return (v.stakeAmount, v.verificationsCount, v.slashedAmount, v.isActive);
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @notice Update minimum organization stake
     * @param newMinStake New minimum stake amount
     */
    function setMinOrganizationStake(uint256 newMinStake)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        minOrganizationStake = newMinStake;
    }
    
    /**
     * @notice Update minimum verifier stake
     * @param newMinStake New minimum stake amount
     */
    function setMinVerifierStake(uint256 newMinStake)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        minVerifierStake = newMinStake;
    }
    
    /**
     * @notice Update required verifications count
     * @param count New required verifications
     */
    function setRequiredVerifications(uint256 count)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(count > 0, "Must require at least 1");
        requiredVerifications = count;
    }
    
    /**
     * @notice Update slash percentage
     * @param percentage New slash percentage in basis points
     */
    function setSlashPercentage(uint256 percentage)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(percentage <= 5000, "Cannot slash more than 50%");
        slashPercentage = percentage;
    }
    
    /**
     * @notice Suspend an organization
     * @param organization Address to suspend
     */
    function suspendOrganization(address organization)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Organization storage org = organizations[organization];
        require(org.status == OrganizationStatus.VERIFIED, "Not verified");
        
        org.status = OrganizationStatus.SUSPENDED;
        emit OrganizationStatusChanged(organization, OrganizationStatus.SUSPENDED);
    }
    
    /**
     * @notice Revoke an organization
     * @param organization Address to revoke
     */
    function revokeOrganization(address organization)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Organization storage org = organizations[organization];
        require(org.registrationTime > 0, "Not registered");
        
        org.status = OrganizationStatus.REVOKED;
        emit OrganizationStatusChanged(organization, OrganizationStatus.REVOKED);
    }
    
    /**
     * @notice Pause the contract
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Emergency withdrawal (only when paused)
     * @param to Address to send funds to
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address payable to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
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

