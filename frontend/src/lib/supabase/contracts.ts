import { createClient } from './server'
import type { Database } from './types'

type RentalContract = Database['public']['Tables']['rental_contracts']['Row']
type RentalContractInsert = Database['public']['Tables']['rental_contracts']['Insert']
type RentalContractUpdate = Database['public']['Tables']['rental_contracts']['Update']

/**
 * Fetch all contracts for a given user (as landlord or tenant)
 */
export async function getUserContracts(userAddress: string): Promise<RentalContract[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .or(`landlord_address.eq.${userAddress},tenant_address.eq.${userAddress}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user contracts:', error)
    throw new Error('Failed to fetch contracts')
  }

  return data || []
}

/**
 * Fetch a single contract by address
 */
export async function getContractByAddress(contractAddress: string): Promise<RentalContract | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .eq('contract_address', contractAddress)
    .single()

  if (error) {
    console.error('Error fetching contract:', error)
    return null
  }

  return data
}

/**
 * Create a new contract record (called after deployment)
 */
export async function createContract(contract: RentalContractInsert): Promise<RentalContract> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .insert(contract)
    .select()
    .single()

  if (error) {
    console.error('Error creating contract:', error)
    throw new Error('Failed to create contract')
  }

  return data
}

/**
 * Update contract state (called when syncing with blockchain)
 */
export async function updateContract(
  contractAddress: string,
  updates: RentalContractUpdate
): Promise<RentalContract> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .update({
      ...updates,
      last_synced_at: new Date().toISOString(),
    })
    .eq('contract_address', contractAddress)
    .select()
    .single()

  if (error) {
    console.error('Error updating contract:', error)
    throw new Error('Failed to update contract')
  }

  return data
}

/**
 * Get contracts by state
 */
export async function getContractsByState(state: number): Promise<RentalContract[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .eq('state', state)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contracts by state:', error)
    throw new Error('Failed to fetch contracts')
  }

  return data || []
}

/**
 * Search contracts by basename
 */
export async function searchContractsByBasename(query: string): Promise<RentalContract[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .ilike('basename', `%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching contracts:', error)
    throw new Error('Failed to search contracts')
  }

  return data || []
}
