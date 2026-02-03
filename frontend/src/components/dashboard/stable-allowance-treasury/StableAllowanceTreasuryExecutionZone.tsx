'use client';

import type { AllContracts } from '@/app/dashboard/page';
import OwnerView from './OwnerView';
import RecipientView from './RecipientView';

interface StableAllowanceTreasuryExecutionZoneProps {
  contract: AllContracts;
  userAddress: `0x${string}`;
  onSync?: () => void;
}

export default function StableAllowanceTreasuryExecutionZone({ contract, userAddress, onSync }: StableAllowanceTreasuryExecutionZoneProps) {
  // Determine user role from contract config
  const config = contract.config || {};
  const owner = config.owner?.toLowerCase();
  const recipient = config.recipient?.toLowerCase();

  const isOwner = owner === userAddress.toLowerCase();
  const isRecipient = recipient === userAddress.toLowerCase();

  if (isOwner) {
    return <OwnerView contract={contract} userAddress={userAddress} onSync={onSync} />;
  }

  if (isRecipient) {
    return <RecipientView contract={contract} userAddress={userAddress} onSync={onSync} />;
  }

  // User has no role in this contract
  return (
    <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
      <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
      <div className="relative z-10">
        <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center">
          <h3 className="font-headline text-xl uppercase mb-2">Not Authorized</h3>
          <p className="font-display text-sm text-gray-600">
            You are not a participant in this StableAllowanceTreasury contract.
          </p>
        </div>
      </div>
    </div>
  );
}
