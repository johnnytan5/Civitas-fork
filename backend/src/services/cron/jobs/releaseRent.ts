import { getContractsByState } from '@/lib/supabase/contracts'
import { triggerRentRelease } from '@/services/blockchain/writer'
import { logger } from '@/utils/logger'

/**
 * Trigger rent release for all active contracts
 * Runs hourly
 */
export async function releaseRentJob() {
  try {
    const activeContracts = await getContractsByState(1) // Active state

    logger.info(`Checking ${activeContracts.length} active contracts for rent release`)

    const results = await Promise.allSettled(
      activeContracts.map((contract) =>
        triggerRentRelease(contract.contract_address as `0x${string}`)
      )
    )

    const succeeded = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    logger.info(`Rent release job complete`, { succeeded, failed })

    // Log failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error('Rent release failed', {
          contractAddress: activeContracts[index].contract_address,
          error: result.reason,
        })
      }
    })
  } catch (error) {
    logger.error('Rent release job failed catastrophically', { error })
  }
}
