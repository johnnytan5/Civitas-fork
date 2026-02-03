// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RecurringRent.sol";

contract RentalFactory is Ownable {
    using Clones for address;

    address public immutable implementation;
    mapping(bytes32 => address) public authorizedDeployments;

    event RentalDeployed(
        address indexed creator,
        address indexed rental,
        address indexed landlord,
        address tenant,
        string suggestedName
    );

    constructor(address _implementation) Ownable() {
        require(_implementation != address(0), "Invalid implementation");
        implementation = _implementation;
    }

    function deployRental(
        address landlord,
        address tenant,
        uint256 monthlyAmount,
        uint8 totalMonths,
        string calldata suggestedName
    ) external returns (address rental) {
        // Generate salt: keccak256(msg.sender, suggestedName)
        bytes32 salt = keccak256(abi.encode(msg.sender, suggestedName));

        // Anti-snipe protection
        require(
            authorizedDeployments[salt] == address(0) ||
            authorizedDeployments[salt] == msg.sender,
            "Unauthorized"
        );

        // Deploy using OpenZeppelin Clones
        rental = implementation.cloneDeterministic(salt);

        // Initialize
        RecurringRent(rental).initialize(
            landlord, tenant, monthlyAmount, totalMonths
        );

        delete authorizedDeployments[salt];

        emit RentalDeployed(msg.sender, rental, landlord, tenant, suggestedName);
    }

    function predictRentalAddress(
        address deployer,
        string calldata suggestedName
    ) external view returns (address) {
        bytes32 salt = keccak256(abi.encode(deployer, suggestedName));
        return implementation.predictDeterministicAddress(salt, address(this));
    }

    function authorizeDeployment(bytes32 salt, address deployer) external onlyOwner {
        authorizedDeployments[salt] = deployer;
    }
}
