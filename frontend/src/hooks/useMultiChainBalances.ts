'use client';

import { useBalance, useBlockNumber } from 'wagmi';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NetworkMode, NETWORK_CONFIG } from '@/lib/config/networks';

interface ChainBalances {
  eth: ReturnType<typeof useBalance>;
  usdc: ReturnType<typeof useBalance>;
}

interface MultiChainBalances {
  mainnet: {
    base: ChainBalances;
    ethereum: ChainBalances;
  };
  testnet: {
    baseSepolia: ChainBalances;
  };
  activeNetwork: NetworkMode;
  isLoading: boolean;
  hasError: boolean;
}

export function useMultiChainBalances(
  address: `0x${string}` | undefined,
  networkMode: NetworkMode = 'testnet'
): MultiChainBalances {
  const queryClient = useQueryClient();

  // ===== MAINNET BALANCES =====

  // Base Mainnet
  const baseMainnetEth = useBalance({
    address,
    chainId: NETWORK_CONFIG.mainnet.base.chainId,
    query: { enabled: networkMode === 'mainnet' && !!address },
  });

  const baseMainnetUsdc = useBalance({
    address,
    chainId: NETWORK_CONFIG.mainnet.base.chainId,
    token: NETWORK_CONFIG.mainnet.base.usdc as `0x${string}`,
    query: { enabled: networkMode === 'mainnet' && !!address },
  });

  // Ethereum Mainnet
  const ethMainnetEth = useBalance({
    address,
    chainId: NETWORK_CONFIG.mainnet.ethereum.chainId,
    query: { enabled: networkMode === 'mainnet' && !!address },
  });

  const ethMainnetUsdc = useBalance({
    address,
    chainId: NETWORK_CONFIG.mainnet.ethereum.chainId,
    token: NETWORK_CONFIG.mainnet.ethereum.usdc as `0x${string}`,
    query: { enabled: networkMode === 'mainnet' && !!address },
  });

  // ===== TESTNET BALANCES =====

  // Base Sepolia
  const baseSepoliaEth = useBalance({
    address,
    chainId: NETWORK_CONFIG.testnet.baseSepolia.chainId,
    query: { enabled: networkMode === 'testnet' && !!address },
  });

  const baseSepoliaUsdc = useBalance({
    address,
    chainId: NETWORK_CONFIG.testnet.baseSepolia.chainId,
    token: NETWORK_CONFIG.testnet.baseSepolia.usdc as `0x${string}`,
    query: { enabled: networkMode === 'testnet' && !!address },
  });

  // ===== AUTO-REFRESH ON NEW BLOCKS =====

  // Watch mainnet blocks
  const { data: baseMainnetBlock } = useBlockNumber({
    chainId: NETWORK_CONFIG.mainnet.base.chainId,
    watch: networkMode === 'mainnet',
  });

  // Watch testnet blocks
  const { data: baseSepoliaBlock } = useBlockNumber({
    chainId: NETWORK_CONFIG.testnet.baseSepolia.chainId,
    watch: networkMode === 'testnet',
  });

  // Invalidate mainnet queries on new blocks
  useEffect(() => {
    if (baseMainnetBlock && networkMode === 'mainnet') {
      queryClient.invalidateQueries({ queryKey: baseMainnetEth.queryKey });
      queryClient.invalidateQueries({ queryKey: baseMainnetUsdc.queryKey });
    }
  }, [baseMainnetBlock, networkMode, queryClient, baseMainnetEth.queryKey, baseMainnetUsdc.queryKey]);

  // Invalidate testnet queries on new blocks
  useEffect(() => {
    if (baseSepoliaBlock && networkMode === 'testnet') {
      queryClient.invalidateQueries({ queryKey: baseSepoliaEth.queryKey });
      queryClient.invalidateQueries({ queryKey: baseSepoliaUsdc.queryKey });
    }
  }, [baseSepoliaBlock, networkMode, queryClient, baseSepoliaEth.queryKey, baseSepoliaUsdc.queryKey]);

  // Calculate loading and error states based on active network
  const isLoading =
    networkMode === 'mainnet'
      ? baseMainnetEth.isLoading || baseMainnetUsdc.isLoading || ethMainnetEth.isLoading || ethMainnetUsdc.isLoading
      : baseSepoliaEth.isLoading || baseSepoliaUsdc.isLoading;

  const hasError =
    networkMode === 'mainnet'
      ? baseMainnetEth.isError || baseMainnetUsdc.isError || ethMainnetEth.isError || ethMainnetUsdc.isError
      : baseSepoliaEth.isError || baseSepoliaUsdc.isError;

  return {
    mainnet: {
      base: {
        eth: baseMainnetEth,
        usdc: baseMainnetUsdc,
      },
      ethereum: {
        eth: ethMainnetEth,
        usdc: ethMainnetUsdc,
      },
    },
    testnet: {
      baseSepolia: {
        eth: baseSepoliaEth,
        usdc: baseSepoliaUsdc,
      },
    },
    activeNetwork: networkMode,
    isLoading,
    hasError,
  };
}
