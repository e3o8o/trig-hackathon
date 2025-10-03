// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title TrigImmutableCore
 * @author Trig Protocol Team
 * @notice Core protocol for parametric condition execution
 * @dev Minimal, deterministic condition registry and execution engine
 * @custom:security-contact security@trignetwork.com
 */
contract TrigImmutableCore is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ==================== DATA STRUCTURES ====================

    enum ConditionType {
        TIME_BASED,      // Trigger at specific timestamp
        BLOCK_BASED,     // Trigger at specific block
        TOKEN_BALANCE,   // Trigger on balance threshold
        MULTISIG_APPROVAL // Trigger on signature collection
    }

    enum ConditionStatus {
        ACTIVE,      // Monitoring for trigger
        EXECUTED,    // Successfully executed
        EXPIRED,     // Expired without execution
        CANCELLED    // Manually cancelled
    }

    struct ImmutableCondition {
        uint256 conditionId;
        address creator;
        uint256 createdAt;
        ConditionType conditionType;
        bytes triggerData;
        bytes32 triggerHash;
        uint256 premiumPaid;
        uint256 payoutAmount;
        address payoutToken; // address(0) for native ETH
        ConditionStatus status;
        uint256 executedAt;
        address executor;
        uint256 expirationTime;
    }

    // ==================== STATE VARIABLES ====================

    /// @notice Counter for generating unique condition IDs
    uint256 public conditionCounter;

    /// @notice Mapping from condition ID to condition data
    mapping(uint256 => ImmutableCondition) public conditions;

    /// @notice Mapping from user address to their condition IDs
    mapping(address => uint256[]) public userConditions;

    /// @notice Mapping for multisig approvals
    mapping(uint256 => mapping(address => bool)) public conditionApprovals;

    /// @notice Mapping for multisig approval counts
    mapping(uint256 => uint256) public approvalCounts;

    // ==================== EVENTS ====================

    event ConditionCreated(
        uint256 indexed conditionId,
        address indexed creator,
        ConditionType conditionType,
        uint256 payoutAmount
    );

    event ConditionExecuted(
        uint256 indexed conditionId,
        address indexed executor,
        uint256 payoutAmount
    );

    event ConditionCancelled(
        uint256 indexed conditionId,
        address indexed creator
    );

    event ConditionExpired(
        uint256 indexed conditionId
    );

    event ApprovalAdded(
        uint256 indexed conditionId,
        address indexed approver
    );

    // ==================== CONSTRUCTOR ====================

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ==================== CORE FUNCTIONS ====================

    /**
     * @notice Create a new parametric condition
     * @param conditionType Type of condition to create
     * @param triggerData Encoded trigger parameters
     * @param payoutAmount Amount to pay out when condition is met
     * @param payoutToken Token address for payout (address(0) for ETH)
     * @param expirationTime Timestamp when condition expires
     * @return conditionId Unique identifier for the condition
     */
    function createCondition(
        ConditionType conditionType,
        bytes calldata triggerData,
        uint256 payoutAmount,
        address payoutToken,
        uint256 expirationTime
    ) external payable whenNotPaused nonReentrant returns (uint256 conditionId) {
        require(payoutAmount > 0, "Payout must be > 0");
        require(expirationTime > block.timestamp, "Expiration must be future");

        // Handle collateral/premium
        if (payoutToken == address(0)) {
            require(msg.value >= payoutAmount, "Insufficient ETH sent");
        } else {
            IERC20(payoutToken).safeTransferFrom(
                msg.sender,
                address(this),
                payoutAmount
            );
        }

        conditionId = conditionCounter++;

        conditions[conditionId] = ImmutableCondition({
            conditionId: conditionId,
            creator: msg.sender,
            createdAt: block.timestamp,
            conditionType: conditionType,
            triggerData: triggerData,
            triggerHash: keccak256(triggerData),
            premiumPaid: msg.value,
            payoutAmount: payoutAmount,
            payoutToken: payoutToken,
            status: ConditionStatus.ACTIVE,
            executedAt: 0,
            executor: address(0),
            expirationTime: expirationTime
        });

        userConditions[msg.sender].push(conditionId);

        emit ConditionCreated(conditionId, msg.sender, conditionType, payoutAmount);
    }

    /**
     * @notice Execute a condition if trigger requirements are met
     * @param conditionId ID of the condition to execute
     */
    function executeCondition(uint256 conditionId)
        external
        whenNotPaused
        nonReentrant
    {
        ImmutableCondition storage condition = conditions[conditionId];
        
        require(condition.status == ConditionStatus.ACTIVE, "Condition not active");
        require(block.timestamp <= condition.expirationTime, "Condition expired");
        require(_isConditionMet(conditionId), "Condition not met");

        // Update status
        condition.status = ConditionStatus.EXECUTED;
        condition.executedAt = block.timestamp;
        condition.executor = msg.sender;

        // Execute payout
        if (condition.payoutToken == address(0)) {
            (bool success, ) = payable(condition.creator).call{value: condition.payoutAmount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(condition.payoutToken).safeTransfer(
                condition.creator,
                condition.payoutAmount
            );
        }

        emit ConditionExecuted(conditionId, msg.sender, condition.payoutAmount);
    }

    /**
     * @notice Cancel an active condition (only creator)
     * @param conditionId ID of the condition to cancel
     */
    function cancelCondition(uint256 conditionId) external nonReentrant {
        ImmutableCondition storage condition = conditions[conditionId];
        
        require(condition.creator == msg.sender, "Only creator can cancel");
        require(condition.status == ConditionStatus.ACTIVE, "Condition not active");

        condition.status = ConditionStatus.CANCELLED;

        // Refund collateral
        if (condition.payoutToken == address(0)) {
            (bool success, ) = payable(condition.creator).call{value: condition.payoutAmount}("");
            require(success, "ETH refund failed");
        } else {
            IERC20(condition.payoutToken).safeTransfer(
                condition.creator,
                condition.payoutAmount
            );
        }

        emit ConditionCancelled(conditionId, msg.sender);
    }

    /**
     * @notice Add approval for multisig condition
     * @param conditionId ID of the condition to approve
     */
    function addApproval(uint256 conditionId) external {
        ImmutableCondition memory condition = conditions[conditionId];
        
        require(condition.status == ConditionStatus.ACTIVE, "Condition not active");
        require(condition.conditionType == ConditionType.MULTISIG_APPROVAL, "Not multisig condition");
        require(!conditionApprovals[conditionId][msg.sender], "Already approved");

        conditionApprovals[conditionId][msg.sender] = true;
        approvalCounts[conditionId]++;

        emit ApprovalAdded(conditionId, msg.sender);
    }

    /**
     * @notice Mark expired conditions
     * @param conditionId ID of the condition to mark expired
     */
    function markExpired(uint256 conditionId) external {
        ImmutableCondition storage condition = conditions[conditionId];
        
        require(condition.status == ConditionStatus.ACTIVE, "Condition not active");
        require(block.timestamp > condition.expirationTime, "Not yet expired");

        condition.status = ConditionStatus.EXPIRED;

        // Refund collateral
        if (condition.payoutToken == address(0)) {
            (bool success, ) = payable(condition.creator).call{value: condition.payoutAmount}("");
            require(success, "ETH refund failed");
        } else {
            IERC20(condition.payoutToken).safeTransfer(
                condition.creator,
                condition.payoutAmount
            );
        }

        emit ConditionExpired(conditionId);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @notice Get condition details
     * @param conditionId ID of the condition
     * @return condition The condition data
     */
    function getCondition(uint256 conditionId)
        external
        view
        returns (ImmutableCondition memory condition)
    {
        return conditions[conditionId];
    }

    /**
     * @notice Check if condition requirements are met
     * @param conditionId ID of the condition
     * @return met Whether the condition is met
     */
    function isConditionMet(uint256 conditionId) external view returns (bool met) {
        return _isConditionMet(conditionId);
    }

    /**
     * @notice Get all conditions for a user
     * @param user Address of the user
     * @return conditionIds Array of condition IDs
     */
    function getUserConditions(address user)
        external
        view
        returns (uint256[] memory conditionIds)
    {
        return userConditions[user];
    }

    /**
     * @notice Get condition status
     * @param conditionId ID of the condition
     * @return status The condition status
     */
    function getConditionStatus(uint256 conditionId)
        external
        view
        returns (ConditionStatus status)
    {
        return conditions[conditionId].status;
    }

    // ==================== INTERNAL FUNCTIONS ====================

    /**
     * @notice Internal function to check if condition is met
     * @param conditionId ID of the condition
     * @return met Whether the condition is met
     */
    function _isConditionMet(uint256 conditionId) internal view returns (bool met) {
        ImmutableCondition memory condition = conditions[conditionId];

        if (condition.conditionType == ConditionType.TIME_BASED) {
            uint256 targetTime = abi.decode(condition.triggerData, (uint256));
            return block.timestamp >= targetTime;
        } 
        else if (condition.conditionType == ConditionType.BLOCK_BASED) {
            uint256 targetBlock = abi.decode(condition.triggerData, (uint256));
            return block.number >= targetBlock;
        }
        else if (condition.conditionType == ConditionType.TOKEN_BALANCE) {
            (address token, address holder, uint256 minBalance) = abi.decode(
                condition.triggerData,
                (address, address, uint256)
            );
            return IERC20(token).balanceOf(holder) >= minBalance;
        }
        else if (condition.conditionType == ConditionType.MULTISIG_APPROVAL) {
            uint256 requiredApprovals = abi.decode(condition.triggerData, (uint256));
            return approvalCounts[conditionId] >= requiredApprovals;
        }

        return false;
    }

    // ==================== ADMIN FUNCTIONS ====================

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdrawal (only owner, only in paused state)
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(paused(), "Must be paused");
        
        if (token == address(0)) {
            (bool success, ) = payable(owner()).call{value: amount}("");
            require(success, "ETH withdrawal failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    // Allow contract to receive ETH
    receive() external payable {}
}

