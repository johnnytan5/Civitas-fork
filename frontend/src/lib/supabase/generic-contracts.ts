import { createServiceClient } from './server'
import type { Database } from './types'

type Contract = Database['public']['Tables']['contracts']['Row']
type ContractInsert = Database['public']['Tables']['contracts']['Insert']
type ContractUpdate = Database['public']['Tables']['contracts']['Update']

export async function getContractByAddress(contractAddress: string): Promise<Contract | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('contract_address', contractAddress)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    throw new Error(`Failed to fetch contract: ${error.message}`, { cause: error })
  }

  return data
}

export async function getUserContracts(userAddress: string): Promise<Contract[]> {
  const supabase = createServiceClient()

  // Normalize address to lowercase for comparison
  const normalizedAddress = userAddress.toLowerCase()

  // Query contracts where user is a participant
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      contract_participants!inner(user_address, role, share_bps)
    `)
    .eq('contract_participants.user_address', normalizedAddress)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch user contracts: ${error.message}`, { cause: error })
  }

  return data || []
}

export async function createGenericContract(contract: ContractInsert): Promise<Contract> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('contracts')
    .insert(contract)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create contract: ${error.message}`, { cause: error })
  }

  // Add participants to the junction table
  await addContractParticipants(data.id, contract.config, contract.template_id)

  return data
}

/**
 * Add all participants for a contract to the contract_participants table
 */
async function addContractParticipants(
  contractId: string,
  config: any,
  templateId: string
): Promise<void> {
  const supabase = createServiceClient()
  const participants: Array<{
    contract_id: string
    user_address: string
    role: string
    share_bps?: number
  }> = []

  // Add creator
  if (config.creator) {
    participants.push({
      contract_id: contractId,
      user_address: config.creator.toLowerCase(),
      role: 'creator',
    })
  }

  // Add template-specific participants
  switch (templateId) {
    case 'RentVault':
      // Add recipient (landlord)
      if (config.recipient) {
        participants.push({
          contract_id: contractId,
          user_address: config.recipient.toLowerCase(),
          role: 'recipient',
        })
      }

      // Add all tenants with their shares
      if (config.tenants && Array.isArray(config.tenants)) {
        config.tenants.forEach((tenant: string, index: number) => {
          participants.push({
            contract_id: contractId,
            user_address: tenant.toLowerCase(),
            role: 'tenant',
            share_bps: config.shareBps?.[index],
          })
        })
      }
      break

    case 'GroupBuyEscrow':
      // Add recipient (purchaser)
      if (config.recipient) {
        participants.push({
          contract_id: contractId,
          user_address: config.recipient.toLowerCase(),
          role: 'recipient',
        })
      }

      // Add all participants with their shares
      if (config.participants && Array.isArray(config.participants)) {
        config.participants.forEach((participant: string, index: number) => {
          participants.push({
            contract_id: contractId,
            user_address: participant.toLowerCase(),
            role: 'participant',
            share_bps: config.shareBps?.[index],
          })
        })
      }
      break

    case 'StableAllowanceTreasury':
      // Add owner
      if (config.owner) {
        participants.push({
          contract_id: contractId,
          user_address: config.owner.toLowerCase(),
          role: 'owner',
        })
      }

      // Add recipient (beneficiary)
      if (config.recipient) {
        participants.push({
          contract_id: contractId,
          user_address: config.recipient.toLowerCase(),
          role: 'recipient',
        })
      }
      break
  }

  // Insert all participants
  if (participants.length > 0) {
    const { error } = await supabase.from('contract_participants').insert(participants)

    if (error) {
      console.error('Failed to add contract participants:', error)
      // Don't throw - contract is already created, this is supplementary data
    }
  }
}

export async function updateGenericContract(
  contractAddress: string,
  updates: ContractUpdate
): Promise<Contract> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('contracts')
    .update({
      ...updates,
      last_synced_at: new Date().toISOString(),
    })
    .eq('contract_address', contractAddress)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update contract: ${error.message}`, { cause: error })
  }

  return data
}

export async function getContractsByTemplateAndState(
  templateId: string,
  state: number
): Promise<Contract[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('template_id', templateId)
    .eq('state', state)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch contracts: ${error.message}`, { cause: error })
  }

  return data || []
}

export async function getGenericContractsByState(state: number): Promise<Contract[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('state', state)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch contracts by state: ${error.message}`, { cause: error })
  }

  return data || []
}
