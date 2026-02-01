import { fetchUserContracts } from '@/lib/contracts/fetch-contracts';
import { DashboardContractCard } from '@/components/dashboard/DashboardContractCard';

export default async function DashboardPage() {
  // In a real app, get user address from auth/session
  // For now, using placeholder - will be replaced with actual user address
  const userAddress = '0x0000000000000000000000000000000000000000' as `0x${string}`;

  let contracts = [];
  try {
    contracts = await fetchUserContracts(userAddress);
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your rental agreements
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <p className="text-sm text-zinc-500">Total Contracts</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{contracts.length}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <p className="text-sm text-zinc-500">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {contracts.filter((c) => c.state === 1).length}
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <p className="text-sm text-zinc-500">Completed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {contracts.filter((c) => c.state === 2).length}
            </p>
          </div>
        </div>

        {/* Contracts Grid */}
        {contracts.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
            <p className="text-zinc-500 mb-4">No rental agreements yet</p>
            <a
              href="/create"
              className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
            >
              Create Your First Agreement
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <DashboardContractCard key={contract.address} contract={contract} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
