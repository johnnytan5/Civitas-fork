# LI.FI Integration Implementation Plan

**Created**: February 5, 2026
**Updated**: February 5, 2026
**Status**: Planned
**Goal**: Enable cross-chain bridging and swapping so users can pay in USDC from any chain/token

---

## Overview

Integrate the LI.FI Widget to allow users to fund their deployed contracts with USDC on Base from any source chain or token. The widget will be embedded in the deployment flow with the destination locked to the predicted CREATE2 contract address.

### Key Clarifications

**1. LI.FI Does NOT Support Testnets**
LI.FI only operates on mainnet chains. There is no support for Base Sepolia, Ethereum Sepolia, or any other testnet. For local development and testing, we provide a fallback mechanism using direct USDC transfers.

**2. Funds Go Directly to the Contract (Not User Wallet)**
By setting the `toAddress` parameter in the widget config to the predicted contract address, LI.FI will send the bridged/swapped USDC directly to the contract. This is critical for the balance-based activation flow.

```typescript
// Widget config - funds go to contract, not user wallet
toAddress: contractAddress,  // e.g., "0x1234...abcd" (predicted CREATE2 address)
```

---

## Prerequisites

- Contracts deployable via CivitasFactory with CREATE2 address prediction
- User wallet connected via RainbowKit
- Network toggle between Base mainnet and Base Sepolia working

---

## Implementation Steps

### Phase 1: Package Installation & Setup

#### 1.1 Install Dependencies
```bash
npm install @lifi/widget @lifi/sdk
```

#### 1.2 Create Directory Structure
```
lib/lifi/
├── widget-config.ts      # Widget configuration factory
├── constants.ts          # Chain IDs, token addresses
└── types.ts              # TypeScript types

components/deploy/
├── DeployModal.tsx       # Main deployment orchestration modal
├── LiFiBridgeStep.tsx    # LI.FI widget wrapper (mainnet only)
├── DirectFundingStep.tsx # Direct USDC transfer (testnet fallback)
├── DeploymentSteps.tsx   # Step indicator component
└── BalancePoller.tsx     # Poll contract balance until funded
```

#### 1.3 Environment Variables
Add to `.env.local` and `.env.example`:
```env
# LI.FI (optional - widget works without API key for basic usage)
NEXT_PUBLIC_LIFI_INTEGRATOR=civitas
```

---

### Phase 2: Core LI.FI Configuration

#### 2.1 Create `lib/lifi/constants.ts`
```typescript
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
export const USDC_ADDRESSES = {
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
  return Object.values(LIFI_SUPPORTED_CHAIN_IDS).includes(chainId as any);
}
```

#### 2.2 Create `lib/lifi/widget-config.ts`
```typescript
import type { WidgetConfig } from '@lifi/widget';
import { LIFI_SUPPORTED_CHAIN_IDS, USDC_ADDRESSES } from './constants';

/**
 * Creates LI.FI Widget configuration
 *
 * IMPORTANT:
 * - LI.FI only supports MAINNET chains
 * - The `toAddress` parameter ensures funds go directly to the contract,
 *   NOT to the user's connected wallet
 */
export function createWidgetConfig({
  destinationAddress,
  amount,
}: {
  destinationAddress: `0x${string}`;
  amount: bigint; // USDC amount in 6 decimals
}): WidgetConfig {
  const chainId = LIFI_SUPPORTED_CHAIN_IDS.BASE_MAINNET;
  const usdcAddress = USDC_ADDRESSES[chainId];

  return {
    integrator: process.env.NEXT_PUBLIC_LIFI_INTEGRATOR || 'civitas',
    variant: 'compact',
    subvariant: 'split',

    // CRITICAL: Lock destination to CONTRACT address (not user wallet)
    // This ensures bridged funds go directly to the deployed contract
    toChain: chainId,
    toToken: usdcAddress,
    toAddress: destinationAddress,  // <-- Funds sent HERE, not to user wallet

    // Lock the amount to match contract requirements
    toAmount: amount.toString(),

    // Allow any source chain/token - user picks what they want to pay with
    fromChain: undefined,
    fromToken: undefined,

    // UI customization
    appearance: 'dark',
    theme: {
      palette: {
        primary: { main: '#3B82F6' },
        secondary: { main: '#10B981' },
      },
    },

    // Hide destination fields since they're locked
    hiddenUI: ['toAddress'],

    // Disable destination chain/token selection
    disabledUI: ['toToken', 'toChain'],

    // Build settings
    buildSwapUrl: true,
  };
}
```

