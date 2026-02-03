import { getContractsByState } from '@/lib/supabase/contracts'
import { getGenericContractsByState } from '@/lib/supabase/generic-contracts'
import { syncContract, syncGenericContract } from '@/services/blockchain/sync'
import { logger } from '@/utils/logger'

/**
 * Sync all active and terminating contracts from blockchain
 * Handles both legacy rental_contracts and new contracts table
 * Runs every 5 minutes
 */
export async function syncContractsJob() {
  try {
    // ── Legacy rental contracts ──
    const [activeContracts, terminatingContracts] = await Promise.all([
      getContractsByState(1), // Active
      getContractsByState(3), // TerminationPending
    ])

    const legacyToSync = [...activeContracts, ...terminatingContracts]

    if (legacyToSync.length > 0) {
      logger.info(`Syncing ${legacyToSync.length} legacy rental contracts`)

      const legacyResults = await Promise.allSettled(
        legacyToSync.map((contract) =>
          syncContract(contract.contract_address as `0x${string}`)
        )
      )

      const succeeded = legacyResults.filter((r) => r.status === 'fulfilled').length
      const failed = legacyResults.filter((r) => r.status === 'rejected').length
      logger.info('Legacy sync complete', { succeeded, failed })

      legacyResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error('Legacy contract sync failed', {
            contractAddress: legacyToSync[index].contract_address,
            error: result.reason,
          })
        }
      })
    }

    // ── Generic multi-template contracts ──
    // Sync all non-terminal contracts (state 0 = deployed, not yet settled)
    // Each template may have different "active" states, so sync all non-final
    const genericContracts = await getGenericContractsByState(0)

    if (genericContracts.length > 0) {
      logger.info(`Syncing ${genericContracts.length} generic contracts`)

      const genericResults = await Promise.allSettled(
        genericContracts.map((contract) =>
          syncGenericContract(contract.contract_address as `0x${string}`)
        )
      )

      const succeeded = genericResults.filter((r) => r.status === 'fulfilled').length
      const failed = genericResults.filter((r) => r.status === 'rejected').length
      logger.info('Generic sync complete', { succeeded, failed })

      genericResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error('Generic contract sync failed', {
            contractAddress: genericContracts[index].contract_address,
            error: result.reason,
          })
        }
      })
    }
  } catch (error) {
    logger.error('Sync job failed catastrophically', { error })
  }
}
