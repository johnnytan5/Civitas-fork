'use client';

import { useState } from 'react';
import { useSwitchChain, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Network, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NetworkSwitcher() {
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  const [isSwitching, setIsSwitching] = useState(false);

  const isOnBaseSepolia = currentChainId === baseSepolia.id;

  const handleSwitchNetwork = async () => {
    if (!switchChain || isOnBaseSepolia) return;

    try {
      setIsSwitching(true);
      await switchChain({ chainId: baseSepolia.id });
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <button
      onClick={handleSwitchNetwork}
      disabled={isOnBaseSepolia || isSwitching}
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-2
        px-4 py-2
        border-2 border-black
        shadow-[4px_4px_0px_#000]
        font-display font-bold text-sm uppercase
        transition-all
        ${
          isOnBaseSepolia
            ? 'bg-acid-lime text-void-black cursor-default'
            : 'bg-hot-pink text-stark-white hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer'
        }
        ${isSwitching ? 'opacity-50 cursor-wait' : ''}
      `}
    >
      {isOnBaseSepolia ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Base Sepolia</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4" />
          <span>{isSwitching ? 'Switching...' : 'Switch to Base Sepolia'}</span>
        </>
      )}
      <Network className="w-4 h-4" />
    </button>
  );
}
