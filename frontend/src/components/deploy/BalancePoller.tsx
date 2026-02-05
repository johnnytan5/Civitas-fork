'use client';

import { useReadContract } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';
import { formatUnits } from 'viem';
import { getUsdcAddress } from '@/lib/lifi/constants';

interface BalancePollerProps {
  contractAddress: `0x${string}`;
  requiredAmount: bigint;
  chainId: number;
  onFunded: () => void;
  pollInterval?: number;
}

const USDC_BALANCE_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function BalancePoller({
  contractAddress,
  requiredAmount,
  chainId,
  onFunded,
  pollInterval = 5000,
}: BalancePollerProps) {
  const [isFunded, setIsFunded] = useState(false);

  const usdcAddress = getUsdcAddress(chainId);

  const { data: balance, refetch } = useReadContract({
    address: usdcAddress,
    abi: USDC_BALANCE_ABI,
    functionName: 'balanceOf',
    args: [contractAddress],
    query: { enabled: !isFunded && !!usdcAddress },
  });

  const handleFunded = useCallback(() => {
    onFunded();
  }, [onFunded]);

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
      handleFunded();
    }
  }, [balance, requiredAmount, handleFunded]);

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
