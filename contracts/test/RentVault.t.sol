// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RentVault.sol";
import "./helpers/MockUSDC.sol";

contract RentVaultTest is Test {
    RentVault public vault;
    MockUSDC public usdc;

    address public recipient = address(0x1);
    address public tenant1 = address(0x2);
    address public tenant2 = address(0x3);

    uint256 public rentAmount = 2000 * 10 ** 6; // 2000 USDC
    uint256 public dueDate;

    function setUp() public {
        usdc = new MockUSDC();
        dueDate = block.timestamp + 30 days;

        // Deploy implementation and clone manually for testing
        RentVault impl = new RentVault();
        vault = RentVault(Clones.clone(address(impl)));

        address[] memory tenants = new address[](2);
        tenants[0] = tenant1;
        tenants[1] = tenant2;

        uint256[] memory shares = new uint256[](2);
        shares[0] = 5000; // 50%
        shares[1] = 5000; // 50%

        vault.initialize(
            address(usdc),
            recipient,
            rentAmount,
            dueDate,
            tenants,
            shares
        );

        // Fund tenants
        usdc.mint(tenant1, 10000 * 10 ** 6);
        usdc.mint(tenant2, 10000 * 10 ** 6);
    }

    function testInitialization() public view {
        assertEq(address(vault.USDC()), address(usdc));
        assertEq(vault.recipient(), recipient);
        assertEq(vault.rentAmount(), rentAmount);
        assertEq(vault.dueDate(), dueDate);
        assertTrue(vault.isTenant(tenant1));
        assertTrue(vault.isTenant(tenant2));
        assertEq(vault.shareBps(tenant1), 5000);
        assertEq(vault.shareBps(tenant2), 5000);
    }

    function testCannotReinitialize() public {
        address[] memory tenants = new address[](1);
        tenants[0] = address(0x99);
        uint256[] memory shares = new uint256[](1);
        shares[0] = 10000;

        vm.expectRevert();
        vault.initialize(
            address(usdc),
            recipient,
            rentAmount,
            dueDate + 1,
            tenants,
            shares
        );
    }

    function testDeposit() public {
        uint256 amount = 1000 * 10 ** 6; // tenant1's 50% share

        vm.startPrank(tenant1);
        usdc.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();

        assertEq(vault.tenantBalances(tenant1), amount);
        assertEq(vault.totalDeposited(), amount);
    }

    function testFullFundingAndWithdraw() public {
        uint256 share = 1000 * 10 ** 6;

        // Tenant1 deposits
        vm.startPrank(tenant1);
        usdc.approve(address(vault), share);
        vault.deposit(share);
        vm.stopPrank();

        // Tenant2 deposits
        vm.startPrank(tenant2);
        usdc.approve(address(vault), share);
        vault.deposit(share);
        vm.stopPrank();

        assertEq(vault.totalDeposited(), rentAmount);

        // Recipient withdraws
        uint256 recipientBefore = usdc.balanceOf(recipient);
        vm.prank(recipient);
        vault.withdrawToRecipient();

        assertEq(usdc.balanceOf(recipient) - recipientBefore, rentAmount);
        assertTrue(vault.withdrawn());
    }

    function testRefundAll() public {
        uint256 share = 500 * 10 ** 6; // Partial deposit

        vm.startPrank(tenant1);
        usdc.approve(address(vault), share);
        vault.deposit(share);
        vm.stopPrank();

        uint256 tenant1Before = usdc.balanceOf(tenant1);

        address[] memory tenantsToRefund = new address[](2);
        tenantsToRefund[0] = tenant1;
        tenantsToRefund[1] = tenant2;

        vm.prank(recipient);
        vault.refundAll(tenantsToRefund);

        assertEq(usdc.balanceOf(tenant1) - tenant1Before, share);
        assertEq(vault.totalDeposited(), 0);
    }

    function testShareValidation() public {
        RentVault impl2 = new RentVault();
        RentVault vault2 = RentVault(Clones.clone(address(impl2)));

        address[] memory tenants = new address[](2);
        tenants[0] = tenant1;
        tenants[1] = tenant2;

        uint256[] memory badShares = new uint256[](2);
        badShares[0] = 5000;
        badShares[1] = 4000; // Only 9000, not 10000

        vm.expectRevert("Shares must equal 10000 bps");
        vault2.initialize(
            address(usdc),
            recipient,
            rentAmount,
            block.timestamp + 30 days,
            tenants,
            badShares
        );
    }

    function testExceedsTenantShare() public {
        uint256 maxShare = (rentAmount * 5000 + 9999) / 10000; // ceil

        vm.startPrank(tenant1);
        usdc.approve(address(vault), maxShare + 1);
        vm.expectRevert("Exceeds tenant share");
        vault.deposit(maxShare + 1);
        vm.stopPrank();
    }

    function testDepositPastDueDate() public {
        vm.warp(dueDate + 1);

        vm.startPrank(tenant1);
        usdc.approve(address(vault), 100 * 10 ** 6);
        vm.expectRevert("Past due date");
        vault.deposit(100 * 10 ** 6);
        vm.stopPrank();
    }
}

import "@openzeppelin/contracts/proxy/Clones.sol";
