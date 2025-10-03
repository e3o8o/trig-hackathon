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
 * @title AutomatedTithe
 * @author Trig Protocol Team
 * @notice Automated recurring giving system for organizations
 * @dev Integrates with TrigImmutableCore for condition-based execution
 * @custom:security-contact security@trignetwork.com
 */
contract AutomatedTithe is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // ==================== DATA STRUCTURES ====================
    
    enum TitheFrequency {
        WEEKLY,
        BIWEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY
    }
    
    enum TitheStatus {
        ACTIVE,
        PAUSED,
        CANCELLED,
        COMPLETED
    }
    
    struct TitheCommitment {
        uint256 commitmentId;
        address giver;
        address organization;
        uint256 amount;
        address token; // address(0) for ETH
        TitheFrequency frequency;
        uint256 startTime;
        uint256 endTime; // 0 for indefinite
        uint256 lastPaymentTime;
        uint256 totalPaid;
        uint256 paymentCount;
        TitheStatus status;
        uint256 trigConditionId; // Link to Trig condition
    }
    
    // ==================== STATE VARIABLES ====================
    
    /// @notice Reference to TrigImmutableCore contract
    TrigImmutableCore public immutable trigCore;
    
    /// @notice Reference to StewardOracleRegistry contract
    StewardOracleRegistry public immutable oracleRegistry;
    
    /// @notice Mapping from commitment ID to commitment data
    mapping(uint256 => TitheCommitment) public commitments;
    
    /// @notice Mapping from giver to their commitment IDs
    mapping(address => uint256[]) public giverCommitments;
    
    /// @notice Mapping from organization to their commitment IDs
    mapping(address => uint256[]) public organizationCommitments;
    
    /// @notice Counter for commitment IDs
    uint256 public commitmentCounter;
    
    /// @notice Total amount given through the system
    uint256 public totalAmountGiven;
    
    /// @notice Total number of payments processed
    uint256 public totalPaymentsProcessed;
    
    // ==================== EVENTS ====================
    
    event CommitmentCreated(
        uint256 indexed commitmentId,
        address indexed giver,
        address indexed organization,
        uint256 amount,
        TitheFrequency frequency
    );
    
    event TithePaid(
        uint256 indexed commitmentId,
        address indexed giver,
        address indexed organization,
        uint256 amount,
        uint256 paymentNumber
    );
    
    event CommitmentPaused(
        uint256 indexed commitmentId,
        address indexed giver
    );
    
    event CommitmentResumed(
        uint256 indexed commitmentId,
        address indexed giver
    );
    
    event CommitmentCancelled(
        uint256 indexed commitmentId,
        address indexed giver
    );
    
    event CommitmentCompleted(
        uint256 indexed commitmentId,
        uint256 totalPaid,
        uint256 paymentCount
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
    
    // ==================== TITHE COMMITMENT FUNCTIONS ====================
    
    /**
     * @notice Create a new tithe commitment
     * @param organization Address of the receiving organization
     * @param amount Amount per payment
     * @param token Token address (address(0) for ETH)
     * @param frequency Payment frequency
     * @param endTime End timestamp (0 for indefinite)
     */
    function createCommitment(
        address organization,
        uint256 amount,
        address token,
        TitheFrequency frequency,
        uint256 endTime
    ) external payable nonReentrant whenNotPaused returns (uint256) {
        require(
            oracleRegistry.isOrganizationVerified(organization),
            "Organization not verified"
        );
        require(amount > 0, "Amount must be greater than 0");
        require(
            endTime == 0 || endTime > block.timestamp,
            "End time must be in future"
        );
        
        // For ETH payments, require first payment upfront
        if (token == address(0)) {
            require(msg.value == amount, "Must send first payment");
        } else {
            require(msg.value == 0, "Do not send ETH for token payments");
        }
        
        uint256 commitmentId = commitmentCounter++;
        
        commitments[commitmentId] = TitheCommitment({
            commitmentId: commitmentId,
            giver: msg.sender,
            organization: organization,
            amount: amount,
            token: token,
            frequency: frequency,
            startTime: block.timestamp,
            endTime: endTime,
            lastPaymentTime: 0,
            totalPaid: 0,
            paymentCount: 0,
            status: TitheStatus.ACTIVE,
            trigConditionId: 0 // Will be set when condition is created
        });
        
        giverCommitments[msg.sender].push(commitmentId);
        organizationCommitments[organization].push(commitmentId);
        
        emit CommitmentCreated(
            commitmentId,
            msg.sender,
            organization,
            amount,
            frequency
        );
        
        // Make first payment immediately if ETH was sent
        if (token == address(0) && msg.value > 0) {
            _processTithePayment(commitmentId);
        }
        
        return commitmentId;
    }
    
    /**
     * @notice Execute a tithe payment
     * @param commitmentId ID of the commitment to execute
     */
    function executeTithePayment(uint256 commitmentId)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        TitheCommitment storage commitment = commitments[commitmentId];
        require(commitment.status == TitheStatus.ACTIVE, "Commitment not active");
        require(_isPaymentDue(commitment), "Payment not due yet");
        
        // For ETH, require the payment amount
        if (commitment.token == address(0)) {
            require(msg.value == commitment.amount, "Incorrect payment amount");
        } else {
            require(msg.value == 0, "Do not send ETH");
        }
        
        _processTithePayment(commitmentId);
    }
    
    /**
     * @notice Pause a commitment
     * @param commitmentId ID of the commitment to pause
     */
    function pauseCommitment(uint256 commitmentId) external nonReentrant {
        TitheCommitment storage commitment = commitments[commitmentId];
        require(commitment.giver == msg.sender, "Not the giver");
        require(commitment.status == TitheStatus.ACTIVE, "Not active");
        
        commitment.status = TitheStatus.PAUSED;
        
        emit CommitmentPaused(commitmentId, msg.sender);
    }
    
    /**
     * @notice Resume a paused commitment
     * @param commitmentId ID of the commitment to resume
     */
    function resumeCommitment(uint256 commitmentId) external nonReentrant {
        TitheCommitment storage commitment = commitments[commitmentId];
        require(commitment.giver == msg.sender, "Not the giver");
        require(commitment.status == TitheStatus.PAUSED, "Not paused");
        
        commitment.status = TitheStatus.ACTIVE;
        
        emit CommitmentResumed(commitmentId, msg.sender);
    }
    
    /**
     * @notice Cancel a commitment
     * @param commitmentId ID of the commitment to cancel
     */
    function cancelCommitment(uint256 commitmentId) external nonReentrant {
        TitheCommitment storage commitment = commitments[commitmentId];
        require(commitment.giver == msg.sender, "Not the giver");
        require(
            commitment.status == TitheStatus.ACTIVE || commitment.status == TitheStatus.PAUSED,
            "Cannot cancel"
        );
        
        commitment.status = TitheStatus.CANCELLED;
        
        emit CommitmentCancelled(commitmentId, msg.sender);
    }
    
    // ==================== INTERNAL FUNCTIONS ====================
    
    /**
     * @notice Process a tithe payment
     * @param commitmentId ID of the commitment
     */
    function _processTithePayment(uint256 commitmentId) internal {
        TitheCommitment storage commitment = commitments[commitmentId];
        
        // Transfer funds to organization
        if (commitment.token == address(0)) {
            // ETH transfer
            (bool success, ) = commitment.organization.call{value: commitment.amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20 transfer
            IERC20(commitment.token).safeTransferFrom(
                commitment.giver,
                commitment.organization,
                commitment.amount
            );
        }
        
        // Update commitment state
        commitment.lastPaymentTime = block.timestamp;
        commitment.totalPaid += commitment.amount;
        commitment.paymentCount++;
        
        // Update global stats
        totalAmountGiven += commitment.amount;
        totalPaymentsProcessed++;
        
        emit TithePaid(
            commitmentId,
            commitment.giver,
            commitment.organization,
            commitment.amount,
            commitment.paymentCount
        );
        
        // Check if commitment is complete
        if (
            commitment.endTime > 0 &&
            block.timestamp >= commitment.endTime
        ) {
            commitment.status = TitheStatus.COMPLETED;
            emit CommitmentCompleted(
                commitmentId,
                commitment.totalPaid,
                commitment.paymentCount
            );
        }
    }
    
    /**
     * @notice Check if a payment is due
     * @param commitment The commitment to check
     */
    function _isPaymentDue(TitheCommitment memory commitment)
        internal
        view
        returns (bool)
    {
        // First payment is always due
        if (commitment.lastPaymentTime == 0) {
            return true;
        }
        
        // Check if commitment has ended
        if (commitment.endTime > 0 && block.timestamp >= commitment.endTime) {
            return false;
        }
        
        uint256 timeSinceLastPayment = block.timestamp - commitment.lastPaymentTime;
        uint256 paymentInterval = _getPaymentInterval(commitment.frequency);
        
        return timeSinceLastPayment >= paymentInterval;
    }
    
    /**
     * @notice Get payment interval in seconds for a frequency
     * @param frequency The tithe frequency
     */
    function _getPaymentInterval(TitheFrequency frequency)
        internal
        pure
        returns (uint256)
    {
        if (frequency == TitheFrequency.WEEKLY) {
            return 7 days;
        } else if (frequency == TitheFrequency.BIWEEKLY) {
            return 14 days;
        } else if (frequency == TitheFrequency.MONTHLY) {
            return 30 days;
        } else if (frequency == TitheFrequency.QUARTERLY) {
            return 90 days;
        } else if (frequency == TitheFrequency.YEARLY) {
            return 365 days;
        }
        return 30 days; // Default to monthly
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    /**
     * @notice Get commitment details
     * @param commitmentId ID of the commitment
     */
    function getCommitment(uint256 commitmentId)
        external
        view
        returns (
            address giver,
            address organization,
            uint256 amount,
            address token,
            TitheFrequency frequency,
            uint256 startTime,
            uint256 endTime,
            uint256 lastPaymentTime,
            uint256 totalPaid,
            uint256 paymentCount,
            TitheStatus status
        )
    {
        TitheCommitment memory c = commitments[commitmentId];
        return (
            c.giver,
            c.organization,
            c.amount,
            c.token,
            c.frequency,
            c.startTime,
            c.endTime,
            c.lastPaymentTime,
            c.totalPaid,
            c.paymentCount,
            c.status
        );
    }
    
    /**
     * @notice Get all commitment IDs for a giver
     * @param giver Address of the giver
     */
    function getGiverCommitments(address giver)
        external
        view
        returns (uint256[] memory)
    {
        return giverCommitments[giver];
    }
    
    /**
     * @notice Get all commitment IDs for an organization
     * @param organization Address of the organization
     */
    function getOrganizationCommitments(address organization)
        external
        view
        returns (uint256[] memory)
    {
        return organizationCommitments[organization];
    }
    
    /**
     * @notice Check if a payment is due for a commitment
     * @param commitmentId ID of the commitment
     */
    function isPaymentDue(uint256 commitmentId) external view returns (bool) {
        TitheCommitment memory commitment = commitments[commitmentId];
        return commitment.status == TitheStatus.ACTIVE && _isPaymentDue(commitment);
    }
    
    /**
     * @notice Get next payment time for a commitment
     * @param commitmentId ID of the commitment
     */
    function getNextPaymentTime(uint256 commitmentId)
        external
        view
        returns (uint256)
    {
        TitheCommitment memory commitment = commitments[commitmentId];
        
        if (commitment.lastPaymentTime == 0) {
            return block.timestamp; // First payment due now
        }
        
        uint256 interval = _getPaymentInterval(commitment.frequency);
        return commitment.lastPaymentTime + interval;
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
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
    
    // Allow contract to receive ETH
    receive() external payable {}
}

