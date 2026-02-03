import { publicClient } from '@/config/blockchain'
import { getTemplate } from '@/config/templates'
import type { Address } from 'viem'
/**
 * Read on-chain state for any template type.
 * Uses the template registry to determine which fields to read.
 */
export async function readTemplateContractState(
  contractAddress: Address,
  templateId: string
): Promise<Record<string, unknown>> {
  const template = getTemplate(templateId)
  if (!template) {
    throw new Error(`Unknown template: ${templateId}`)
  }

  const results = await Promise.all(
    template.stateFields.map((field) =>
      publicClient.readContract({
        address: contractAddress,
        abi: template.abi as any,
        functionName: field,
      }).then((value) => ({ field, value }))
       .catch(() => ({ field, value: null }))
    )
  )

  const state: Record<string, unknown> = {}
  for (const { field, value } of results) {
    // Convert BigInt to string for JSON serialization
    if (typeof value === 'bigint') {
      state[field] = value.toString()
    } else {
      state[field] = value
    }
  }

  return state
}
