import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

// Use test environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseTest = createClient<Database>(supabaseUrl, supabaseKey)

// Test data generators
export function generateTestWalletAddress(): string {
  return `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
}

export function generateTestContractAddress(): string {
  return `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
}

// Cleanup helper
export async function cleanupTestData(walletAddress: string) {
  await supabaseTest.from('users').delete().eq('wallet_address', walletAddress)
}
