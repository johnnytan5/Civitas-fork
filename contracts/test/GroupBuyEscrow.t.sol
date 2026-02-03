// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../src/GroupBuyEscrow.sol";
import "./helpers/MockUSDC.sol";

contract GroupBuyEscrowTest is Test {
    GroupBuyEscrow public escrow;
    MockUSDC public usdc;

    address public recipient = address(0x1);
    address public participant1 = address(0x2);
    address public participant2 = address(0x3);
    address public participant3 = address(0x4);

    uint256 public fundingGoal = 3000 * 10 ** 6; // 3000 USDC
    uint256 public expiryDate;
    uint256 public timelockDelay = 7 days;

    function setUp() public {
        usdc = new MockUSDC();
        expiryDate = block.timestamp + 30 days;

        GroupBuyEscrow impl = new GroupBuyEscrow();
        escrow = GroupBuyEscrow(Clones.clone(address(impl)));

        address[] memory participants = new address[](3);
        participants[0] = participant1;
        participants[1] = participant2;
        participants[2] = participant3;

        uint256[] memory shares = new uint256[](3);
        shares[0] = 5000; // 50%
        shares[1] = 3000; // 30%
        shares[2] = 2000; // 20%

        escrow.initialize(
            address(usdc),
            recipient,
            fundingGoal,
            expiryDate,
            timelockDelay,
            participants,
            shares
        );

        // Fund participants
        usdc.mint(participant1, 10000 * 10 ** 6);
        usdc.mint(participant2, 10000 * 10 ** 6);
        usdc.mint(participant3, 10000 * 10 ** 6);
    }

    function testInitialization() public view {
        assertEq(address(escrow.USDC()), address(usdc));
        assertEq(escrow.recipient(), recipient);
        assertEq(escrow.fundingGoal(), fundingGoal);
        assertEq(escrow.expiryDate(), expiryDate);
        assertEq(escrow.timelockRefundDelay(), timelockDelay);
        assertEq(escrow.participantCount(), 3);
        assertTrue(escrow.isParticipant(participant1));
    }

    function testCannotReinitialize() public {
        address[] memory p = new address[](1);
        p[0] = address(0x99);
        uint256[] memory s = new uint256[](1);
        s[0] = 10000;

        vm.expectRevert();
        escrow.initialize(address(usdc), recipient, 1000, expiryDate, timelockDelay, p, s);
    }

    function testDeposit() public {
        uint256 amount = 1500 * 10 ** 6; // participant1's 50%

        vm.startPrank(participant1);
        usdc.approve(address(escrow), amount);
        escrow.deposit(amount);
        vm.stopPrank();

        assertEq(escrow.deposits(participant1), amount);
        assertEq(escrow.totalDeposited(), amount);
    }

    function testGoalReached() public {
        _fundAll();
        assertGt(escrow.goalReachedAt(), 0);
        assertEq(escrow.totalDeposited(), fundingGoal);
    }

    function testRefundAfterExpiry() public {
        uint256 amount = 1500 * 10 ** 6;
        vm.startPrank(participant1);
        usdc.approve(address(escrow), amount);
        escrow.deposit(amount);
        vm.stopPrank();

        // Warp past expiry
        vm.warp(expiryDate + 1);

        uint256 balBefore = usdc.balanceOf(participant1);
        vm.prank(participant1);
        escrow.refund();

        assertEq(usdc.balanceOf(participant1) - balBefore, amount);
        assertEq(escrow.deposits(participant1), 0);
    }

    function testDeliveryConfirmAndVoteRelease() public {
        _fundAll();

        // Confirm delivery
        vm.prank(recipient);
        escrow.confirmDelivery("ipfs://Qm...");

        assertGt(escrow.deliveryConfirmedAt(), 0);

        // Vote: need majority (2 of 3)
        vm.prank(participant1);
        escrow.voteRelease();
        assertEq(escrow.yesVotes(), 1);

        vm.prank(participant2);
        escrow.voteRelease();
        assertEq(escrow.yesVotes(), 2);

        // Release
        uint256 recipientBefore = usdc.balanceOf(recipient);
        escrow.releaseFunds();

        assertTrue(escrow.released());
        assertEq(usdc.balanceOf(recipient) - recipientBefore, fundingGoal);
    }

    function testTimelockRefund() public {
        _fundAll();

        // No delivery confirmation, wait for timelock
        vm.warp(block.timestamp + timelockDelay + 1);

        uint256 balBefore = usdc.balanceOf(participant1);
        vm.prank(participant1);
        escrow.timelockRefund();

        uint256 expected = (fundingGoal * 5000 + 9999) / 10000;
        assertEq(usdc.balanceOf(participant1) - balBefore, expected);
    }

    function testCannotReleaseFundsWithoutMajority() public {
        _fundAll();

        vm.prank(recipient);
        escrow.confirmDelivery("proof");

        // Only 1 of 3 vote
        vm.prank(participant1);
        escrow.voteRelease();

        vm.expectRevert("Majority not reached");
        escrow.releaseFunds();
    }

    // Helper
    function _fundAll() internal {
        uint256 share1 = (fundingGoal * 5000 + 9999) / 10000;
        uint256 share2 = (fundingGoal * 3000 + 9999) / 10000;
        uint256 share3 = fundingGoal - share1 - share2;

        vm.startPrank(participant1);
        usdc.approve(address(escrow), share1);
        escrow.deposit(share1);
        vm.stopPrank();

        vm.startPrank(participant2);
        usdc.approve(address(escrow), share2);
        escrow.deposit(share2);
        vm.stopPrank();

        vm.startPrank(participant3);
        usdc.approve(address(escrow), share3);
        escrow.deposit(share3);
        vm.stopPrank();
    }
}
