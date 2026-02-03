import { publicClient } from '@/config/blockchain'
import { env } from '@/config/environment'
import { handleContractDeployed } from './handlers/contractDeployed'
import { handleRentVaultCreated } from './handlers/rentVaultCreated'
import { handleGroupBuyEscrowCreated } from './handlers/groupBuyEscrowCreated'
import { handleTreasuryCreated } from './handlers/treasuryCreated'
import { logger } from '@/utils/logger'

const POLL_INTERVAL_MS = 10_000
const LOOKBACK_BLOCKS = 2n

/**
 * Start legacy RentalFactory event listener using log polling.
 */
async function startLegacyFactoryListener() {
  try {
    let lastProcessedBlock = await publicClient.getBlockNumber()

    if (lastProcessedBlock > LOOKBACK_BLOCKS) {
      lastProcessedBlock -= LOOKBACK_BLOCKS
    }

    logger.info('Legacy factory event listener started (polling)', {
      fromBlock: lastProcessedBlock,
    })

    setInterval(async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber()

        if (latestBlock <= lastProcessedBlock) {
          return
        }

        const fromBlock = lastProcessedBlock + 1n
        const toBlock = latestBlock

        const logs = await publicClient.getLogs({
          address: env.FACTORY_ADDRESS,
          event: {
            type: 'event' as const,
            name: 'RentalDeployed',
            inputs: [
              { name: 'creator', type: 'address', indexed: true },
              { name: 'rental', type: 'address', indexed: true },
              { name: 'landlord', type: 'address', indexed: true },
              { name: 'tenant', type: 'address', indexed: false },
              { name: 'suggestedName', type: 'string', indexed: false },
            ],
          },
          fromBlock,
          toBlock,
        })

        if (logs.length > 0) {
          await Promise.allSettled(
            logs.map((log) =>
              handleContractDeployed(log).catch((error) => {
                logger.error('Error handling RentalDeployed event', {
                  error,
                  log,
                })
              })
            )
          )
        }

        lastProcessedBlock = latestBlock
      } catch (error) {
        logger.error('Event listener poll error - RentalDeployed', { error })
      }
    }, POLL_INTERVAL_MS)
  } catch (error) {
    logger.error('Failed to initialize legacy event listener', { error })
    throw error
  }
}

/**
 * Start CivitasFactory event listener.
 * Polls for all 3 creation events in a single loop.
 */
async function startCivitasFactoryListener() {
  try {
    let lastProcessedBlock = await publicClient.getBlockNumber()

    if (lastProcessedBlock > LOOKBACK_BLOCKS) {
      lastProcessedBlock -= LOOKBACK_BLOCKS
    }

    logger.info('CivitasFactory event listener started (polling)', {
      fromBlock: lastProcessedBlock,
      factoryAddress: env.CIVITAS_FACTORY_ADDRESS,
    })

    setInterval(async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber()

        if (latestBlock <= lastProcessedBlock) {
          return
        }

        const fromBlock = lastProcessedBlock + 1n
        const toBlock = latestBlock

        // Fetch all 3 event types in parallel
        const [rvLogs, gbLogs, trLogs] = await Promise.all([
          publicClient.getLogs({
            address: env.CIVITAS_FACTORY_ADDRESS,
            event: {
              type: 'event' as const,
              name: 'RentVaultCreated',
              inputs: [
                { name: 'creator', type: 'address', indexed: true },
                { name: 'clone', type: 'address', indexed: true },
                { name: 'recipient', type: 'address', indexed: true },
              ],
            },
            fromBlock,
            toBlock,
          }),
          publicClient.getLogs({
            address: env.CIVITAS_FACTORY_ADDRESS,
            event: {
              type: 'event' as const,
              name: 'GroupBuyEscrowCreated',
              inputs: [
                { name: 'creator', type: 'address', indexed: true },
                { name: 'clone', type: 'address', indexed: true },
                { name: 'recipient', type: 'address', indexed: true },
              ],
            },
            fromBlock,
            toBlock,
          }),
          publicClient.getLogs({
            address: env.CIVITAS_FACTORY_ADDRESS,
            event: {
              type: 'event' as const,
              name: 'TreasuryCreated',
              inputs: [
                { name: 'creator', type: 'address', indexed: true },
                { name: 'clone', type: 'address', indexed: true },
                { name: 'owner_', type: 'address', indexed: true },
              ],
            },
            fromBlock,
            toBlock,
          }),
        ])

        const handlers: Promise<void>[] = []

        for (const log of rvLogs) {
          handlers.push(handleRentVaultCreated(log).catch((error) => {
            logger.error('Error handling RentVaultCreated', { error, log })
          }) as Promise<void>)
        }
        for (const log of gbLogs) {
          handlers.push(handleGroupBuyEscrowCreated(log).catch((error) => {
            logger.error('Error handling GroupBuyEscrowCreated', { error, log })
          }) as Promise<void>)
        }
        for (const log of trLogs) {
          handlers.push(handleTreasuryCreated(log).catch((error) => {
            logger.error('Error handling TreasuryCreated', { error, log })
          }) as Promise<void>)
        }

        if (handlers.length > 0) {
          await Promise.allSettled(handlers)
        }

        lastProcessedBlock = latestBlock
      } catch (error) {
        logger.error('Event listener poll error - CivitasFactory', { error })
      }
    }, POLL_INTERVAL_MS)
  } catch (error) {
    logger.error('Failed to initialize CivitasFactory event listener', { error })
    throw error
  }
}

export function startEventListeners() {
  startLegacyFactoryListener()
  startCivitasFactoryListener()
}
