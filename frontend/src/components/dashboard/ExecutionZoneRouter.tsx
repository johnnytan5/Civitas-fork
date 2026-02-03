'use client';

import { useAccount } from 'wagmi';
import type { AllContracts } from '@/app/dashboard/page';
import type { AnyContract } from '@/lib/contracts/types';
import { getUserRole } from '@/lib/contracts/role-detection';
import RentVaultExecutionZone from './rent-vault/RentVaultExecutionZone';
import GroupBuyEscrowExecutionZone from './group-buy-escrow/GroupBuyEscrowExecutionZone';
import StableAllowanceTreasuryExecutionZone from './stable-allowance-treasury/StableAllowanceTreasuryExecutionZone';

interface ExecutionZoneRouterProps {
  contract: AllContracts | null;
  onSync?: () => void;
}

export default function ExecutionZoneRouter({ contract, onSync }: ExecutionZoneRouterProps) {
  const { address } = useAccount();

  if (!contract) {
    return (
      <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
        <div className="relative z-10">
          <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-12 text-center">
            <h2 className="font-headline text-2xl uppercase mb-4">Execution Zone</h2>
            <p className="font-display font-bold text-black">
              SELECT A CONTRACT TO VIEW DETAILS
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a legacy rental contract (no template_id)
  if ('tenant' in contract && !('template_id' in contract)) {
    // Legacy rental contract - show original ExecutionZone
    return (
      <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
        <h2 className="font-headline text-2xl uppercase tracking-tighter absolute top-4 left-4 md:left-8 z-10 bg-stark-white px-3 py-1 border-2 border-black shadow-[4px_4px_0px_#000]">
          Execution Zone
        </h2>
        <div className="relative z-10">
          <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center">
            <h3 className="font-headline text-xl uppercase mb-2">Legacy Rental Contract</h3>
            <p className="font-display text-sm text-gray-600">
              This is a legacy rental contract. View details in the command zone.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Generic contract with template_id
  if (!address) {
    return (
      <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
        <div className="relative z-10">
          <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center">
            <h3 className="font-headline text-xl uppercase mb-2">Wallet Not Connected</h3>
            <p className="font-display text-sm text-gray-600">
              Please connect your wallet to interact with this contract.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Route to appropriate template-specific component
  const templateId = 'template_id' in contract ? contract.template_id : null;

  switch (templateId) {
    case 'RentVault':
      return <RentVaultExecutionZone contract={contract} userAddress={address} onSync={onSync} />;

    case 'GroupBuyEscrow':
      return <GroupBuyEscrowExecutionZone contract={contract} userAddress={address} onSync={onSync} />;

    case 'StableAllowanceTreasury':
      return <StableAllowanceTreasuryExecutionZone contract={contract} userAddress={address} onSync={onSync} />;

    default:
      return (
        <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
          <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
          <div className="relative z-10">
            <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center">
              <h3 className="font-headline text-xl uppercase mb-2">Unknown Template</h3>
              <p className="font-display text-sm text-gray-600">
                Template: {templateId || 'None'}
              </p>
            </div>
          </div>
        </div>
      );
  }
}
