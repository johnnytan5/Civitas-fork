import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { env } from './environment'

export const publicClient = createPublicClient({
  chain: base,
  transport: http(env.BASE_RPC_URL),
})
