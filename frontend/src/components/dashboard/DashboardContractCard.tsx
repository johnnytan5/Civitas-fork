'use client';

import { formatUnits } from 'viem';
import type { RentalContract } from '@/lib/contracts/fetch-contracts';
import { ContractState } from '@/lib/contracts/fetch-contracts';

interface DashboardContractCardProps {
  contract: RentalContract;
}

const STATE_LABELS: Record<ContractState, { label: string; emoji: string; color: string }> = {
  [ContractState.Deployed]: { label: 'Ghost', emoji: '🔴', color: 'text-red-600' },
  [ContractState.Active]: { label: 'Active', emoji: '🟢', color: 'text-green-600' },
  [ContractState.Completed]: { label: 'Completed', emoji: '✅', color: 'text-blue-600' },
  [ContractState.TerminationPending]: { label: 'Terminating', emoji: '🟣', color: 'text-purple-600' },
  [ContractState.Terminated]: { label: 'Terminated', emoji: '⚫', color: 'text-gray-600' },
};

export function DashboardContractCard({ contract }: DashboardContractCardProps) {
  const stateInfo = STATE_LABELS[contract.state];
  const monthlyAmount = formatUnits(contract.monthlyAmount, 6);
  const totalAmount = formatUnits(contract.monthlyAmount * BigInt(contract.totalMonths), 6);
  const paidAmount = formatUnits(contract.totalPaid, 6);

  // Calculate progress percentage
  const totalRequired = contract.monthlyAmount * BigInt(contract.totalMonths);
  const progressPercent = totalRequired > 0n
    ? Number((contract.totalPaid * 100n) / totalRequired)
    : 0;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-900 font-mono">
            {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {contract.totalMonths} months • {monthlyAmount} USDC/mo
          </p>
        </div>
        <div className={`flex items-center space-x-1 ${stateInfo.color}`}>
          <span>{stateInfo.emoji}</span>
          <span className="text-xs font-medium">{stateInfo.label}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {contract.state === ContractState.Active && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-zinc-600 mb-1">
            <span>Paid: {paidAmount} USDC</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">Tenant:</span>
          <span className="text-zinc-900 font-mono text-xs">
            {contract.tenant.slice(0, 6)}...{contract.tenant.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Total:</span>
          <span className="text-zinc-900 font-semibold">{totalAmount} USDC</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-zinc-200">
        <button className="w-full px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800">
          View Details
        </button>
      </div>
    </div>
  );
}
