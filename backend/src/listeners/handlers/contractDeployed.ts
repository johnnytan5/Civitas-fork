import { syncContract } from '@/services/blockchain/sync'
import { logger } from '@/utils/logger'

/**
 * Handle RentalDeployed event from factory
 * Immediately syncs new contract to Supabase
 */
export async function handleContractDeployed(log: any) {
  try {
    // Extract contract address from event args
    const contractAddress = log.args.rental as `0x${string}`
    const creator = log.args.creator as `0x${string}`

    logger.info('New rental contract deployed', {
      contractAddress,
      creator,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    })

    // Sync immediately to Supabase
    await syncContract(contractAddress)

    logger.info('Contract synced successfully', { contractAddress })
  } catch (error) {
    logger.error('Failed to handle RentalDeployed event', {
      error,
      log,
    })
    throw error
  }
}
