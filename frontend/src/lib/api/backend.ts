const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export class BackendError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message)
  }
}

/**
 * Sync contract from blockchain to Supabase via backend
 */
export async function syncContract(contractAddress: string) {
  const response = await fetch(`${BACKEND_URL}/api/contracts/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractAddress }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new BackendError(
      errorData.error || 'Failed to sync contract',
      response.status,
      errorData
    )
  }

  return response.json()
}