---

### Phase 3: React Components

#### 3.1 Create `components/deploy/LiFiBridgeStep.tsx`
```typescript
'use client';

import { LiFiWidget, useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect, useState } from 'react';
import { createWidgetConfig } from '@/lib/lifi/widget-config';

interface LiFiBridgeStepProps {
  destinationAddress: `0x${string}`;
  amount: bigint;
  onBridgeStarted: (txHash: string) => void;
  onBridgeCompleted: () => void;
  onError: (error: Error) => void;
}

/**
 * LI.FI Widget wrapper for cross-chain bridging
 *
 * NOTE: Only works on MAINNET. For testnet, use DirectFundingStep instead.
 *
 * Funds are sent directly to `destinationAddress` (the contract),
 * NOT to the user's connected wallet.
 */
export function LiFiBridgeStep({
  destinationAddress,
  amount,
  onBridgeStarted,
  onBridgeCompleted,
  onError,
}: LiFiBridgeStepProps) {
  const widgetEvents = useWidgetEvents();
  const [config] = useState(() =>
    createWidgetConfig({ destinationAddress, amount })
  );

  useEffect(() => {
    const handleRouteExecutionStarted = (route: any) => {
      console.log('Bridge started:', route);
      const txHash = route.steps?.[0]?.execution?.process?.[0]?.txHash;
      if (txHash) {
        onBridgeStarted(txHash);
      }
    };

    const handleRouteExecutionCompleted = (route: any) => {
      console.log('Bridge completed:', route);
      onBridgeCompleted();
    };

    const handleRouteExecutionFailed = (update: any) => {
      console.error('Bridge failed:', update);
      onError(new Error(update.error?.message || 'Bridge failed'));
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, handleRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, handleRouteExecutionCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, handleRouteExecutionFailed);

    return () => {
      widgetEvents.off(WidgetEvent.RouteExecutionStarted, handleRouteExecutionStarted);
      widgetEvents.off(WidgetEvent.RouteExecutionCompleted, handleRouteExecutionCompleted);
      widgetEvents.off(WidgetEvent.RouteExecutionFailed, handleRouteExecutionFailed);
    };
  }, [widgetEvents, onBridgeStarted, onBridgeCompleted, onError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          Funds will be sent directly to the contract address:
        </p>
        <code className="text-xs text-blue-400 break-all">{destinationAddress}</code>
      </div>
      <LiFiWidget config={config} integrator="civitas" />
    </div>
  );
}
```

#### 3.2 Create `components/deploy/DirectFundingStep.tsx` (Testnet Fallback)
```typescript
'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { USDC_ADDRESSES, TESTNET_CHAIN_IDS } from '@/lib/lifi/constants';

interface DirectFundingStepProps {
  destinationAddress: `0x${string}`;
  amount: bigint;
  chainId: number;
  onTransferCompleted: () => void;
  onError: (error: Error) => void;
}

const ERC20_TRANSFER_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/**
 * Direct USDC transfer for TESTNET environments
 *
 * Since LI.FI doesn't support testnets, this component allows users
 * to directly transfer USDC from their wallet to the contract.
 */
export function DirectFundingStep({
  destinationAddress,
  amount,
  chainId,
  onTransferCompleted,
  onError,
}: DirectFundingStepProps) {
  const [isPending, setIsPending] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES];
  const displayAmount = formatUnits(amount, 6);

  const handleTransfer = async () => {
    try {
      setIsPending(true);
      await writeContractAsync({
        address: usdcAddress as `0x${string}`,
        abi: ERC20_TRANSFER_ABI,
        functionName: 'transfer',
        args: [destinationAddress, amount],
      });
      onTransferCompleted();
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Transfer failed'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-sm text-yellow-300 font-medium mb-2">
          Testnet Mode - Direct Transfer
        </p>
        <p className="text-xs text-yellow-200/70">
          LI.FI bridging is not available on testnets. You can directly transfer
          USDC from your wallet to fund the contract.
        </p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount</span>
          <span>{displayAmount} USDC</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">To Contract</span>
          <code className="text-xs">{destinationAddress.slice(0, 10)}...{destinationAddress.slice(-8)}</code>
        </div>
      </div>

      <button
        onClick={handleTransfer}
        disabled={isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600
                   text-white py-3 rounded-lg font-medium transition-colors"
      >
        {isPending ? 'Transferring...' : `Transfer ${displayAmount} USDC`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Make sure you have enough USDC in your wallet on this testnet.
      </p>
    </div>
  );
}
```

