import { createGenericContract } from '@/lib/supabase/generic-contracts'
import { syncGenericContract } from '@/services/blockchain/sync'
import { logger } from '@/utils/logger'

export async function handleRentVaultCreated(log: any) {
  try {
    const cloneAddress = (log.args.clone as string).toLowerCase()
    const creator = (log.args.creator as string).toLowerCase()

    logger.info('New RentVault created', {
      cloneAddress,
      creator,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    })

    await createGenericContract({
      contract_address: cloneAddress,
      template_id: 'rent_vault',
      creator_address: creator,
      config: {},
    })

    await syncGenericContract(cloneAddress as `0x${string}`)

    logger.info('RentVault stored and synced', { cloneAddress })
  } catch (error) {
    logger.error('Failed to handle RentVaultCreated event', { error, log })
    throw error
  }
}
