import { syncContractFromBlockchain } from '@/lib/supabase/sync'
import { readContractState } from './reader'
import { readTemplateContractState } from './template-reader'
import { getContractByAddress, updateGenericContract } from '@/lib/supabase/generic-contracts'
import type { Address } from 'viem'

/**
 * Sync a legacy rental contract by reading from blockchain and updating Supabase
 */
export async function syncContract(contractAddress: Address) {
  const blockchainData = await readContractState(contractAddress)

  const contract = await syncContractFromBlockchain(contractAddress, {
    landlord: blockchainData.landlord,
    tenant: blockchainData.tenant,
    monthlyAmount: blockchainData.monthlyAmount,
    totalMonths: blockchainData.totalMonths,
    startTimestamp: blockchainData.startTime,
    state: blockchainData.state,
    terminationInitiatedAt: blockchainData.terminationNoticeTime,
  })

  return contract
}

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
