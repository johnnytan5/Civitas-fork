import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FACTORY_ADDRESS } from '@/lib/contracts/constants';
import { RENTAL_FACTORY_ABI } from '@/lib/contracts/abis';
import { predictRentalAddress } from '@/lib/contracts/predict-address';
import type { RentalConfig } from '@/lib/ai/schemas';
import { createContract } from '@/lib/supabase/contracts';
import { createUserContractRelation, getOrCreateUser } from '@/lib/supabase/users';

export function useContractDeploy() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [suggestedName, setSuggestedName] = useState<string>('');
  const [predictedAddress, setPredictedAddress] = useState<`0x${string}` | null>(null);
  const [lastDeployedConfig, setLastDeployedConfig] = useState<{
    landlord: string;
    tenant: string;
    monthlyAmount: bigint;
    totalMonths: number;
    basename: string;
  } | null>(null);

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

    // Store config for post-deployment database write
    setLastDeployedConfig({
      landlord,
      tenant,
      monthlyAmount,
      totalMonths,
      basename: nameToUse,
    });

    writeContract({
      address: FACTORY_ADDRESS,
      abi: RENTAL_FACTORY_ABI,
      functionName: 'deployRental',
      args: [landlord, tenant, monthlyAmount, totalMonths, nameToUse],
    });
  };

  /**
   * Create database record after successful deployment
   */
  useEffect(() => {
    if (isSuccess && predictedAddress && lastDeployedConfig) {
      const createDatabaseRecord = async () => {
        try {
          // 1. Ensure landlord user exists
          await getOrCreateUser(lastDeployedConfig.landlord);

          // 2. Ensure tenant user exists if address is set
          if (lastDeployedConfig.tenant !== '0x0000000000000000000000000000000000000000') {
            await getOrCreateUser(lastDeployedConfig.tenant);
          }

          // 3. Create contract record in Supabase
          await createContract({
            contract_address: predictedAddress,
            landlord_address: lastDeployedConfig.landlord,
            tenant_address: lastDeployedConfig.tenant !== '0x0000000000000000000000000000000000000000'
              ? lastDeployedConfig.tenant
              : null,
            basename: lastDeployedConfig.basename,
            monthly_amount: Number(lastDeployedConfig.monthlyAmount),
            total_months: lastDeployedConfig.totalMonths,
            state: 0, // Deployed state
          });

          // 4. Create user-contract relationships
          await createUserContractRelation(lastDeployedConfig.landlord, predictedAddress, 'landlord');
          if (lastDeployedConfig.tenant !== '0x0000000000000000000000000000000000000000') {
            await createUserContractRelation(lastDeployedConfig.tenant, predictedAddress, 'tenant');
          }

          console.log('Contract record created in Supabase:', predictedAddress);
        } catch (error) {
          console.error('Failed to create contract record in Supabase:', error);
          // Don't fail deployment if database write fails
          // Blockchain is source of truth; database can be re-synced later
        }
      };

      createDatabaseRecord();
    }
  }, [isSuccess, predictedAddress, lastDeployedConfig]);

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
