import { keccak256, encodePacked, getContractAddress } from 'viem';
import { FACTORY_ADDRESS, RENTAL_IMPLEMENTATION } from './constants';

/**
 * Predicts the CREATE2 deployment address for a rental contract
 *
 * @param userAddress - Address of the deploying user
 * @param suggestedName - Basename for the contract
 * @returns Predicted contract address
 */
export function predictRentalAddress(
  userAddress: `0x${string}`,
  suggestedName: string
): `0x${string}` {
  // Calculate salt: keccak256(userAddress, suggestedName)
  const salt = keccak256(
    encodePacked(['address', 'string'], [userAddress, suggestedName])
  );

  // Get EIP-1167 minimal proxy bytecode hash
  // This matches OpenZeppelin's Clones.cloneDeterministic implementation
  const proxyBytecode = encodePacked(
    ['bytes', 'bytes20', 'bytes'],
    [
      '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' as `0x${string}`,
      RENTAL_IMPLEMENTATION,
      '0x5af43d82803e903d91602b57fd5bf3' as `0x${string}`,
    ]
  );

  const bytecodeHash = keccak256(proxyBytecode);

  // Calculate CREATE2 address
  return getContractAddress({
    bytecodeHash,
    from: FACTORY_ADDRESS,
    opcode: 'CREATE2',
    salt,
  });
}
