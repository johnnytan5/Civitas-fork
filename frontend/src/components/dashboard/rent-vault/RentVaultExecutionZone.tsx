'use client';

import type { AllContracts } from '@/app/dashboard/page';
import TenantView from './TenantView';
import LandlordView from './LandlordView';

interface RentVaultExecutionZoneProps {
  contract: AllContracts;
  userAddress: `0x${string}`;
  onSync?: () => void;
}

export default function RentVaultExecutionZone({ contract, userAddress, onSync }: RentVaultExecutionZoneProps) {
  // Determine user role from contract config
  const config = contract.config || {};
  const recipient = config.recipient?.toLowerCase();
  const tenants = config.tenants || [];

  const isLandlord = recipient === userAddress.toLowerCase();
  const isTenant = tenants.some((t: string) => t.toLowerCase() === userAddress.toLowerCase());

  if (isLandlord) {
    return <LandlordView contract={contract} userAddress={userAddress} onSync={onSync} />;
  }

  if (isTenant) {
    return <TenantView contract={contract} userAddress={userAddress} onSync={onSync} />;
  }

  // User has no role in this contract
  return (
    <div className="w-full md:flex-1 bg-paper-cream h-full flex flex-col items-center justify-center p-8 relative overflow-y-auto">
      <div className="absolute inset-0 pattern-grid pointer-events-none z-0"></div>
      <div className="relative z-10">
        <div className="bg-stark-white border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center">
          <h3 className="font-headline text-xl uppercase mb-2">Not Authorized</h3>
          <p className="font-display text-sm text-gray-600">
            You are not a participant in this RentVault contract.
          </p>
        </div>
      </div>
    </div>
  );
}
