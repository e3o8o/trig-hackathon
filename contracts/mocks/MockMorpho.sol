// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockMorpho
 * @notice Mock implementation of Morpho protocol for testing DeFi backing
 * @dev Simulates deposit, withdraw, and yield generation for hackathon demo
 */
contract MockMorpho {
    using SafeERC20 for IERC20;

    // ==================== STRUCTS ====================
    
    struct Position {
        uint256 shares;
        uint256 depositedAmount;
        uint256 depositTime;
        address asset;
    }

    // ==================== STATE VARIABLES ====================
    
    /// @notice Mock yield rate in basis points (e.g., 500 = 5% APY)
    uint256 public yieldRateBps = 500; // 5% APY
    
    /// @notice Seconds in a year for yield calculation
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    /// @notice Total value locked in the protocol
    uint256 public totalValueLocked;
    
    /// @notice User positions mapping
    mapping(address => Position) public positions;
    
    /// @notice Total shares per asset
    mapping(address => uint256) public totalShares;
    
    /// @notice Total assets deposited per token
    mapping(address => uint256) public totalAssets;
    
    // ==================== EVENTS ====================
    
    event Deposit(
        address indexed user,
        address indexed asset,
        uint256 amount,
        uint256 shares
    );
    
    event Withdraw(
        address indexed user,
        address indexed asset,
        uint256 amount,
        uint256 shares
    );
    
    event YieldAccrued(
        address indexed user,
        address indexed asset,
        uint256 yieldAmount
    );
    
    event YieldRateUpdated(
        uint256 oldRate,
        uint256 newRate
    );
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() {}
    
    // ==================== DEPOSIT FUNCTIONS ====================
    
    /**
     * @notice Deposit assets into the mock protocol
     * @param asset Address of the token to deposit
     * @param amount Amount to deposit
     * @return shares Amount of shares minted
     */
    function deposit(
        address asset,
        uint256 amount
    ) external returns (uint256 shares) {
        require(amount > 0, "Amount must be > 0");
        
        // Transfer tokens from user
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        
        // Calculate shares (1:1 initially, then based on total)
        if (totalShares[asset] == 0) {
            shares = amount;
        } else {
            shares = (amount * totalShares[asset]) / totalAssets[asset];
        }
        
        // Update user position
        Position storage pos = positions[msg.sender];
        
        // If user has existing position in different asset, this is a new position
        if (pos.asset != address(0) && pos.asset != asset) {
            revert("User already has position in different asset");
        }
        
        pos.shares += shares;
        pos.depositedAmount += amount;
        pos.depositTime = block.timestamp;
        pos.asset = asset;
        
        // Update global state
        totalShares[asset] += shares;
        totalAssets[asset] += amount;
        totalValueLocked += amount;
        
        emit Deposit(msg.sender, asset, amount, shares);
        
        return shares;
    }
    
    /**
     * @notice Deposit ETH into the mock protocol
     * @return shares Amount of shares minted
     */
    function depositETH() external payable returns (uint256 shares) {
        require(msg.value > 0, "Amount must be > 0");
        
        address asset = address(0); // ETH
        uint256 amount = msg.value;
        
        // Calculate shares
        if (totalShares[asset] == 0) {
            shares = amount;
        } else {
            shares = (amount * totalShares[asset]) / totalAssets[asset];
        }
        
        // Update user position
        Position storage pos = positions[msg.sender];
        
        if (pos.asset != address(0) && pos.asset != asset) {
            revert("User already has position in different asset");
        }
        
        pos.shares += shares;
        pos.depositedAmount += amount;
        pos.depositTime = block.timestamp;
        pos.asset = asset;
        
        // Update global state
        totalShares[asset] += shares;
        totalAssets[asset] += amount;
        totalValueLocked += amount;
        
        emit Deposit(msg.sender, asset, amount, shares);
        
        return shares;
    }
    
    // ==================== WITHDRAW FUNCTIONS ====================
    
    /**
     * @notice Withdraw assets from the mock protocol with accrued yield
     * @param asset Address of the token to withdraw
     * @param sharesToWithdraw Amount of shares to withdraw
     * @return amount Amount of assets withdrawn (including yield)
     */
    function withdraw(
        address asset,
        uint256 sharesToWithdraw
    ) external returns (uint256 amount) {
        Position storage pos = positions[msg.sender];
        require(pos.asset == asset, "Wrong asset");
        require(pos.shares >= sharesToWithdraw, "Insufficient shares");
        
        // Calculate amount with yield
        uint256 totalAmount = (sharesToWithdraw * totalAssets[asset]) / totalShares[asset];
        uint256 yield = calculateYield(msg.sender);
        amount = totalAmount + yield;
        
        // Update user position
        pos.shares -= sharesToWithdraw;
        if (pos.shares == 0) {
            pos.depositedAmount = 0;
            pos.depositTime = 0;
            pos.asset = address(0);
        }
        
        // Update global state
        totalShares[asset] -= sharesToWithdraw;
        totalAssets[asset] -= amount;
        totalValueLocked -= amount;
        
        // Transfer tokens to user
        if (asset == address(0)) {
            // ETH
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            // ERC20
            IERC20(asset).safeTransfer(msg.sender, amount);
        }
        
        if (yield > 0) {
            emit YieldAccrued(msg.sender, asset, yield);
        }
        
        emit Withdraw(msg.sender, asset, amount, sharesToWithdraw);
        
        return amount;
    }
    
    /**
     * @notice Withdraw all assets with yield
     * @param asset Address of the token to withdraw
     * @return amount Amount of assets withdrawn
     */
    function withdrawAll(address asset) external returns (uint256 amount) {
        Position storage pos = positions[msg.sender];
        require(pos.asset == asset, "Wrong asset");
        require(pos.shares > 0, "No position");
        
        uint256 shares = pos.shares;
        return this.withdraw(asset, shares);
    }
    
    // ==================== YIELD CALCULATION ====================
    
    /**
     * @notice Calculate accrued yield for a user
     * @param user Address of the user
     * @return yieldAmount Amount of yield accrued
     */
    function calculateYield(address user) public view returns (uint256 yieldAmount) {
        Position memory pos = positions[user];
        
        if (pos.shares == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - pos.depositTime;
        
        // Simple interest: principal * rate * time / (basis points * seconds per year)
        yieldAmount = (pos.depositedAmount * yieldRateBps * timeElapsed) / 
                      (10000 * SECONDS_PER_YEAR);
        
        return yieldAmount;
    }
    
    /**
     * @notice Get total balance for a user (deposited + yield)
     * @param user Address of the user
     * @return totalBalance Total balance including yield
     */
    function balanceOf(address user) external view returns (uint256 totalBalance) {
        Position memory pos = positions[user];
        
        if (pos.shares == 0) {
            return 0;
        }
        
        uint256 shareValue = (pos.shares * totalAssets[pos.asset]) / totalShares[pos.asset];
        uint256 yield = calculateYield(user);
        
        return shareValue + yield;
    }
    
    /**
     * @notice Get user position details
     * @param user Address of the user
     * @return shares User's shares
     * @return depositedAmount Amount originally deposited
     * @return currentValue Current value including yield
     * @return yieldAccrued Yield accrued so far
     */
    function getPosition(address user) 
        external 
        view 
        returns (
            uint256 shares,
            uint256 depositedAmount,
            uint256 currentValue,
            uint256 yieldAccrued
        ) 
    {
        Position memory pos = positions[user];
        
        shares = pos.shares;
        depositedAmount = pos.depositedAmount;
        
        if (pos.shares > 0) {
            uint256 shareValue = (pos.shares * totalAssets[pos.asset]) / totalShares[pos.asset];
            yieldAccrued = calculateYield(user);
            currentValue = shareValue + yieldAccrued;
        } else {
            currentValue = 0;
            yieldAccrued = 0;
        }
        
        return (shares, depositedAmount, currentValue, yieldAccrued);
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    /**
     * @notice Update the mock yield rate (for testing)
     * @param newRateBps New yield rate in basis points
     */
    function setYieldRate(uint256 newRateBps) external {
        require(newRateBps <= 10000, "Rate too high"); // Max 100% APY
        
        uint256 oldRate = yieldRateBps;
        yieldRateBps = newRateBps;
        
        emit YieldRateUpdated(oldRate, newRateBps);
    }
    
    /**
     * @notice Get protocol statistics
     * @return tvl Total value locked
     * @return currentYieldRate Current yield rate in basis points
     */
    function getProtocolStats() 
        external 
        view 
        returns (
            uint256 tvl,
            uint256 currentYieldRate
        ) 
    {
        return (totalValueLocked, yieldRateBps);
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}

