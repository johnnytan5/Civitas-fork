'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { useContractDeploy } from '@/hooks/useContractDeploy';
import type { RentalConfig } from '@/lib/ai/schemas';

interface DeployModalProps {
  config: RentalConfig;
  isOpen: boolean;
  onClose: () => void;
}

enum DeployStep {
  PREVIEW = 'preview',
  GENERATING = 'generating',
  DEPLOYING = 'deploying',
  FUNDING = 'funding',
  SUCCESS = 'success',
}

export function DeployModal({ config, isOpen, onClose }: DeployModalProps) {
  const { address } = useAccount();
  const [step, setStep] = useState<DeployStep>(DeployStep.PREVIEW);
  const {
    generateName,
    deployContract,
    suggestedName,
    predictedAddress,
    isDeploying,
    isSuccess,
  } = useContractDeploy();

  if (!isOpen) return null;

  const handleDeploy = async () => {
    if (!address) return;

    // Step 1: Generate basename
    setStep(DeployStep.GENERATING);
    const name = await generateName(config);

    if (!name) {
      alert('Failed to generate basename');
      setStep(DeployStep.PREVIEW);
      return;
    }

    // Step 2: Deploy contract
    setStep(DeployStep.DEPLOYING);
    const monthlyAmountWei = parseUnits(config.monthlyAmount.toString(), 6);

    await deployContract(
      address, // landlord
      config.tenant as `0x${string}`, // tenant (will add ENS resolution in Task 18)
      monthlyAmountWei,
      config.totalMonths,
      name
    );

    if (isSuccess) {
      setStep(DeployStep.SUCCESS);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-zinc-900 mb-4">
          Deploy Rental Agreement
        </h2>

        {step === DeployStep.PREVIEW && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-600 mb-2">Tenant: {config.tenant}</p>
              <p className="text-sm text-zinc-600 mb-2">
                Monthly: {config.monthlyAmount} USDC
              </p>
              <p className="text-sm text-zinc-600 mb-2">
                Duration: {config.totalMonths} months
              </p>
              <p className="text-sm font-semibold text-zinc-900">
                Total: {config.monthlyAmount * config.totalMonths} USDC
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeploy}
                className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
              >
                Deploy Contract
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === DeployStep.GENERATING && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4" />
            <p className="text-sm text-zinc-600">Generating basename...</p>
          </div>
        )}

        {step === DeployStep.DEPLOYING && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4" />
            <p className="text-sm text-zinc-600 mb-2">Deploying contract...</p>
            {suggestedName && (
              <p className="text-xs text-zinc-500">
                Basename: {suggestedName}.civitas.base.eth
              </p>
            )}
            {predictedAddress && (
              <p className="text-xs text-zinc-500 font-mono mt-2">
                Address: {predictedAddress.slice(0, 10)}...
              </p>
            )}
          </div>
        )}

        {step === DeployStep.SUCCESS && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-lg font-semibold text-zinc-900 mb-2">
              Contract Deployed!
            </p>
            <p className="text-sm text-zinc-600 mb-4">
              {suggestedName}.civitas.base.eth
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
