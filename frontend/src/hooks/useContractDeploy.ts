import { useState } from 'use';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FACTORY_ADDRESS, RENTAL_FACTORY_ABI } from '@/lib/contracts';
import { predictRentalAddress } from '@/lib/contracts/predict-address';
import type { RentalConfig } from '@/lib/ai/schemas';

export function useContractDeploy() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [suggestedName, setSuggestedName] = useState<string>('');
  const [predictedAddress, setPredictedAddress] = useState<`0x${string}` | null>(null);

  /**
   * Generate semantic basename using AI
   */
  const generateName = async (config: RentalConfig, conversationContext?: string) => {
    try {
      const response = await fetch('/api/generate-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, conversationContext }),
      });

      if (response.ok) {
        const { suggestedName: name } = await response.json();
        setSuggestedName(name);

        if (address) {
          const predicted = predictRentalAddress(address, name);
          setPredictedAddress(predicted);
        }

        return name;
      }
    } catch (error) {
      console.error('Failed to generate name:', error);
    }
    return null;
  };

  /**
   * Deploy rental contract to predicted address
   */
  const deployContract = async (
    landlord: `0x${string}`,
    tenant: `0x${string}`,
    monthlyAmount: bigint,
    totalMonths: number,
    name?: string
  ) => {
    const nameToUse = name || suggestedName;

    if (!nameToUse) {
      throw new Error('No basename provided');
    }

    writeContract({
      address: FACTORY_ADDRESS,
      abi: RENTAL_FACTORY_ABI,
      functionName: 'deployRental',
      args: [landlord, tenant, monthlyAmount, totalMonths, nameToUse],
    });
  };

  return {
    generateName,
    deployContract,
    suggestedName,
    predictedAddress,
    isDeploying: isPending || isConfirming,
    isSuccess,
    deploymentHash: hash,
  };
}
