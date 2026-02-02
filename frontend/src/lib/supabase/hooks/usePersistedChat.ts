'use client'

import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { createClient } from '../client'
import { addChatMessage, createChatSession } from '../chat'

export function usePersistedChat(userAddress: string | undefined) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const chat = useChat({
    api: '/api/chat',
    onFinish: async (message) => {
      // Persist assistant message to Supabase
      if (sessionId) {
        await addChatMessage(sessionId, 'assistant', message.content)
      }
    },
  })

  // Initialize or restore chat session
  useEffect(() => {
    if (!userAddress) return

    const initSession = async () => {
      setIsLoadingHistory(true)

      try {
        // Create new session
        const session = await createChatSession(userAddress)
        setSessionId(session.id)

        // TODO: Optionally restore last session instead of always creating new one
      } catch (error) {
        console.error('Failed to initialize chat session:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    initSession()
  }, [userAddress])

  // Persist user messages
  const sendMessage = async (content: string) => {
    if (sessionId) {
      // Persist user message to Supabase
      await addChatMessage(sessionId, 'user', content)
    }

    // Send to AI
    chat.append({ role: 'user', content })
  }

  return {
    ...chat,
    sendMessage,
    sessionId,
    isLoadingHistory,
  }
}
