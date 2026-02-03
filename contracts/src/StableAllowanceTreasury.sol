// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title StableAllowanceTreasury
 * @notice Counter-Based Stable-Allowance Treasury - Initializable clone version
 * @dev Allows controlled periodic releases of USDC allowances.
 *      Owner increments approval counter, recipient claims fixed amounts.
 */
contract StableAllowanceTreasury is Initializable {
    // State
    IERC20 public USDC;
    address public owner;
    address public recipient;
    uint256 public allowancePerIncrement;

    uint256 public approvalCounter;
    uint256 public claimedCount;

    enum State { Active, Paused, Terminated }
    State public state;

    // Events
    event TreasuryInitialized(address indexed owner, address indexed recipient, uint256 allowancePerIncrement);
    event ApprovalIncremented(address indexed owner, uint256 newApprovalCount, uint256 incrementAmount);
    event AllowanceClaimed(address indexed recipient, uint256 amount, uint256 claimNumber);
    event Deposited(address indexed from, uint256 amount, uint256 newBalance);
    event StateChanged(State oldState, State newState);
    event EmergencyWithdrawal(address indexed to, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyRecipient() {
        require(msg.sender == recipient, "Only recipient");
        _;
    }

    modifier whenActive() {
        require(state == State.Active, "Treasury not active");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _usdcAddress,
        address _owner,
        address _recipient,
        uint256 _allowancePerIncrement
    ) external initializer {
        require(_usdcAddress != address(0), "Invalid USDC address");
        require(_owner != address(0), "Invalid owner");
        require(_recipient != address(0), "Invalid recipient");
        require(_allowancePerIncrement > 0, "Invalid allowance amount");
        require(_owner != _recipient, "Owner cannot be recipient");

        USDC = IERC20(_usdcAddress);
        owner = _owner;
        recipient = _recipient;
        allowancePerIncrement = _allowancePerIncrement;
        approvalCounter = 0;
        claimedCount = 0;
        state = State.Active;

        emit TreasuryInitialized(_owner, _recipient, _allowancePerIncrement);
    }

    // Core Functions
    function incrementCounter(uint256 _incrementBy) external onlyOwner whenActive {
        require(_incrementBy > 0, "Must increment by at least 1");

        approvalCounter += _incrementBy;

        emit ApprovalIncremented(msg.sender, approvalCounter, _incrementBy);
    }

    function claim() external onlyRecipient whenActive {
        require(claimedCount < approvalCounter, "No unclaimed allowances");

        uint256 balance = USDC.balanceOf(address(this));
        require(balance >= allowancePerIncrement, "Insufficient treasury balance");

        claimedCount++;

        bool success = USDC.transfer(recipient, allowancePerIncrement);
        require(success, "Transfer failed");

        emit AllowanceClaimed(recipient, allowancePerIncrement, claimedCount);
    }

    function deposit(uint256 _amount) external {
        require(_amount > 0, "Must deposit more than 0");

        bool success = USDC.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");

        emit Deposited(msg.sender, _amount, USDC.balanceOf(address(this)));
    }

    // Views
    function unclaimedAllowances() external view returns (uint256) {
        if (approvalCounter > claimedCount) {
            return approvalCounter - claimedCount;
        }
        return 0;
    }

    function treasuryBalance() external view returns (uint256) {
        return USDC.balanceOf(address(this));
    }

    function getTreasuryStatus()
        external
        view
        returns (
            address _owner,
            address _recipient,
            uint256 _allowancePerIncrement,
            uint256 _approvalCounter,
            uint256 _claimedCount,
            uint256 _unclaimed,
            uint256 _balance,
            State _state
        )
    {
        uint256 unclaimed = 0;
        if (approvalCounter > claimedCount) {
            unclaimed = approvalCounter - claimedCount;
        }

        return (
            owner,
            recipient,
            allowancePerIncrement,
            approvalCounter,
            claimedCount,
            unclaimed,
            USDC.balanceOf(address(this)),
            state
        );
    }

    // State Management
    function pause() external onlyOwner {
        require(state == State.Active, "Not active");
        State oldState = state;
        state = State.Paused;
        emit StateChanged(oldState, state);
    }

    function unpause() external onlyOwner {
        require(state == State.Paused, "Not paused");
        State oldState = state;
        state = State.Active;
        emit StateChanged(oldState, state);
    }

    function terminate() external onlyOwner {
        State oldState = state;
        state = State.Terminated;

        uint256 balance = USDC.balanceOf(address(this));
        if (balance > 0) {
            bool success = USDC.transfer(owner, balance);
            require(success, "Transfer failed");
            emit EmergencyWithdrawal(owner, balance);
        }

        emit StateChanged(oldState, state);
    }

    function emergencyWithdraw() external onlyOwner {
        require(
            state == State.Paused || state == State.Terminated,
            "Must pause or terminate first"
        );

        uint256 balance = USDC.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");

        bool success = USDC.transfer(owner, balance);
        require(success, "Transfer failed");

        emit EmergencyWithdrawal(owner, balance);
    }

    receive() external payable {
        revert("Use deposit() function for USDC");
    }
}
