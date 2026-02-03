'use client';

import type { AllContracts } from '@/app/dashboard/page';
import ParticipantView from './ParticipantView';
import PurchaserView from './PurchaserView';

interface GroupBuyEscrowExecutionZoneProps {
  contract: AllContracts;
  userAddress: `0x${string}`;
  onSync?: () => void;
}

export default function GroupBuyEscrowExecutionZone({ contract, userAddress, onSync }: GroupBuyEscrowExecutionZoneProps) {
  // Determine user role from contract config
  const config = contract.config || {};
  const recipient = config.recipient?.toLowerCase();
  const participants = config.participants || [];

  const isPurchaser = recipient === userAddress.toLowerCase();
  const isParticipant = participants.some((p: string) => p.toLowerCase() === userAddress.toLowerCase());

  if (isPurchaser) {
    return <PurchaserView contract={contract} userAddress={userAddress} onSync={onSync} />;
  }

  if (isParticipant) {
    return <ParticipantView contract={contract} userAddress={userAddress} onSync={onSync} />;
  }

  // User has no role in this contract
  return (
    <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
      <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
      <div className="relative z-10">
        <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center">
          <h3 className="font-headline text-xl uppercase mb-2">Not Authorized</h3>
          <p className="font-display text-sm text-gray-600">
            You are not a participant in this GroupBuyEscrow contract.
          </p>
        </div>
      </div>
    </div>
  );
}
