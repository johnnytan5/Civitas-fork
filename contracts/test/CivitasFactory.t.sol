// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CivitasFactory.sol";
import "../src/RentVault.sol";
import "../src/GroupBuyEscrow.sol";
import "../src/StableAllowanceTreasury.sol";
import "./helpers/MockUSDC.sol";

contract CivitasFactoryTest is Test {
    // Duplicate event declarations for expectEmit
    event RentVaultCreated(address indexed creator, address indexed clone, address indexed recipient);
    event TreasuryCreated(address indexed creator, address indexed clone, address indexed owner_);

    CivitasFactory public factory;
    MockUSDC public usdc;

    RentVault public rentVaultImpl;
    GroupBuyEscrow public groupBuyEscrowImpl;
    StableAllowanceTreasury public treasuryImpl;

    address public user = address(0x10);
    address public recipient = address(0x20);
    address public tenant1 = address(0x30);
    address public tenant2 = address(0x40);

    function setUp() public {
        usdc = new MockUSDC();

        rentVaultImpl = new RentVault();
        groupBuyEscrowImpl = new GroupBuyEscrow();
        treasuryImpl = new StableAllowanceTreasury();

        factory = new CivitasFactory(
            address(usdc),
            address(rentVaultImpl),
            address(groupBuyEscrowImpl),
            address(treasuryImpl)
        );
    }

    function testCreateRentVault() public {
        address[] memory tenants = new address[](2);
        tenants[0] = tenant1;
        tenants[1] = tenant2;

        uint256[] memory shares = new uint256[](2);
        shares[0] = 5000;
        shares[1] = 5000;

        vm.prank(user);
        address clone = factory.createRentVault(
            recipient,
            2000 * 10 ** 6,
            block.timestamp + 30 days,
            tenants,
            shares
        );

        assertTrue(clone != address(0));

        RentVault vault = RentVault(clone);
        assertEq(vault.recipient(), recipient);
        assertEq(vault.rentAmount(), 2000 * 10 ** 6);
        assertTrue(vault.isTenant(tenant1));
        assertTrue(vault.isTenant(tenant2));
    }

    function testCreateRentVaultEmitsEvent() public {
        address[] memory tenants = new address[](1);
        tenants[0] = tenant1;
        uint256[] memory shares = new uint256[](1);
        shares[0] = 10000;

        vm.prank(user);
        vm.expectEmit(true, false, true, false);
        emit RentVaultCreated(user, address(0), recipient);
        factory.createRentVault(
            recipient,
            1000 * 10 ** 6,
            block.timestamp + 30 days,
            tenants,
            shares
        );
    }

    function testCreateGroupBuyEscrow() public {
        address[] memory participants = new address[](2);
        participants[0] = tenant1;
        participants[1] = tenant2;

        uint256[] memory shares = new uint256[](2);
        shares[0] = 6000;
        shares[1] = 4000;

        vm.prank(user);
        address clone = factory.createGroupBuyEscrow(
            recipient,
            5000 * 10 ** 6,
            block.timestamp + 60 days,
            7 days,
            participants,
            shares
        );

        assertTrue(clone != address(0));

        GroupBuyEscrow escrow = GroupBuyEscrow(clone);
        assertEq(escrow.recipient(), recipient);
        assertEq(escrow.fundingGoal(), 5000 * 10 ** 6);
        assertEq(escrow.participantCount(), 2);
    }

    function testCreateStableAllowanceTreasury() public {
        vm.prank(user);
        address clone = factory.createStableAllowanceTreasury(
            user,
            recipient,
            50 * 10 ** 6
        );

        assertTrue(clone != address(0));

        StableAllowanceTreasury treasury = StableAllowanceTreasury(payable(clone));
        assertEq(treasury.owner(), user);
        assertEq(treasury.recipient(), recipient);
        assertEq(treasury.allowancePerIncrement(), 50 * 10 ** 6);
        assertTrue(treasury.state() == StableAllowanceTreasury.State.Active);
    }

    function testCreateTreasuryEmitsEvent() public {
        vm.prank(user);
        vm.expectEmit(true, false, true, false);
        emit TreasuryCreated(user, address(0), user);
        factory.createStableAllowanceTreasury(user, recipient, 50 * 10 ** 6);
    }

    function testCloneIndependence() public {
        address[] memory tenants = new address[](1);
        tenants[0] = tenant1;
        uint256[] memory shares = new uint256[](1);
        shares[0] = 10000;

        address clone1 = factory.createRentVault(
            recipient,
            1000 * 10 ** 6,
            block.timestamp + 30 days,
            tenants,
            shares
        );

        // Different tenant for clone2
        tenants[0] = tenant2;
        address clone2 = factory.createRentVault(
            recipient,
            2000 * 10 ** 6,
            block.timestamp + 60 days,
            tenants,
            shares
        );

        assertTrue(clone1 != clone2);
        assertEq(RentVault(clone1).rentAmount(), 1000 * 10 ** 6);
        assertEq(RentVault(clone2).rentAmount(), 2000 * 10 ** 6);
        assertTrue(RentVault(clone1).isTenant(tenant1));
        assertFalse(RentVault(clone1).isTenant(tenant2));
        assertTrue(RentVault(clone2).isTenant(tenant2));
        assertFalse(RentVault(clone2).isTenant(tenant1));
    }

    function testCannotReinitializeClone() public {
        address[] memory tenants = new address[](1);
        tenants[0] = tenant1;
        uint256[] memory shares = new uint256[](1);
        shares[0] = 10000;

        address clone = factory.createRentVault(
            recipient,
            1000 * 10 ** 6,
            block.timestamp + 30 days,
            tenants,
            shares
        );

        vm.expectRevert();
        RentVault(clone).initialize(
            address(usdc),
            recipient,
            999 * 10 ** 6,
            block.timestamp + 90 days,
            tenants,
            shares
        );
    }

    function testSetImplementations() public {
        RentVault newImpl = new RentVault();
        factory.setRentVaultImpl(address(newImpl));
        assertEq(factory.rentVaultImpl(), address(newImpl));
    }

    function testOnlyOwnerCanSetImplementations() public {
        vm.prank(user);
        vm.expectRevert();
        factory.setRentVaultImpl(address(0x999));
    }
}
