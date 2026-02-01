// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RentalFactory.sol";
import "../src/RecurringRent.sol";

contract RentalFactoryTest is Test {
    RentalFactory public factory;
    RecurringRent public implementation;

    address public landlord = address(0x1);
    address public tenant = address(0x2);
    uint256 public monthlyAmount = 1000 * 10**6;
    uint8 public totalMonths = 6;

    function setUp() public {
        implementation = new RecurringRent();
        factory = new RentalFactory(address(implementation));
    }

    function testDeployRental() public {
        address predicted = factory.predictRentalAddress(address(this), "downtown-studio");

        address deployed = factory.deployRental(
            landlord,
            tenant,
            monthlyAmount,
            totalMonths,
            "downtown-studio"
        );

        assertEq(deployed, predicted);

        RecurringRent rental = RecurringRent(deployed);
        assertEq(rental.landlord(), landlord);
        assertEq(rental.tenant(), tenant);
    }

    function testPredictedAddressMatches() public {
        address predicted = factory.predictRentalAddress(address(this), "test-rental");

        address deployed = factory.deployRental(
            landlord,
            tenant,
            monthlyAmount,
            totalMonths,
            "test-rental"
        );

        assertEq(deployed, predicted, "Deployed address must match prediction");
    }

    function testDifferentUsersGetDifferentAddresses() public {
        address user1Prediction = factory.predictRentalAddress(address(0x100), "same-name");

        vm.prank(address(0x200));
        address user2Prediction = factory.predictRentalAddress(address(0x200), "same-name");

        assertTrue(user1Prediction != user2Prediction, "Different users should get different addresses");
    }
}
