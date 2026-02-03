export type NetworkMode = 'mainnet' | 'testnet';

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  usdc: string;
  explorer: string;
}

export interface NetworkConfig {
  mainnet: {
    base: ChainConfig;
    ethereum: ChainConfig;
  };
  testnet: {
    baseSepolia: ChainConfig;
  };
}

export const NETWORK_CONFIG: NetworkConfig = {
  mainnet: {
    base: {
      chainId: 8453,
      name: 'Base',
      rpcUrl: 'https://mainnet.base.org',
      usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      explorer: 'https://basescan.org',
    },
    ethereum: {
      chainId: 1,
      name: 'Ethereum',
      rpcUrl: 'https://eth.llamarpc.com',
      usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      explorer: 'https://etherscan.io',
    },
  },
  testnet: {
    baseSepolia: {
      chainId: 84532,
      name: 'Base Sepolia',
      rpcUrl: 'https://sepolia.base.org',
      usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      explorer: 'https://sepolia.basescan.org',
    },
  },
};

export function getNetworkConfig(mode: NetworkMode) {
  return NETWORK_CONFIG[mode];
}

export function getActiveChains(mode: NetworkMode): ChainConfig[] {
  if (mode === 'mainnet') {
    return [NETWORK_CONFIG.mainnet.base, NETWORK_CONFIG.mainnet.ethereum];
  }
  return [NETWORK_CONFIG.testnet.baseSepolia];
}
