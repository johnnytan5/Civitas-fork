'use client'

import { useState } from 'react'

export function useContractSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncContract = async (contractAddress: string) => {
    setIsSyncing(true)
    setError(null)

    try {
      const response = await fetch('/api/contracts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress }),
      })

      if (!response.ok) {
        throw new Error('Sync failed')
      }

      const data = await response.json()
      return data.contract
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setIsSyncing(false)
    }
  }

  return {
    syncContract,
    isSyncing,
    error,
  }
}
