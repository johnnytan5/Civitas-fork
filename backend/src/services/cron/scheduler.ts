import cron from 'node-cron'
import { syncContractsJob } from './jobs/syncContracts'
import { logger } from '@/utils/logger'

export function startCronJobs() {
  // Every 5 minutes: sync all active contracts
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Starting contract sync job')
    await syncContractsJob()
  })

  logger.info('Cron jobs registered successfully')
}
