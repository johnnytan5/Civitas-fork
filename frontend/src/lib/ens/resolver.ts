import { createPublicClient, http, namehash, type Address } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet, sepolia, baseSepolia, base } from 'viem/chains';

/**
 * Resolution result from the server-side API
 */
export interface ENSResolutionResult {
  address: `0x${string}` | null;
  source: 'l1' | 'l2' | 'raw';
  originalInput: string;
  error?: string;
}

// =============================================================================
// Direct ENS Resolution (no HTTP round-trip)
// Used by AI tools running in Edge Runtime where self-fetch is unreliable
// =============================================================================

const BASE_SEPOLIA_CONTRACTS = {
  registry: '0x1493b2567056c2181630115660963E13A8E32735' as Address,
  resolver: '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA' as Address,
};

const BASE_MAINNET_CONTRACTS = {
  registry: '0x1493b2567056c2181630115660963E13A8E32735' as Address,
  resolver: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD' as Address,
};

const L2_RESOLVER_ABI = [
  {
    name: 'addr',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

const RPC_URLS: Record<number, string> = {
  [mainnet.id]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://eth.llamarpc.com',
  [sepolia.id]: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
  [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  [base.id]: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base-rpc.publicnode.com',
};

function getENSType(name: string): {
  type: 'l1' | 'l2' | 'unknown';
  chain: typeof mainnet | typeof sepolia | typeof baseSepolia | typeof base;
  isTestnet: boolean;
} {
  const lowerName = name.toLowerCase();
  if (lowerName.endsWith('.basetest.eth')) {
    return { type: 'l2', chain: baseSepolia, isTestnet: true };
  }
  if (lowerName.endsWith('.base.eth')) {
    return { type: 'l2', chain: base, isTestnet: false };
  }
  if (lowerName.endsWith('.eth')) {
    const isTestnet = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_TESTNET === 'true';
    return { type: 'l1', chain: isTestnet ? sepolia : mainnet, isTestnet };
  }
  return { type: 'unknown', chain: mainnet, isTestnet: false };
}

async function resolveL1ENSDirect(name: string, chain: typeof mainnet | typeof sepolia): Promise<`0x${string}` | null> {
  try {
    const client = createPublicClient({
      chain,
      transport: http(RPC_URLS[chain.id]),
    });
    return await client.getEnsAddress({ name: normalize(name) });
  } catch (error) {
    console.error(`L1 ENS resolution failed for ${name}:`, error);
    return null;
  }
}

async function resolveL2BasenameDirect(
  name: string,
  chain: typeof baseSepolia | typeof base
): Promise<`0x${string}` | null> {
  const contracts = chain.id === baseSepolia.id ? BASE_SEPOLIA_CONTRACTS : BASE_MAINNET_CONTRACTS;
  try {
    const normalizedName = normalize(name);
    const node = namehash(normalizedName);
    const client = createPublicClient({
      chain,
      transport: http(RPC_URLS[chain.id]),
    });
    const address = await client.readContract({
      address: contracts.resolver,
      abi: L2_RESOLVER_ABI,
      functionName: 'addr',
      args: [node],
    });
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return null;
    }
    return address as `0x${string}`;
  } catch (error) {
    console.error(`L2 Basename resolution failed for ${name}:`, error);
    return null;
  }
}

/**
 * Resolve ENS name directly without HTTP round-trip.
 * Supports L1 ENS (.eth), L2 Basenames (.base.eth, .basetest.eth), and raw addresses.
 */
export async function resolveENSDirect(input: string): Promise<ENSResolutionResult> {
  const trimmed = input.trim();

  if (isAddress(trimmed)) {
    return { address: trimmed as `0x${string}`, source: 'raw', originalInput: trimmed };
  }

  if (!isENSName(trimmed)) {
    return { address: null, source: 'raw', originalInput: trimmed, error: 'Invalid format. Enter a valid address (0x...) or ENS name (.eth, .base.eth, .basetest.eth)' };
  }

  const { type, chain } = getENSType(trimmed);

  if (type === 'unknown') {
    return { address: null, source: 'raw', originalInput: trimmed, error: 'Unsupported ENS name format' };
  }

  let address: `0x${string}` | null = null;

  if (type === 'l1') {
    address = await resolveL1ENSDirect(trimmed, chain as typeof mainnet | typeof sepolia);
  } else if (type === 'l2') {
    address = await resolveL2BasenameDirect(trimmed, chain as typeof baseSepolia | typeof base);
  }

  if (!address) {
    return { address: null, source: type, originalInput: trimmed, error: `Could not resolve "${trimmed}". The name may not exist or may not have an address record set.` };
  }

  return { address, source: type, originalInput: trimmed };
}

/**
 * Check if a string is an ENS name (any supported format)
 */
export function isENSName(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.endsWith('.eth') ||
    lower.endsWith('.base.eth') ||
    lower.endsWith('.basetest.eth')
  );
}

/**
 * Check if a string is a valid Ethereum address
 */
export function isAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get a human-readable label for the ENS type
 */
export function getENSTypeLabel(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith('.basetest.eth')) return 'Base Sepolia Name';
  if (lower.endsWith('.base.eth')) return 'Base Name';
  if (lower.endsWith('.eth')) return 'ENS Name';
  return 'Unknown';
}

/**
 * Resolve ENS name via server-side API (supports L1 and L2)
 * This is the preferred method as it handles both mainnet ENS and Base names
 */
export async function resolveENSServerSide(input: string): Promise<ENSResolutionResult> {
  try {
    const response = await fetch('/api/resolve-ens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        address: null,
        source: 'raw',
        originalInput: input,
        error: data.error || `Resolution failed with status ${response.status}`,
      };
    }

    return data as ENSResolutionResult;
  } catch (error: any) {
    console.error('ENS resolution request failed:', error);
    return {
      address: null,
      source: 'raw',
      originalInput: input,
      error: error.message || 'Network error during resolution',
    };
  }
}

/**
 * Resolve multiple ENS names/addresses in parallel
 * Returns a map of input -> result
 */
export async function batchResolveENS(
  inputs: string[]
): Promise<Map<string, ENSResolutionResult>> {
  const results = new Map<string, ENSResolutionResult>();

  // Resolve all in parallel
  const promises = inputs.map(async (input) => {
    const result = await resolveENSServerSide(input);
    return { input, result };
  });

  const resolved = await Promise.all(promises);

  for (const { input, result } of resolved) {
    results.set(input, result);
  }

  return results;
}

/**
 * Resolve ENS name to Ethereum address (client-side, mainnet only)
 * @deprecated Use resolveENSServerSide for multi-chain support
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
 * Uses server-side resolution for full L1/L2 support
 */
export async function resolveTenant(input: string): Promise<`0x${string}` | null> {
  // If it's already an address, return it
  if (isAddress(input)) {
    return input as `0x${string}`;
  }

  // Use server-side resolution for ENS names
  const result = await resolveENSServerSide(input);
  return result.address;
}

/**
 * Format address for display (truncated)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format resolution result for display
 * e.g., "vitalik.eth → 0xd8dA...6045"
 */
export function formatResolution(result: ENSResolutionResult): string {
  if (!result.address) {
    return `${result.originalInput} → ❌ ${result.error || 'Not found'}`;
  }

  if (result.source === 'raw') {
    return formatAddress(result.address);
  }

  return `${result.originalInput} → ${formatAddress(result.address)}`;
}
