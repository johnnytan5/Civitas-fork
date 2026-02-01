// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RecurringRent.sol";
import "../src/RentalFactory.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        RecurringRent implementation = new RecurringRent();
        console.log("Implementation deployed to:", address(implementation));

        // Deploy factory
        RentalFactory factory = new RentalFactory(address(implementation));
        console.log("Factory deployed to:", address(factory));

        vm.stopBroadcast();
    }
}