#### 3.3 Create `components/deploy/BalancePoller.tsx`
```typescript
'use client';

import { useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { USDC_ABI } from '@/lib/contracts/abis';
import { USDC_ADDRESSES } from '@/lib/lifi/constants';

interface BalancePollerProps {
  contractAddress: `0x${string}`;
  requiredAmount: bigint;
  chainId: number;
  onFunded: () => void;
  pollInterval?: number;
}

export function BalancePoller({
  contractAddress,
  requiredAmount,
  chainId,
  onFunded,
  pollInterval = 5000,
}: BalancePollerProps) {
  const [isFunded, setIsFunded] = useState(false);

  const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES];

  const { data: balance, refetch } = useReadContract({
    address: usdcAddress as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [contractAddress],
    query: { enabled: !isFunded && !!usdcAddress },
  });

  // Poll for balance updates
  useEffect(() => {
    if (isFunded) return;

    const interval = setInterval(() => {
      refetch();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [isFunded, pollInterval, refetch]);

  // Check if funded
  useEffect(() => {
    if (balance && balance >= requiredAmount) {
      setIsFunded(true);
      onFunded();
    }
  }, [balance, requiredAmount, onFunded]);

  const currentBalance = balance ? formatUnits(balance, 6) : '0';
  const required = formatUnits(requiredAmount, 6);
  const percentage = balance
    ? Math.min(100, Number((balance * 100n) / requiredAmount))
    : 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>Contract Balance</span>
        <span>{currentBalance} / {required} USDC</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!isFunded && (
        <p className="text-xs text-gray-400 text-center">
          Waiting for funds... (checking every {pollInterval / 1000}s)
        </p>
      )}
      {isFunded && (
        <p className="text-xs text-green-400 text-center font-medium">
          Contract funded successfully!
        </p>
      )}
    </div>
  );
}
```

#### 3.4 Create `components/deploy/DeployModal.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useChainId } from 'wagmi';
import { LiFiBridgeStep } from './LiFiBridgeStep';
import { DirectFundingStep } from './DirectFundingStep';
import { BalancePoller } from './BalancePoller';
import { isLiFiSupported, LIFI_SUPPORTED_CHAIN_IDS } from '@/lib/lifi/constants';

type DeployStep = 'confirm' | 'deploying' | 'fund' | 'polling' | 'complete';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: `0x${string}`;
  requiredAmount: bigint;
  onDeployContract: () => Promise<void>;
  contractName: string;
}

