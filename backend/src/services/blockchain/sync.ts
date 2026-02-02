import { syncContractFromBlockchain } from '@/lib/supabase/sync'
import { readContractState } from './reader'
import type { Address } from 'viem'

/**
 * Sync a contract by reading from blockchain and updating Supabase
 */
export async function syncContract(contractAddress: Address) {
  // Read current state from blockchain
  const blockchainData = await readContractState(contractAddress)

  // Sync to Supabase
  const contract = await syncContractFromBlockchain(contractAddress, {
    landlord: blockchainData.landlord,
    tenant: blockchainData.tenant,
    monthlyAmount: blockchainData.monthlyAmount,
    totalMonths: blockchainData.totalMonths,
    startTimestamp: blockchainData.startTime,
    state: blockchainData.state,
    terminationInitiatedAt: blockchainData.terminationNoticeTime,
  })

  return contract
}
