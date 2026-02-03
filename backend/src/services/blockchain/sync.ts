import { readTemplateContractState } from './template-reader'
import { getContractByAddress, updateGenericContract } from '@/lib/supabase/generic-contracts'
import type { Address } from 'viem'

/**
 * Sync a generic (multi-template) contract from the `contracts` table.
 * Reads on-chain state based on template_id and updates on_chain_state JSONB.
 */
export async function syncGenericContract(contractAddress: Address) {
  const contract = await getContractByAddress(contractAddress)
  if (!contract) {
    throw new Error(`Contract not found in database: ${contractAddress}`)
  }

  const onChainState = await readTemplateContractState(contractAddress, contract.template_id)

  const updated = await updateGenericContract(contractAddress, {
    on_chain_state: onChainState as any,
  })

  return updated
}
