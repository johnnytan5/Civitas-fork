'use client';

import { useWriteContract } from 'wagmi';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { getUsdcAddress } from '@/lib/lifi/constants';

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

  const usdcAddress = getUsdcAddress(chainId);
  const displayAmount = formatUnits(amount, 6);

  const handleTransfer = async () => {
    if (!usdcAddress) {
      onError(new Error('USDC not supported on this chain'));
      return;
    }

    try {
      setIsPending(true);
      await writeContractAsync({
        address: usdcAddress,
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
