'use client';

import { useNetworkMode } from '@/contexts/NetworkModeContext';
import HardShadowCard from '@/components/ui/HardShadowCard';

export default function NetworkModeToggle() {
    const { networkMode, toggleNetworkMode } = useNetworkMode();

    return (
        <HardShadowCard className="p-6">
            <div className="space-y-4">
                <div>
                    <h3 className="font-headline text-xl uppercase mb-2">Network Mode</h3>
                    <p className="font-display text-sm text-gray-600">
                        Switch between mainnet and testnet to view balances from different networks
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => networkMode === 'testnet' && toggleNetworkMode()}
                        className={`flex-1 px-4 py-3 font-display font-bold uppercase border-2 border-black transition-all ${networkMode === 'mainnet'
                                ? 'bg-acid-lime text-black shadow-[4px_4px_0px_#000]'
                                : 'bg-stark-white text-gray-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'
                            }`}
                        disabled={networkMode === 'mainnet'}
                    >
                        Mainnet
                    </button>

                    <button
                        onClick={() => networkMode === 'mainnet' && toggleNetworkMode()}
                        className={`flex-1 px-4 py-3 font-display font-bold uppercase border-2 border-black transition-all ${networkMode === 'testnet'
                                ? 'bg-hot-pink text-white shadow-[4px_4px_0px_#000]'
                                : 'bg-stark-white text-gray-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'
                            }`}
                        disabled={networkMode === 'testnet'}
                    >
                        Testnet
                    </button>
                </div>

                {/* Network Info */}
                <div className="pt-4 border-t-2 border-black">
                    <div className="space-y-2 font-display text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Network:</span>
                            <span className="font-bold uppercase">{networkMode}</span>
                        </div>
                        {networkMode === 'mainnet' ? (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chains:</span>
                                    <span className="font-bold">Base, Ethereum</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chains:</span>
                                    <span className="font-bold">Base Sepolia</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border-2 border-yellow-500 p-3">
                    <p className="font-display text-xs text-yellow-800">
                        ⚠️ Switching networks will refresh your balance data
                    </p>
                </div>
            </div>
        </HardShadowCard>
    );
}
