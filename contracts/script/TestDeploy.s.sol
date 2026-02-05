// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CivitasFactory.sol";
import "../src/StableAllowanceTreasury.sol";

/**
 * @title TestDeploy
 * @notice Test script to deploy a contract via the factory on Base Mainnet
 * @dev This helps debug if the issue is RPC-related or frontend-related
 */
contract TestDeploy is Script {
    // Base Mainnet Factory Address
    address constant FACTORY = 0xAF4D13Cac35b65d24203962fF22Dc281f1C1Fc5C;

    // Base Mainnet USDC
    address constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        // Get deployer from private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("========================================");
        console.log("TEST DEPLOYMENT TO BASE MAINNET");
        console.log("========================================");
        console.log("Deployer:", deployer);
        console.log("Factory:", FACTORY);
        console.log("USDC:", USDC);
        console.log("");

        // Check deployer balance
        uint256 balance = deployer.balance;
        console.log("Deployer ETH balance:", balance);
        require(balance > 0, "Deployer has no ETH for gas");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy a test StableAllowanceTreasury
        // Parameters:
        // - owner: deployer (can withdraw)
        // - recipient: different address (receives allowance)
        // - allowancePerIncrement: 100 USDC (100 * 10^6)

        address owner = deployer;
        address recipient = address(0x1111111111111111111111111111111111111111); // Dummy recipient
        uint256 allowancePerIncrement = 100 * 10**6; // 100 USDC

        console.log("Deploying StableAllowanceTreasury with params:");
        console.log("  owner:", owner);
        console.log("  recipient:", recipient);
        console.log("  allowancePerIncrement:", allowancePerIncrement);
        console.log("");

        CivitasFactory factory = CivitasFactory(FACTORY);

        // Call the factory to deploy
        address deployed = factory.createStableAllowanceTreasury(
            owner,
            recipient,
            allowancePerIncrement
        );

        vm.stopBroadcast();

        console.log("");
        console.log("========================================");
        console.log("DEPLOYMENT SUCCESSFUL!");
        console.log("========================================");
        console.log("Deployed contract:", deployed);
        console.log("");
        console.log("Verify on BaseScan:");
        console.log("https://basescan.org/address/%s", deployed);
        console.log("");

        // Verify the contract was deployed correctly
        StableAllowanceTreasury treasury = StableAllowanceTreasury(payable(deployed));
        console.log("Contract state verification:");
        console.log("  state:", uint256(treasury.state()));
        console.log("  owner:", treasury.owner());
        console.log("  recipient:", treasury.recipient());
        console.log("  allowancePerIncrement:", treasury.allowancePerIncrement());
        console.log("  USDC:", address(treasury.USDC()));
    }
}