export function DeployModal({
  isOpen,
  onClose,
  contractAddress,
  requiredAmount,
  onDeployContract,
  contractName,
}: DeployModalProps) {
  const [step, setStep] = useState<DeployStep>('confirm');
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  // Check if current chain is supported by LI.FI (mainnet only)
  const isMainnet = isLiFiSupported(chainId);

  const handleDeploy = async () => {
    try {
      setStep('deploying');
      setError(null);
      await onDeployContract();
      setStep('fund');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
      setStep('confirm');
    }
  };

  const handleFundingCompleted = () => {
    setStep('polling');
  };

  const handleContractFunded = () => {
    setStep('complete');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Deploy {contractName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {['Confirm', 'Deploy', 'Fund', 'Active'].map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${i <= ['confirm', 'deploying', 'fund', 'complete'].indexOf(step)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-400'}`}>
                {i + 1}
              </div>
              <span className="text-xs mt-1 text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Step Content */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <p className="text-gray-300">
              You're about to deploy a contract to Base. After deployment,
              you'll fund it {isMainnet ? 'using any token from any chain via LI.FI' : 'with a direct USDC transfer'}.
            </p>

            {!isMainnet && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300">
                  Testnet detected. LI.FI bridging is not available on testnets.
                  You'll use direct USDC transfer instead.
                </p>
              </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Contract Address</span>
                <code className="text-xs">{contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Required Funding</span>
                <span>{(Number(requiredAmount) / 1e6).toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span>{isMainnet ? 'Base Mainnet' : 'Base Sepolia (Testnet)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Funding Method</span>
                <span>{isMainnet ? 'LI.FI Cross-Chain' : 'Direct Transfer'}</span>
              </div>
            </div>
            <button
              onClick={handleDeploy}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              Deploy Contract
            </button>
          </div>
        )}

        {step === 'deploying' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-300">Deploying contract...</p>
            <p className="text-sm text-gray-500">Please confirm in your wallet</p>
          </div>
        )}

        {step === 'fund' && (
          <div className="space-y-4">
            <p className="text-gray-300 text-center mb-4">
              Contract deployed! Now fund it with USDC.
            </p>

            {isMainnet ? (
              // Mainnet: Use LI.FI widget for cross-chain bridging
              <LiFiBridgeStep
                destinationAddress={contractAddress}
                amount={requiredAmount}
                onBridgeStarted={(hash) => console.log('Bridge tx:', hash)}
                onBridgeCompleted={handleFundingCompleted}
                onError={(err) => setError(err.message)}
              />
            ) : (
              // Testnet: Use direct USDC transfer
              <DirectFundingStep
                destinationAddress={contractAddress}
                amount={requiredAmount}
                chainId={chainId}
                onTransferCompleted={handleFundingCompleted}
                onError={(err) => setError(err.message)}
              />
            )}
          </div>
        )}

        {step === 'polling' && (
          <div className="space-y-4">
            <p className="text-gray-300 text-center">
              {isMainnet
                ? 'Bridge transaction submitted! Waiting for funds to arrive...'
                : 'Transfer submitted! Waiting for confirmation...'}
            </p>
            <BalancePoller
              contractAddress={contractAddress}
              requiredAmount={requiredAmount}
              chainId={isMainnet ? LIFI_SUPPORTED_CHAIN_IDS.BASE_MAINNET : chainId}
              onFunded={handleContractFunded}
            />
            {isMainnet && (
              <p className="text-xs text-gray-500 text-center">
                Cross-chain transfers typically take 1-5 minutes
              </p>
            )}
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Contract Active!</h3>
            <p className="text-gray-300 mb-6">
              Your contract has been deployed and funded.
            </p>
            <button
              onClick={onClose}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-lg font-medium"
            >
              View Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Phase 4: Integration with Create Flow

#### 4.1 Update Create Page
Add deployment trigger to `app/create/page.tsx`:
- Add "Deploy" button that appears when config is complete
- Open DeployModal with predicted CREATE2 address
- Wire up contract deployment via CivitasFactory

#### 4.2 Create Deployment Hook `hooks/useContractDeploy.ts`
```typescript
'use client';

import { useWriteContract } from 'wagmi';
import { useState, useCallback } from 'react';
import { predictAddress } from '@/lib/contracts/predict-address';
import { CIVITAS_FACTORY_ABI } from '@/lib/contracts/abis';

export function useContractDeploy() {
  const [predictedAddress, setPredictedAddress] = useState<`0x${string}` | null>(null);
  const { writeContractAsync } = useWriteContract();

  const deploy = useCallback(async ({
    factoryAddress,
    templateId,
    initData,
    salt,
  }: {
    factoryAddress: `0x${string}`;
    templateId: number;
    initData: `0x${string}`;
    salt: `0x${string}`;
  }) => {
    // Predict address first
    const predicted = predictAddress(factoryAddress, templateId, salt);
    setPredictedAddress(predicted);

    // Deploy
    const hash = await writeContractAsync({
      address: factoryAddress,
      abi: CIVITAS_FACTORY_ABI,
      functionName: 'deploy',
      args: [templateId, initData, salt],
    });

    return { hash, predictedAddress: predicted };
  }, [writeContractAsync]);

  return { deploy, predictedAddress };
}
```

---

### Phase 5: USDC ABI Addition

#### 5.1 Add to `lib/contracts/abis.ts`
```typescript
export const USDC_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
```

---

## Important: How LI.FI Funds the Contract

### The `toAddress` Parameter

When configuring the LI.FI widget, the `toAddress` parameter determines where bridged funds are sent:

```typescript
// In widget-config.ts
toAddress: destinationAddress,  // Contract address, NOT user wallet
```

**Flow:**
1. User selects source token (e.g., ETH on Arbitrum)
2. LI.FI finds best route to convert to USDC on Base
3. Funds are sent directly to `toAddress` (the contract)
4. Contract receives USDC and can activate based on balance

**This is NOT a two-step process.** The user does not receive funds in their wallet first. LI.FI handles the entire bridge + send in one transaction flow.

---

## Validation Checklist

### 1. Package Installation
```bash
# Verify packages installed
npm ls @lifi/widget @lifi/sdk
```

### 2. Widget Renders (Mainnet Only)
- [ ] Connect wallet to Base Mainnet
- [ ] Navigate to create page, complete a contract configuration
- [ ] Click deploy - modal should open
- [ ] LI.FI widget should render without console errors

### 3. Widget Configuration
- [ ] Destination chain is locked to Base Mainnet (8453)
- [ ] Destination token is locked to USDC
- [ ] Destination address shows predicted contract address (NOT user wallet)
- [ ] Amount is pre-filled with required funding
- [ ] User can select any source chain/token

### 4. Testnet Fallback
- [ ] Connect wallet to Base Sepolia
- [ ] Deploy modal shows "Testnet Mode" warning
- [ ] DirectFundingStep component renders (not LI.FI widget)
- [ ] Direct USDC transfer works

### 5. Balance Polling
- [ ] After bridge/transfer initiated, UI switches to polling view
- [ ] Progress bar shows current vs required balance
- [ ] Balance updates every 5 seconds
- [ ] When balance >= required, shows "Contract funded!"

### 6. End-to-End Flow (Mainnet)
1. [ ] Create contract config via chat
2. [ ] Click Deploy
3. [ ] Confirm deployment transaction in wallet
4. [ ] LI.FI widget appears with locked destination
5. [ ] Verify "Funds will be sent to contract" message shows correct address
6. [ ] Select source token and amount
7. [ ] Execute bridge
8. [ ] Wait for funds to arrive (1-5 min)
9. [ ] Contract shows as Active

### 7. Error Handling
- [ ] Insufficient balance shows clear error
- [ ] Bridge failure shows retry option
- [ ] Network mismatch prompts switch
- [ ] User can close modal and retry

---

## Manual Testing Commands

```bash
# 1. Start dev server
npm run dev

# 2. Open browser console and check for errors
# Navigate to http://localhost:3000/create

# 3. For mainnet testing:
# - Connect wallet to Base Mainnet
# - Have some tokens on any supported chain

# 4. For testnet testing:
# - Connect wallet to Base Sepolia
# - Get testnet USDC from faucet

# 5. Complete chat to configure contract

# 6. Click Deploy and observe modal

# 7. Check network requests in DevTools > Network
# Look for LI.FI API calls to li.quest (mainnet only)
```

---

## Troubleshooting

### Widget not rendering
- Check if `@lifi/widget` is in package.json
- Verify no SSR issues (widget is client-side only)
- Check browser console for errors
- Ensure you're on mainnet (LI.FI doesn't work on testnet)

### No routes found
- Ensure source token has balance
- **LI.FI does NOT support testnets** - switch to mainnet
- Try a different source token

### Bridge stuck
- Check LI.FI Explorer: https://explorer.li.fi
- Verify transaction hash on source chain explorer
- Cross-chain bridges can take 5-20 minutes

### Funds went to wrong address
- Verify `toAddress` in widget config is the contract address
- Check the "Funds will be sent to contract" message in UI

### Balance not updating
- Verify polling is active in React DevTools
- Check USDC contract address is correct for network
- Manually check balance on Basescan

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/lifi/constants.ts` | Chain IDs, USDC addresses, helper functions |
| `lib/lifi/widget-config.ts` | Widget configuration factory |
| `lib/lifi/types.ts` | TypeScript types |
| `components/deploy/DeployModal.tsx` | Main deployment modal |
| `components/deploy/LiFiBridgeStep.tsx` | LI.FI widget wrapper (mainnet) |
| `components/deploy/DirectFundingStep.tsx` | Direct transfer (testnet fallback) |
| `components/deploy/BalancePoller.tsx` | Balance monitoring |
| `hooks/useContractDeploy.ts` | Deployment orchestration |

---

## Summary of Key Points

1. **LI.FI = Mainnet Only**: No testnet support. Use direct USDC transfer for testnet development.

2. **Funds Go to Contract**: The `toAddress` parameter in widget config sends bridged funds directly to the contract address, not the user's wallet.

3. **Automatic Detection**: The modal automatically detects mainnet vs testnet and shows the appropriate funding method.

4. **Balance-Based Activation**: After funds arrive at the contract, the balance poller detects this and marks the contract as funded.

---

## References

- [LI.FI Widget Docs](https://docs.li.fi/integrate-li.fi-widget/li.fi-widget)
- [LI.FI SDK Docs](https://docs.li.fi/integrate-li.fi-sdk/get-started)
- [LI.FI Supported Chains](https://docs.li.fi/list-chains-bridges-dexs/chains) (Mainnet only)
- [Project LI.FI API Docs](docs/tech/li.fi/lifi-api.md)
- [Project LI.FI SDK Docs](docs/tech/li.fi/lifi-sdk.md)
