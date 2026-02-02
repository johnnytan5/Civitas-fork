import { createClient } from './server'
import type { Database } from './types'

type User = Database['public']['Tables']['users']['Row']
type UserInsert = Database['public']['Tables']['users']['Insert']
type UserUpdate = Database['public']['Tables']['users']['Update']

/**
 * Get or create user by wallet address
 */
export async function getOrCreateUser(walletAddress: string, ensName?: string): Promise<User> {
  const supabase = await createClient()

  // Try to fetch existing user
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (existingUser) {
    // Update ENS name if provided and different
    if (ensName && existingUser.ens_name !== ensName) {
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ ens_name: ensName })
        .eq('wallet_address', walletAddress)
        .select()
        .single()

      return updatedUser || existingUser
    }
    return existingUser
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      wallet_address: walletAddress,
      ens_name: ensName,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }

  return newUser
}

/**
 * Update user ENS name
 */
export async function updateUserEnsName(walletAddress: string, ensName: string): Promise<User> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .update({ ens_name: ensName })
    .eq('wallet_address', walletAddress)
    .select()
    .single()

  if (error) {
    console.error('Error updating user ENS name:', error)
    throw new Error('Failed to update user')
  }

  return data
}

/**
 * Get user by wallet address
 */
export async function getUserByAddress(walletAddress: string): Promise<User | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

/**
 * Create user-contract relationship
 */
export async function createUserContractRelation(
  userAddress: string,
  contractAddress: string,
  role: 'landlord' | 'tenant'
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('user_contracts')
    .insert({
      user_address: userAddress,
      contract_address: contractAddress,
      role,
    })

  if (error) {
    console.error('Error creating user-contract relation:', error)
    throw new Error('Failed to create relationship')
  }
}
