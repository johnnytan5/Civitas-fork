// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RecurringRent.sol";
import "../src/RentalFactory.sol";
import "../src/RentVault.sol";
import "../src/GroupBuyEscrow.sol";
import "../src/StableAllowanceTreasury.sol";
import "../src/CivitasFactory.sol";

contract Deploy is Script {
    // Base USDC
    address constant BASE_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // ── Legacy: RecurringRent + RentalFactory ──
        RecurringRent recurringRentImpl = new RecurringRent();
        console.log("RecurringRent implementation:", address(recurringRentImpl));

        RentalFactory rentalFactory = new RentalFactory(address(recurringRentImpl));
        console.log("RentalFactory:", address(rentalFactory));

        // ── New: Multi-template implementations ──
        RentVault rentVaultImpl = new RentVault();
        console.log("RentVault implementation:", address(rentVaultImpl));

        GroupBuyEscrow groupBuyEscrowImpl = new GroupBuyEscrow();
        console.log("GroupBuyEscrow implementation:", address(groupBuyEscrowImpl));

        StableAllowanceTreasury treasuryImpl = new StableAllowanceTreasury();
        console.log("StableAllowanceTreasury implementation:", address(treasuryImpl));

        // ── CivitasFactory ──
        CivitasFactory civitasFactory = new CivitasFactory(
            BASE_USDC,
            address(rentVaultImpl),
            address(groupBuyEscrowImpl),
            address(treasuryImpl)
        );
        console.log("CivitasFactory:", address(civitasFactory));

        vm.stopBroadcast();
    }
}
