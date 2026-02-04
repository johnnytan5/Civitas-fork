interface EventTypeBadgeProps {
  eventType: string;
}

const EVENT_COLORS: Record<string, string> = {
  // New types
  deployment: 'bg-acid-lime text-black',
  deposit: 'bg-green-400 text-black',
  withdrawal: 'bg-red-400 text-black',
  refund: 'bg-indigo-400 text-white',
  claim: 'bg-warning-yellow text-black',
  goal_reached: 'bg-void-black text-acid-lime',
  funds_released: 'bg-blue-400 text-black',

  // Legacy/Fallback types
  created: 'bg-acid-lime text-black',
  activated: 'bg-hot-pink text-white',
  rent_released: 'bg-warning-yellow text-black',
  termination_initiated: 'bg-void-black text-white',
  terminated: 'bg-gray-400 text-black',
  completed: 'bg-green-500 text-white',
};

const EVENT_LABELS: Record<string, string> = {
  // New types
  deployment: 'DEPLOYED',
  deposit: 'DEPOSIT',
  withdrawal: 'WITHDRAWAL',
  refund: 'REFUND',
  claim: 'CLAIMED',
  goal_reached: 'GOAL MET',
  funds_released: 'RELEASED',

  // Legacy/Fallback types
  created: 'DEPLOYED',
  activated: 'ACTIVATED',
  rent_released: 'RENT PAID',
  termination_initiated: 'TERMINATING',
  terminated: 'TERMINATED',
  completed: 'COMPLETED',
};

export default function EventTypeBadge({ eventType }: EventTypeBadgeProps) {
  const colorClass = EVENT_COLORS[eventType] || 'bg-gray-200 text-black';
  const label = EVENT_LABELS[eventType] || eventType.replace('_', ' ').toUpperCase();

  return (
    <span
      className={`${colorClass} px-3 py-1 text-xs font-headline uppercase border-2 border-black inline-block`}
    >
      {label}
    </span>
  );
}
