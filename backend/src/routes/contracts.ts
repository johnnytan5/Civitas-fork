import { Router, Request, Response } from 'express'
import { syncContract } from '@/services/blockchain/sync'
import { asyncHandler } from '@/utils/asyncHandler'
import { ValidationError } from '@/utils/errors'
import { logger } from '@/utils/logger'
import type { Address } from 'viem'

const router: Router = Router()

/**
 * POST /api/contracts/sync
 * Manually trigger contract sync from blockchain to Supabase
 */
router.post('/sync', asyncHandler(async (req: Request, res: Response) => {
  const { contractAddress } = req.body

  if (!contractAddress) {
    throw new ValidationError('Contract address required')
  }

  logger.info('Manual contract sync requested', { contractAddress })

  const contract = await syncContract(contractAddress as Address)

  res.json({ contract })
}))

export default router
