import { publicClient } from '@/config/blockchain'
import { RENTAL_FACTORY_ABI } from '@/lib/contracts/abis'
import { env } from '@/config/environment'
import { handleContractDeployed } from './handlers/contractDeployed'
import { logger } from '@/utils/logger'

const MAX_RETRIES = 5
const RETRY_DELAY = 5000 // 5 seconds

/**
 * Start factory event listener with automatic reconnection on failure
 */
function startFactoryListener(retries = 0) {
  try {
    const unwatch = publicClient.watchContractEvent({
      address: env.FACTORY_ADDRESS,
      abi: RENTAL_FACTORY_ABI,
      eventName: 'RentalDeployed',
      onLogs: (logs) => {
        logs.forEach((log) => {
          handleContractDeployed(log).catch((error) => {
            logger.error('Error handling RentalDeployed event', {
              error,
              log,
            })
          })
        })
      },
      onError: (error) => {
        logger.error('Event listener error - RentalDeployed', {
          error,
          retries,
        })

        // Attempt reconnection with exponential backoff
        if (retries < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(2, retries) // Exponential backoff
          setTimeout(() => {
            logger.info(`Reconnecting listener`, {
              attempt: retries + 1,
              maxRetries: MAX_RETRIES,
            })
            unwatch() // Clean up old listener
            startFactoryListener(retries + 1)
          }, delay)
        } else {
          logger.error('Max retries reached, listener stopped permanently')
        }
      },
    })

    logger.info('Factory event listener started successfully')
  } catch (error) {
    logger.error('Failed to initialize event listener', { error })
    throw error // Fail fast on startup
  }
}

export function startEventListeners() {
  startFactoryListener()
}
