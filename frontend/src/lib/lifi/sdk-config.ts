'use client';

import { createConfig, EVM } from '@lifi/sdk';
import { getWalletClient, switchChain } from '@wagmi/core';
import type { Config } from 'wagmi';

let sdkConfigured = false;

/**
 * Configure LI.FI SDK with wagmi integration
 * Call this once when the app initializes
 */
export function configureLiFiSDK(wagmiConfig: Config) {
  if (sdkConfigured) return;

  createConfig({
    integrator: process.env.NEXT_PUBLIC_LIFI_INTEGRATOR || 'civitas',
    providers: [
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId) => {
          const chain = await switchChain(wagmiConfig, { chainId });
          return getWalletClient(wagmiConfig, { chainId: chain.id });
        },
      }),
    ],
  });

  sdkConfigured = true;
}
