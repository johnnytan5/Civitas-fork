import { createClient } from './server'
import type { Database } from './types'

type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']

/**
 * Create a new chat session
 */
export async function createChatSession(userAddress: string): Promise<ChatSession> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_address: userAddress })
    .select()
    .single()

  if (error) {
    console.error('Error creating chat session:', error)
    throw new Error('Failed to create chat session')
  }

  return data
}

/**
 * Link a chat session to a deployed contract
 */
export async function linkSessionToContract(
  sessionId: string,
  contractAddress: string
): Promise<ChatSession> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_sessions')
    .update({ contract_address: contractAddress })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) {
    console.error('Error linking session to contract:', error)
    throw new Error('Failed to link session')
  }

  return data
}

/**
 * Get chat session by ID
 */
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) {
    console.error('Error fetching chat session:', error)
    return null
  }

  return data
}

/**
 * Get all chat sessions for a user
 */
export async function getUserChatSessions(userAddress: string): Promise<ChatSession[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_address', userAddress)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user chat sessions:', error)
    throw new Error('Failed to fetch chat sessions')
  }

  return data || []
}

/**
 * Add message to chat session
 */
export async function addChatMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<ChatMessage> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding chat message:', error)
    throw new Error('Failed to add message')
  }

  return data
}

/**
 * Get all messages for a chat session
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching session messages:', error)
    throw new Error('Failed to fetch messages')
  }

  return data || []
}

/**
 * Bulk insert messages for a chat session
 */
export async function addChatMessages(messages: ChatMessageInsert[]): Promise<ChatMessage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('chat_messages')
    .insert(messages)
    .select()

  if (error) {
    console.error('Error adding chat messages:', error)
    throw new Error('Failed to add messages')
  }

  return data || []
}
