'use client'

import { createClient } from './client'
import type { Database } from './types'

type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']

/**
 * Client-side chat functions
 * Use these from browser components (client components)
 * Note: These use anon key and rely on RLS policies
 */

/**
 * Get chat session by ID (client-side)
 */
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) {
    console.error('Supabase error fetching chat session:', {
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
 * Get all messages for a chat session (client-side)
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Supabase error fetching session messages:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to fetch messages: ${error.message}`, { cause: error })
  }

  return data || []
}

/**
 * Get all chat sessions for a user (client-side)
 */
export async function getUserChatSessions(userAddress: string): Promise<ChatSession[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_address', userAddress)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error fetching user chat sessions:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`Failed to fetch chat sessions: ${error.message}`, { cause: error })
  }

  return data || []
}
