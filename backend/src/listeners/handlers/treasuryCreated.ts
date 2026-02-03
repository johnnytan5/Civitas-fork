import { createGenericContract } from '@/lib/supabase/generic-contracts'
import { syncGenericContract } from '@/services/blockchain/sync'
import { logger } from '@/utils/logger'

export async function handleTreasuryCreated(log: any) {
  try {
    const cloneAddress = (log.args.clone as string).toLowerCase()
    const creator = (log.args.creator as string).toLowerCase()

    logger.info('New StableAllowanceTreasury created', {
      cloneAddress,
      creator,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    })

    await createGenericContract({
      contract_address: cloneAddress,
      template_id: 'stable_allowance_treasury',
      creator_address: creator,
      config: {},
    })

    await syncGenericContract(cloneAddress as `0x${string}`)

    logger.info('StableAllowanceTreasury stored and synced', { cloneAddress })
  } catch (error) {
    logger.error('Failed to handle TreasuryCreated event', { error, log })
    throw error
  }
}
