'use client';

import { Sparkles } from 'lucide-react';
import type { Route } from '@/lib/funding/routing';

interface RecommendedRouteCardProps {
  route: Route;
  amount: string;
  onExecute: () => void;
  onSeeAlternatives: () => void;
}

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  10: 'Optimism',
  137: 'Polygon',
};

export default function RecommendedRouteCard({
  route,
  amount,
  onExecute,
  onSeeAlternatives,
}: RecommendedRouteCardProps) {
  const chainName = CHAIN_NAMES[route.sourceChainId] || `Chain ${route.sourceChainId}`;
  const estimatedMinutes = Math.round(route.executionDuration / 60);
  const gasCost = parseFloat(route.gasCostUsd).toFixed(2);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* AI Recommended Badge */}
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#CCFF00] fill-current stroke-black" />
        <span className="font-headline text-sm uppercase bg-[#CCFF00] border-[2px] border-black px-2 py-0.5">
          AI Recommended
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_#000] hover:shadow-[10px_10px_0px_#000] transition-shadow p-6 mb-4">
        {/* Route Details */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Source</p>
              <p className="font-headline text-xl">
                {chainName} · {route.sourceToken}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 uppercase mb-1">Amount</p>
              <p className="font-mono text-xl font-bold">{amount} USDC</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t-[2px] border-gray-200">
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Gas Cost</p>
              <p className="font-mono text-sm font-bold">${gasCost}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Time</p>
              <p className="font-mono text-sm font-bold">~{estimatedMinutes}m</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase mb-1">Via</p>
              <p className="font-mono text-sm font-bold truncate">{route.tool}</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onExecute}
          className="w-full bg-black text-white font-mono uppercase py-4 border-[3px] border-black hover:scale-[1.02] hover:shadow-[6px_6px_0px_#CCFF00] transition-all duration-200"
        >
          Use This Route →
        </button>
      </div>

      {/* See Alternatives Link */}
      <div className="text-center">
        <button
          onClick={onSeeAlternatives}
          className="text-sm text-gray-600 hover:text-black underline transition-colors"
        >
          See alternatives
        </button>
      </div>
    </div>
  );
}
