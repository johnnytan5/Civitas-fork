import { createPublicClient, http } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

/**
 * Check if a string is an ENS name
 */
export function isENSName(name: string): boolean {
  return name.endsWith('.eth');
}

/**
 * Check if a string is a valid Ethereum address
 */
export function isAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Resolve ENS name to Ethereum address
 */
export async function resolveENS(name: string): Promise<`0x${string}` | null> {
  if (!isENSName(name)) {
    return null;
  }

  try {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
    });

    const address = await publicClient.getEnsAddress({
      name: normalize(name),
    });

    return address;
  } catch (error) {
    console.error('ENS resolution failed:', error);
    return null;
  }
}

/**
 * Resolve tenant input (ENS name or address) to address
 */
export async function resolveTenant(input: string): Promise<`0x${string}` | null> {
  // If it's already an address, return it
  if (isAddress(input)) {
    return input as `0x${string}`;
  }

  // If it's an ENS name, resolve it
  if (isENSName(input)) {
    return await resolveENS(input);
  }

  return null;
}
