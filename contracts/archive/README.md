# Legacy Contracts Archive

This directory contains deprecated smart contracts from the original Civitas rental system.

## Deprecation Date
February 4, 2026

## Archived Contracts

### RentalFactory.sol
- **Purpose**: Original factory contract for deploying rental agreements
- **Deployment**: Base Sepolia at `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **Status**: Deprecated - Replaced by CivitasFactory multi-template system

### RecurringRent.sol
- **Purpose**: Implementation contract for rental agreements with FSM logic
- **Deployment**: Base Sepolia at various addresses via CREATE2
- **Status**: Deprecated - Replaced by RentVault template

### Test Files
- `RentalFactory.t.sol` - Tests for RentalFactory
- `RecurringRent.t.sol` - Tests for RecurringRent contract

### Deployment Script
- `Deploy.s.sol` - Original deployment script for legacy factory

## Migration Path

The legacy rental system has been replaced with the **CivitasFactory** multi-template system:

- **New Factory Address**: `0xa44EbCC68383fc6761292A4D5Ec13127Cc123B56` (Base Sepolia)
- **New Templates**:
  - `RentVault` - Enhanced rental agreements with multi-chain support
  - `GroupBuyEscrow` - Group purchase escrow contracts
  - `StableAllowanceTreasury` - Allowance-based treasury contracts

### For Users with Legacy Contracts

1. Legacy contracts remain deployed on-chain and functional
2. No application support for legacy contracts (removed from UI/backend)
3. To migrate: Redeploy using the new CivitasFactory system
4. Contact: See main repo documentation for migration assistance

## Technical Details

### Why Deprecated?

The original single-purpose factory was limited to rental agreements only. The new CivitasFactory system provides:

- Multiple contract templates from a single factory
- Unified database schema (`contracts` + `contract_participants`)
- Better support for cross-chain operations via LI.FI
- Extensible architecture for future templates

### Differences

| Feature | Legacy (RentalFactory) | New (CivitasFactory) |
|---------|------------------------|----------------------|
| Templates | Rental only | RentVault, GroupBuy, Treasury |
| Factory Address | 0x036CbD... | 0xa44EbCC... |
| Implementation | RecurringRent | RentVault, etc. |
| Database | `rental_contracts` | `contracts` + `contract_participants` |
| Event Name | `RentalDeployed` | `RentVaultCreated`, etc. |

## Historical Reference

These contracts are preserved for:
- Historical reference
- Audit purposes
- Understanding system evolution
- Potential future compatibility layers

Do not use these contracts for new deployments.
