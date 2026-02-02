import { publicClient } from '@/config/blockchain'
import { env } from '@/config/environment'
import { RECURRING_RENT_ABI } from '@/lib/contracts/abis'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'
import { base } from 'viem/chains'
import type { Address } from 'viem'
import { logger } from '@/utils/logger'

/**
 * Trigger rent release for a contract
 * Requires KEEPER_PRIVATE_KEY to be set
 */
export async function triggerRentRelease(contractAddress: Address) {
  if (!env.KEEPER_PRIVATE_KEY) {
    logger.warn('KEEPER_PRIVATE_KEY not set, skipping rent release', {
      contractAddress,
    })
    return
  }

  try {
    const account = privateKeyToAccount(env.KEEPER_PRIVATE_KEY as `0x${string}`)

    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(env.BASE_RPC_URL),
    })

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi: RECURRING_RENT_ABI,
      functionName: 'releasePendingRent',
    })

    logger.info('Rent release transaction sent', {
      contractAddress,
      transactionHash: hash,
    })

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    logger.info('Rent release confirmed', {
      contractAddress,
      transactionHash: hash,
      status: receipt.status,
    })

    return receipt
  } catch (error) {
    logger.error('Failed to trigger rent release', {
      contractAddress,
      error,
    })
    throw error
  }
}
