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

  const handleClose = () => {
    setStep('confirm');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Deploy {contractName}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
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
              You&apos;re about to deploy a contract to Base. After deployment,
              you&apos;ll fund it {isMainnet ? 'using any token from any chain via LI.FI' : 'with a direct USDC transfer'}.
            </p>

            {!isMainnet && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300">
                  Testnet detected. LI.FI bridging is not available on testnets.
                  You&apos;ll use direct USDC transfer instead.
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
              onClick={handleClose}
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
