import { getContractsByState } from '@/lib/supabase/contracts'
import { syncContract } from '@/services/blockchain/sync'
import { logger } from '@/utils/logger'

/**
 * Sync all active and terminating contracts from blockchain
 * Runs every 5 minutes
 */
export async function syncContractsJob() {
  try {
    // Fetch contracts that need regular syncing
    const [activeContracts, terminatingContracts] = await Promise.all([
      getContractsByState(1), // Active
      getContractsByState(3), // TerminationPending
    ])

    const contractsToSync = [...activeContracts, ...terminatingContracts]

    logger.info(`Syncing ${contractsToSync.length} contracts`)

    // Sync each contract (parallel execution)
    const results = await Promise.allSettled(
      contractsToSync.map((contract) =>
        syncContract(contract.contract_address as `0x${string}`)
      )
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    logger.info(`Sync job complete`, { succeeded, failed })

    // Log failures in detail
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error('Contract sync failed', {
          contractAddress: contractsToSync[index].contract_address,
          error: result.reason,
        })
      }
    })
  } catch (error) {
    logger.error('Sync job failed catastrophically', { error })
  }
}
