import { createServiceClient } from './server'
import type { Database } from './types'

type RentalContract = Database['public']['Tables']['rental_contracts']['Row']
type RentalContractInsert = Database['public']['Tables']['rental_contracts']['Insert']
type RentalContractUpdate = Database['public']['Tables']['rental_contracts']['Update']

/**
 * Fetch all contracts for a given user (as landlord or tenant)
 */
export async function getUserContracts(userAddress: string): Promise<RentalContract[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .or(`landlord_address.eq.${userAddress},tenant_address.eq.${userAddress}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error fetching user contracts:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to fetch contracts: ${error.message}`, { cause: error })
  }

  return data || []
}

/**
 * Fetch a single contract by address
 */
export async function getContractByAddress(contractAddress: string): Promise<RentalContract | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .eq('contract_address', contractAddress)
    .single()

  if (error) {
    console.error('Supabase error fetching contract:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    return null
  }

  return data
}

/**
 * Create a new contract record (called after deployment)
 */
export async function createContract(contract: RentalContractInsert): Promise<RentalContract> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .insert(contract)
    .select()
    .single()

  if (error) {
    console.error('Supabase error creating contract:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to create contract: ${error.message}`, { cause: error })
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
  const supabase = createServiceClient()

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
    console.error('Supabase error updating contract:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to update contract: ${error.message}`, { cause: error })
  }

  return data
}

/**
 * Get contracts by state
 */
export async function getContractsByState(state: number): Promise<RentalContract[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .eq('state', state)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error fetching contracts by state:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to fetch contracts: ${error.message}`, { cause: error })
  }

  return data || []
}

/**
 * Search contracts by basename
 */
export async function searchContractsByBasename(query: string): Promise<RentalContract[]> {
  const supabase = createServiceClient()

  // Sanitize query to escape LIKE wildcards
  const sanitizedQuery = query.replace(/[%_]/g, '\\$&')

  const { data, error } = await supabase
    .from('rental_contracts')
    .select('*')
    .ilike('basename', `%${sanitizedQuery}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error searching contracts:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to search contracts: ${error.message}`, { cause: error })
  }

  return data || []
}
