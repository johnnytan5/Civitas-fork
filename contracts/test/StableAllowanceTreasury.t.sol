// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../src/StableAllowanceTreasury.sol";
import "./helpers/MockUSDC.sol";

contract StableAllowanceTreasuryTest is Test {
    StableAllowanceTreasury public treasury;
    MockUSDC public usdc;

    address public owner_ = address(0x1);
    address public recipient = address(0x2);
    address public funder = address(0x3);

    uint256 public allowanceAmount = 50 * 10 ** 6; // 50 USDC

    function setUp() public {
        usdc = new MockUSDC();

        StableAllowanceTreasury impl = new StableAllowanceTreasury();
        treasury = StableAllowanceTreasury(payable(Clones.clone(address(impl))));

        treasury.initialize(
            address(usdc),
            owner_,
            recipient,
            allowanceAmount
        );

        // Fund the funder and deposit into treasury
        usdc.mint(funder, 10000 * 10 ** 6);
        vm.startPrank(funder);
        usdc.approve(address(treasury), 5000 * 10 ** 6);
        treasury.deposit(1000 * 10 ** 6);
        vm.stopPrank();
    }

    function testInitialization() public view {
        assertEq(address(treasury.USDC()), address(usdc));
        assertEq(treasury.owner(), owner_);
        assertEq(treasury.recipient(), recipient);
        assertEq(treasury.allowancePerIncrement(), allowanceAmount);
        assertEq(treasury.approvalCounter(), 0);
        assertEq(treasury.claimedCount(), 0);
        assertTrue(treasury.state() == StableAllowanceTreasury.State.Active);
    }

    function testCannotReinitialize() public {
        vm.expectRevert();
        treasury.initialize(address(usdc), owner_, recipient, allowanceAmount);
    }

    function testIncrementCounter() public {
        vm.prank(owner_);
        treasury.incrementCounter(3);
        assertEq(treasury.approvalCounter(), 3);
    }

    function testClaim() public {
        vm.prank(owner_);
        treasury.incrementCounter(1);

        uint256 recipientBefore = usdc.balanceOf(recipient);
        vm.prank(recipient);
        treasury.claim();

        assertEq(usdc.balanceOf(recipient) - recipientBefore, allowanceAmount);
        assertEq(treasury.claimedCount(), 1);
    }

    function testCannotClaimWithoutApproval() public {
        vm.prank(recipient);
        vm.expectRevert("No unclaimed allowances");
        treasury.claim();
    }

    function testPauseAndUnpause() public {
        vm.startPrank(owner_);
        treasury.pause();
        assertTrue(treasury.state() == StableAllowanceTreasury.State.Paused);

        // Cannot increment when paused
        vm.expectRevert("Treasury not active");
        treasury.incrementCounter(1);

        treasury.unpause();
        assertTrue(treasury.state() == StableAllowanceTreasury.State.Active);
        vm.stopPrank();
    }

    function testTerminate() public {
        uint256 balBefore = usdc.balanceOf(owner_);

        vm.prank(owner_);
        treasury.terminate();

        assertTrue(treasury.state() == StableAllowanceTreasury.State.Terminated);
        // Funds transferred to owner
        assertGt(usdc.balanceOf(owner_), balBefore);
    }

    function testEmergencyWithdraw() public {
        vm.startPrank(owner_);
        treasury.pause();

        uint256 balBefore = usdc.balanceOf(owner_);
        treasury.emergencyWithdraw();

        assertGt(usdc.balanceOf(owner_), balBefore);
        vm.stopPrank();
    }

    function testCannotEmergencyWithdrawWhenActive() public {
        vm.prank(owner_);
        vm.expectRevert("Must pause or terminate first");
        treasury.emergencyWithdraw();
    }

    function testMultipleClaimsWithIncrements() public {
        vm.prank(owner_);
        treasury.incrementCounter(3);

        vm.startPrank(recipient);
        treasury.claim();
        treasury.claim();
        treasury.claim();
        vm.stopPrank();

        assertEq(treasury.claimedCount(), 3);
        assertEq(treasury.unclaimedAllowances(), 0);

        // Cannot claim more
        vm.prank(recipient);
        vm.expectRevert("No unclaimed allowances");
        treasury.claim();
    }

    function testGetTreasuryStatus() public {
        vm.prank(owner_);
        treasury.incrementCounter(2);

        vm.prank(recipient);
        treasury.claim();

        (
            address _owner,
            address _recipient,
            uint256 _allowance,
            uint256 _approvals,
            uint256 _claimed,
            uint256 _unclaimed,
            uint256 _balance,
            StableAllowanceTreasury.State _state
        ) = treasury.getTreasuryStatus();

        assertEq(_owner, owner_);
        assertEq(_recipient, recipient);
        assertEq(_allowance, allowanceAmount);
        assertEq(_approvals, 2);
        assertEq(_claimed, 1);
        assertEq(_unclaimed, 1);
        assertEq(_balance, 1000 * 10 ** 6 - allowanceAmount);
        assertTrue(_state == StableAllowanceTreasury.State.Active);
    }
}
