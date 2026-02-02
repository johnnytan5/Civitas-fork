import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateUser } from '@/lib/supabase/users'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, ensName } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      )
    }

    const user = await getOrCreateUser(walletAddress, ensName)

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}
