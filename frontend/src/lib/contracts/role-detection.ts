import type { AnyContract, UserRole } from './types';

/**
 * Determines the user's role in a given contract
 * @param contract - The contract to check
 * @param userAddress - The user's wallet address
 * @returns 'receiver', 'payer', or 'none'
 */
export function getUserRole(
  contract: AnyContract,
  userAddress: `0x${string}`
): UserRole {
  const normalizedUserAddress = userAddress.toLowerCase();

  switch (contract.template) {
    case 'RentVault':
      // Landlord is the receiver
      if (contract.recipient.toLowerCase() === normalizedUserAddress) {
        return 'receiver';
      }
      // Tenant is the payer (check if they have a share)
      if (contract.shareBps[userAddress] !== undefined && contract.shareBps[userAddress] > 0) {
        return 'payer';
      }
      break;

    case 'GroupBuyEscrow':
      // Purchaser is the receiver
      if (contract.recipient.toLowerCase() === normalizedUserAddress) {
        return 'receiver';
      }
      // Participant is the payer (check if they have deposited)
      if (contract.deposits[userAddress] !== undefined) {
        return 'payer';
      }
      break;

    case 'StableAllowanceTreasury':
      // Beneficiary/recipient is the receiver
      if (contract.recipient.toLowerCase() === normalizedUserAddress) {
        return 'receiver';
      }
      // Owner is the payer
      if (contract.owner.toLowerCase() === normalizedUserAddress) {
        return 'payer';
      }
      break;
  }

  return 'none';
}

/**
 * Type guard to check if a contract is a RentVault
 */
export function isRentVault(contract: AnyContract): contract is import('./types').RentVaultContract {
  return contract.template === 'RentVault';
}

/**
 * Type guard to check if a contract is a GroupBuyEscrow
 */
export function isGroupBuyEscrow(contract: AnyContract): contract is import('./types').GroupBuyEscrowContract {
  return contract.template === 'GroupBuyEscrow';
}

/**
 * Type guard to check if a contract is a StableAllowanceTreasury
 */
export function isStableAllowanceTreasury(contract: AnyContract): contract is import('./types').StableAllowanceTreasuryContract {
  return contract.template === 'StableAllowanceTreasury';
}
