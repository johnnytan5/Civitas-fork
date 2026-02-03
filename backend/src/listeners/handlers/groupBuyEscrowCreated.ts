import { createGenericContract } from '@/lib/supabase/generic-contracts'
import { syncGenericContract } from '@/services/blockchain/sync'
import { logger } from '@/utils/logger'

export async function handleGroupBuyEscrowCreated(log: any) {
  try {
    const cloneAddress = (log.args.clone as string).toLowerCase()
    const creator = (log.args.creator as string).toLowerCase()

    logger.info('New GroupBuyEscrow created', {
      cloneAddress,
      creator,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    })

    await createGenericContract({
      contract_address: cloneAddress,
      template_id: 'group_buy_escrow',
      creator_address: creator,
      config: {},
    })

    await syncGenericContract(cloneAddress as `0x${string}`)

    logger.info('GroupBuyEscrow stored and synced', { cloneAddress })
  } catch (error) {
    logger.error('Failed to handle GroupBuyEscrowCreated event', { error, log })
    throw error
  }
}
