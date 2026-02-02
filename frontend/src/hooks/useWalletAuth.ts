'use client'

import { useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'

/**
 * Hook that registers users in Supabase when they connect their wallet.
 * Should be used once at the app level (e.g., in Web3Provider or layout).
 */
export function useWalletAuth() {
  const { address, isConnected } = useAccount()
  const previousAddressRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    // Only register when:
    // 1. Wallet is connected
    // 2. We have an address
    // 3. Address is different from previous (new connection or account switch)
    if (isConnected && address && address !== previousAddressRef.current) {
      previousAddressRef.current = address

      const registerUser = async () => {
        try {
          const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address }),
          })

          if (!response.ok) {
            const error = await response.json()
            console.error('Failed to register user:', error)
            return
          }

          const { user } = await response.json()
          console.log('User registered/retrieved:', user.wallet_address)
        } catch (error) {
          console.error('Error registering user:', error)
        }
      }

      registerUser()
    }

    // Clear previous address when disconnected
    if (!isConnected) {
      previousAddressRef.current = undefined
    }
  }, [address, isConnected])
}
