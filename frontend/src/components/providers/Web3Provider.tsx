'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia, arbitrum, optimism } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'Civitas',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [base, baseSepolia, arbitrum, optimism],
  ssr: true,
});

const queryClient = new QueryClient();

function WalletAuthHandler({ children }: { children: React.ReactNode }) {
  useWalletAuth();
  return <>{children}</>;
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletAuthHandler>{children}</WalletAuthHandler>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
