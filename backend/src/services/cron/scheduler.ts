import cron from 'node-cron'
import { syncContractsJob } from './jobs/syncContracts'
import { releaseRentJob } from './jobs/releaseRent'
import { logger } from '@/utils/logger'

export function startCronJobs() {
  // Every 5 minutes: sync all active/terminating contracts
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Starting contract sync job')
    await syncContractsJob()
  })

  // Every hour: trigger rent release for all active contracts
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting rent release job')
    await releaseRentJob()
  })

  logger.info('Cron jobs registered successfully')
}
