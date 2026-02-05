// Chain configurations
// NOTE: LI.FI only supports MAINNET chains
export const LIFI_SUPPORTED_CHAIN_IDS = {
  BASE_MAINNET: 8453,
  ETHEREUM_MAINNET: 1,
  ARBITRUM_MAINNET: 42161,
  OPTIMISM_MAINNET: 10,
  POLYGON_MAINNET: 137,
} as const;

// Testnet chain IDs (for fallback logic, NOT supported by LI.FI)
export const TESTNET_CHAIN_IDS = {
  BASE_SEPOLIA: 84532,
  ETHEREUM_SEPOLIA: 11155111,
} as const;

// USDC addresses by chain
export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  // Mainnet (LI.FI supported)
  [LIFI_SUPPORTED_CHAIN_IDS.BASE_MAINNET]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  [LIFI_SUPPORTED_CHAIN_IDS.ETHEREUM_MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [LIFI_SUPPORTED_CHAIN_IDS.ARBITRUM_MAINNET]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [LIFI_SUPPORTED_CHAIN_IDS.OPTIMISM_MAINNET]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [LIFI_SUPPORTED_CHAIN_IDS.POLYGON_MAINNET]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  // Testnet (for direct transfer fallback only)
  [TESTNET_CHAIN_IDS.BASE_SEPOLIA]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
} as const;

// Helper to check if chain is supported by LI.FI
export function isLiFiSupported(chainId: number): boolean {
  return Object.values(LIFI_SUPPORTED_CHAIN_IDS).includes(chainId as typeof LIFI_SUPPORTED_CHAIN_IDS[keyof typeof LIFI_SUPPORTED_CHAIN_IDS]);
}

// Get USDC address for a chain
export function getUsdcAddress(chainId: number): `0x${string}` | undefined {
  return USDC_ADDRESSES[chainId];
}
