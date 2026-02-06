'use client';

import { ChevronUp } from 'lucide-react';
import { RouteComparisonCard } from '@/components/deploy/RouteComparisonCard';

interface AlternativesSectionProps {
  routes: any[];
  recommendedIndex: number;
  requiredAmount: string;
  onSelectRoute: (route: any) => void;
  onCollapse: () => void;
}

export default function AlternativesSection({
  routes,
  recommendedIndex,
  requiredAmount,
  onSelectRoute,
  onCollapse,
}: AlternativesSectionProps) {
  return (
    <div className="animate-in slide-in-from-bottom-6 duration-200 mt-6">
      {/* Semi-transparent Backdrop */}
      <div className="bg-gray-50 border-[3px] border-black p-6 shadow-[8px_8px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-lg uppercase">All Routes</h3>
          <button
            onClick={onCollapse}
            className="p-2 hover:bg-black hover:text-white transition-colors border-[2px] border-black"
            aria-label="Collapse alternatives"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>

        {/* Route Comparison Card */}
        <RouteComparisonCard
          routes={routes}
          recommendedIndex={recommendedIndex}
          requiredAmount={requiredAmount}
          onSelectRoute={onSelectRoute}
        />

        {/* Back to Recommended Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onCollapse}
            className="text-sm text-gray-600 hover:text-black underline transition-colors"
          >
            ← Back to recommended
          </button>
        </div>
      </div>
    </div>
  );
}
